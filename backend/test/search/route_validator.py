def sec_to_hhmm(sec):
    """
    秒からhh:mm形式の文字列に変換する。
    """
    hour = int(sec / 3600)
    minute = int((sec - hour * 3600) / 60)
    minute_str = str(minute)
    if minute <= 9:
        minute_str = "0" + minute_str
    hhmm = str(hour) + ":" + minute_str
    return hhmm


def hhmm_to_sec(hh_mm_str):
    """
    hh:mm形式の文字列から秒に変換する。
    """
    hour, minute = hh_mm_str.split(":")
    return int(hour) * 3600 + int(minute) * 60


class RouteValidator:
    def __init__(self):
        self.error_message =""

    def is_valid_route(self, search_input, route):
        """
        /search の入力であるdictと/searchの返却結果を受け取り、妥当なルートになっているかを検証する。

        Parameters:
        -----------
        search_input : dict
            /search の入力パラメタ。
        route : dict
            /search の出力ルート。

        Returns:
        --------
        result : bool
            妥当な経路になっている場合True, そうでなければFalse.
        """
        if not self.__exist_expect_keys(route):
            return False
        if not self.__check_basic_consistency_of_route(route):
            return False
        if not self.__check_time_consistency_of_route(route):
            return False
        return True

    def __exist_expect_keys(self, route):
        """
        ルートを構成するJsonに期待するキーが存在することを確認する。
        """
        expected_keys = ["start-time", "goal-time", "park-open-time", "park-close-time",
                         "violate-desired-arrival-time", "violate-business-hours", "cost", "spots", "subroutes"]
        for expected_key in expected_keys:
            if expected_key not in route:
                self.error_message = expected_key + "が存在しません。"
                return False
        spot_expected_keys = ["spot-id", "spot-name", "short-spot-name", "lat", "lon", "type", "arrival-time",
                              "specified-wait-time-result", "wait-time", "play-time", "depart-time", "stay-time",
                              "violate-business-hours", "violate-desired-arrival-time"]
        for expected_key in spot_expected_keys:
            for spot in route["spots"]:
                if expected_key not in spot:
                    self.error_message = expected_key + "が存在しません。"
                    return False
        subroute_expected_keys = ["start-spot-id", "goal-spot-id", "start-time", "goal-time", "distance",
                                  "transit-time", "coords", "surplus-wait-time"]
        for expected_key in subroute_expected_keys:
            for subroute in route["subroutes"]:
                if expected_key not in subroute:
                    self.error_message = expected_key + " が存在しません。"
                    return False
        return True

    def __check_basic_consistency_of_route(self, route):
        """
        routeを構成する情報の一貫性がとれていることを確認する。
        ただし、下記については別メソッドでチェックする。
        ・所要時間
        ・各種違反フラグ
        """
        spots = route["spots"]
        subroutes = route["subroutes"]
        if len(spots) == 0:
            # 経由地の数が0なら特に何もチェックしない
            return True
        if len(spots) - 1 != len(subroutes):
            self.error_message = "spotsの数とsubroutesの数が合っていません。"
            return False
        # 経路の出発時刻と到着時刻が、最初のスポットの出発時刻・最後のスポットの到着時刻と一致
        if spots[0]["depart-time"] != route["start-time"]:
            self.error_message = "最初のスポットの出発時刻と、経路の出発時刻が異なります。"
            return False
        if spots[-1]["arrival-time"] != route["goal-time"]:
            self.error_message = "最後のスポットの到着時刻と、経路の到着時刻が異なります。"
            return False
        # 各spotとsubrouteについて、出発時刻・到着時刻・スポットIDが一致
        for i, spot in enumerate(spots):
            if i == len(spots) - 1:
                continue
            subroute = subroutes[i]
            next_spot = spots[i + 1]
            if subroute["start-spot-id"] != spot["spot-id"]:
                self.error_message = "subrouteの出発地のspot-idと、出発スポットのspot-idが一致しません。"
                return False
            if subroute["goal-spot-id"] != next_spot["spot-id"]:
                self.error_message = "subrouteの目的地のspot-idと、目的スポットのspot-idが一致しません。"
                return False
            if subroute["start-time"] != spot["depart-time"]:
                self.error_message = "subrouteの出発時刻と、出発スポットの出発時刻が一致しません。"
                return False
            if subroute["goal-time"] != next_spot["arrival-time"]:
                self.error_message = "subrouteの到着時刻と、目的スポットの到着時刻が一致しません。"
                return False
        return True

    def __check_time_consistency_of_route(self, route):
        """
        ルートの所要時間に関する一貫性をチェックする。
        """
        spots = route["spots"]
        subroutes = route["subroutes"]
        spend_time = 0
        for i, spot in enumerate(spots):
            if i == len(spots) - 1:
                continue
            next_spot = spots[i + 1]
            subroute = subroutes[i]
            # 出発地スポットの出発時刻 + subroute所要時間 = 目的地スポットの到着時刻
            subroute_transit_time = subroute["transit-time"] + subroute["surplus-wait-time"] * 60
            if hhmm_to_sec(spot["depart-time"]) + subroute_transit_time != hhmm_to_sec(next_spot["arrival-time"]):
                self.error_message = str(i) + "番目のsubrouteが次式を満たしません：出発地スポットの出発時刻 + subroute所要時間 = 目的地スポットの到着時刻"
                return False
            # 目的地スポットの到着時刻 + 目的地スポットのでのイベント消化 = 目的地スポットの出発時刻
            goal_spot_time = max(next_spot["wait-time"], 0) * 60 + next_spot["specified-wait-time-result"] * 60 + \
                             next_spot["play-time"] * 60 + next_spot["stay-time"] * 60
            if hhmm_to_sec(next_spot["arrival-time"]) + goal_spot_time != hhmm_to_sec(next_spot["depart-time"]):
                self.error_message = str(i) + "番目のsubrouteが次式を満たしません：目的地スポットの到着時刻 + 目的地スポットのでのイベント消化 = 目的地スポットの出発時刻"
                return False
            spend_time += (subroute_transit_time + goal_spot_time)
        # 移動時間の合計 + スポットでのイベント消化時間の合計 = 所要時間
        if spend_time != hhmm_to_sec(route["goal-time"]) - hhmm_to_sec(route["start-time"]):
            self.error_message = "次式を満たしません：移動時間の合計 + スポットでのイベント消化時間の合計 = 所要時間"
            return False
        return True
