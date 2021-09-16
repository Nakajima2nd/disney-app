from disneyapp.data.data_manager import StaticDataManager
from disneyapp.data.spot_list_data_converter import SpotListDataConverter
from disneyapp.data.park_data_accessor import ParkDataAccessor
from disneyapp.algorithm.models import Tour, TourSpot, Subroute
import random, copy


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


class RandomTspSolver:
    TRY_TIMES = 1000  # 試行回数

    # 歩くスピード [m/s]
    WALK_SPEED_DICT = {
        "slow": 0.85,
        "normal": 1.00,
        "fast": 1.15
    }

    def __init__(self):
        # todo: このへんのdictはsolverではなくdata_managerで持つほうが良い。要リファクタ
        self.spot_data_dict = {}
        self.cost_table = RandomTspSolver.__make_cost_table()  # org_spot_id, dst_spot_id -> distance
        self.link_dict = RandomTspSolver.__make_link_dict()
        opening_hours = ParkDataAccessor.get_opening_hours()
        self.open_time = opening_hours.open_time
        self.close_time = opening_hours.close_time

    def exec(self, travel_input):
        """
        順列をランダムに生成して最もコストの小さい巡回路を生成する。

        Parameter
        ---------
        ravel_input : TravelInput
            巡回探索の入力オブジェクト。

        Returns:
        --------
        tour : Tour
            巡回探索の出力オブジェクト。
        """
        self.spot_data_dict = RandomTspSolver.__make_spot_data_dict(travel_input.wait_time_mode)
        if travel_input.optimize_spot_order == "true":
            return self.__make_tour_by_optimizing_spot_order(travel_input)
        else:
            return self.__make_tour_from_original_spot_order(travel_input)

    def __make_tour_by_optimizing_spot_order(self, travel_input):
        """
        スポットの並び順を最適化することによって巡回路を生成する。
        """
        base_tour = [ travel_input_spot.spot_id for travel_input_spot in travel_input.spots ]
        current_best_score = 9999999999999
        current_best_tour = None
        random.seed(1)
        for count in range(RandomTspSolver.TRY_TIMES):
            current_tour = random.sample(base_tour, len(base_tour))
            current_tour_with_od = [travel_input.start_spot_id] + current_tour + [travel_input.goal_spot_id]
            tour = self.__build_tour(travel_input, current_tour_with_od)
            score = tour.cost
            if score < current_best_score:
                current_best_score = score
                current_best_tour = copy.deepcopy(current_tour_with_od)
        return self.__build_tour(travel_input, current_best_tour)

    def __make_tour_from_original_spot_order(self, travel_input):
        """
        入力された順にスポットを並べて巡回路を構築する。
        """
        base_tour = [travel_input_spot.spot_id for travel_input_spot in travel_input.spots]
        current_tour_with_od = [travel_input.start_spot_id] + base_tour + [travel_input.goal_spot_id]
        return self.__build_tour(travel_input, current_tour_with_od)

    @staticmethod
    def __make_spot_data_dict(wait_time_mode):
        """
        巡回経路探索で用いるSpotデータを初期化する。

        Parameter
        ---------
        wait_time_mode : string
            待ち時間情報種別。
                real -> リアルタイム待ち時間
                mean -> 平均待ち時間
        """
        merged_spot_data_dict = SpotListDataConverter.get_merged_spot_data_dict()

        for spot_id in merged_spot_data_dict:
            # 暫定対応：play-timeをstringからintに変換する
            # todo: play-timeは元データの時点でint型にすべきなので、データで対応する
            if "play-time" in merged_spot_data_dict[spot_id]:
                merged_spot_data_dict[spot_id]["play-time"] = int(merged_spot_data_dict[spot_id]["play-time"])
            # play-time が存在しない場合は0埋めする
            if "play-time" not in merged_spot_data_dict[spot_id]:
                merged_spot_data_dict[spot_id]["play-time"] = 0
            # wait-time が存在しない場合は0埋めする
            if "wait-time" not in merged_spot_data_dict[spot_id]:
                merged_spot_data_dict[spot_id]["wait-time"] = 0
            # 平均待ち時間が指定された場合、wait-timeを平均待ち時間で上書きする
            if "mean-wait-time" in merged_spot_data_dict[spot_id] and wait_time_mode == "mean":
                merged_spot_data_dict[spot_id]["wait-time"] = merged_spot_data_dict[spot_id]["mean-wait-time"]
        return merged_spot_data_dict

    @staticmethod
    def __make_cost_table():
        all_spot_pair_list = StaticDataManager.get_all_spot_pair()
        cost_table = {}
        for spot_pair in all_spot_pair_list:
            key = (spot_pair["org-spot-id"], spot_pair["dst-spot-id"])
            node_list = spot_pair["nodes"]
            cost_table[key] = {
                "distance": spot_pair["distance"],
                "nodes": node_list
            }
        return cost_table

    @staticmethod
    def __make_link_dict():
        link_list = StaticDataManager.get_links()
        link_dict = {}
        for link in link_list:
            key = (int(link["org-node-id"]), int(link["dst-node-id"]))
            link_dict[key] = link["coords"]
        return link_dict

    def __eval_spot_list_order(self, tour):
        """
        巡回順の評価値を返す。
        """
        # コストのベースは目的地の到着時刻
        score = hhmm_to_sec(tour.goal_time)
        for spot in tour.spots:
            # スポットの営業時間を1つ破るたびに2時間のペナルティ
            if spot.violate_business_hours:
                score += hhmm_to_sec("02:00")
            # 到着希望時刻を1つ違反するたびに2時間のペナルティ
            if spot.violate_desired_arrival_time:
                score += hhmm_to_sec("02:00")
        return score

    def __build_tour(self, travel_input, spot_order):
        """
        巡回探索の入出力を受け取り、返却情報を構築する。
        """
        tour = self.__trace_from_front(travel_input, spot_order)
        self.__set_subroute_coordinates(tour)
        self.__set_spot(spot_order, tour, travel_input)
        tour.cost = self.__eval_spot_list_order(tour)
        return tour

    def __set_subroute_coordinates(self, tour):
        """
        Tourオブジェクトの個別経路の形状点列を設定する。
        """
        subroutes = tour.subroutes
        for subroute in subroutes:
            node_list = self.cost_table[(subroute.start_spot_id, subroute.goal_spot_id)]["nodes"]
            for i, dst_node_id in enumerate(node_list):
                if i == 0:
                    continue
                org_node_id = node_list[i - 1]
                coord_list = self.__node_pair_to_coords(org_node_id, dst_node_id)
                subroute.coords.extend(coord_list)

    def __set_spot(self, spot_order, tour, travel_input):
        """
        Tourオブジェクトのスポット情報を設定する。
        note: 個別経路の情報を参照するので、tour.subroutes が計算済である必要がある。
        """
        assert len(tour.subroutes) != 0
        # (経路によらない)スポットの情報をセット
        for spot_id in spot_order:
            tour_spot = TourSpot()
            tour_spot.spot_id = spot_id
            tour_spot.spot_name = self.spot_data_dict[spot_id]["name"]
            tour_spot.spot_short_name = self.spot_data_dict[spot_id]["short-name"]
            tour_spot.lat = self.spot_data_dict[spot_id]["lat"]
            tour_spot.lon = self.spot_data_dict[spot_id]["lon"]
            tour_spot.type = self.spot_data_dict[spot_id]["type"]
            tour_spot.wait_time = self.spot_data_dict[spot_id]["wait-time"]
            tour_spot.play_time = self.spot_data_dict[spot_id]["play-time"]
            tour.spots.append(tour_spot)
        # スポットの発着時刻をセット
        for i, subroute in enumerate(tour.subroutes):
            tour.spots[i].depart_time = subroute.start_time
            tour.spots[i + 1].arrival_time = subroute.goal_time
            if i == 0:
                # スタートの場合、到着時刻を出発時刻に合わせる
                tour.spots[i].arrival_time = tour.spots[i].depart_time
            if i == len(tour.subroutes) - 1:
                # ゴールの場合、出発時刻を到着時刻に合わせる
                tour.spots[i + 1].depart_time = tour.spots[i + 1].arrival_time
        for i, spot in enumerate(tour.spots):
            if "start-time" in self.spot_data_dict[spot.spot_id] and self.spot_data_dict[spot.spot_id]["start-time"] != "":
                # 営業開始より前に到着していないかチェック
                business_hours_start_time = self.spot_data_dict[spot.spot_id]["start-time"]  # 該当スポットの営業開始時刻
                if spot.arrival_time != "":
                    if hhmm_to_sec(spot.arrival_time) < hhmm_to_sec(business_hours_start_time):
                        tour.spots[i].violate_business_hours = True
                        tour.violate_business_hours = True
            else:
                # 営業開始時刻が取得できない場合、開園時間より前に到着していないかチェック
                if spot.arrival_time != "":
                    if hhmm_to_sec(spot.arrival_time) < hhmm_to_sec(self.open_time):
                        tour.spots[i].violate_business_hours = True
                        tour.violate_business_hours = True
            if "end-time" in self.spot_data_dict[spot.spot_id] and self.spot_data_dict[spot.spot_id]["end-time"] != "":
                # 営業終了より後に出発していないかチェック
                business_hours_end_time = self.spot_data_dict[spot.spot_id]["end-time"]  # 該当スポットの営業終了時刻
                if spot.depart_time != "":
                    if hhmm_to_sec(business_hours_end_time) < hhmm_to_sec(spot.depart_time):
                        tour.spots[i].violate_business_hours = True
                        tour.violate_business_hours = True
            else:
                # 営業終了時刻が取得できない場合、閉園時間より後に出発していないかチェック
                if spot.depart_time != "":
                    if hhmm_to_sec(self.close_time) < hhmm_to_sec(spot.depart_time):
                        tour.spots[i].violate_business_hours = True
                        tour.violate_business_hours = True
            # 到着希望時刻を守っているかチェック
            for input_spot in travel_input.spots:
                if input_spot.spot_id != spot.spot_id:
                    continue
                if input_spot.desired_arrival_time == -1:
                    continue
                if input_spot.desired_arrival_time != hhmm_to_sec(spot.arrival_time):
                    tour.spots[i].violate_desired_arrival_time = True
                    tour.violate_desired_arrival_time = True

    @staticmethod
    def __find_target_spot_from_travel_input(travel_input, target_spot_id):
        """
        travel_inputから指定されたspot_idのスポットを検索して返す。
        指定されたspot_idが存在しない場合はNoneを返す。
        """
        spots = travel_input.spots
        for spot in spots:
            if spot.spot_id == target_spot_id:
                return spot
        return None

    def __trace_from_front(self, travel_input, spot_order):
        """
        巡回経路を出発側からTraceし、スポットの到着時刻を算出する。
        """
        tour = Tour()
        tour.start_time = sec_to_hhmm(travel_input.specified_time)
        current_time = travel_input.specified_time
        for i, dst_spot_id in enumerate(spot_order):
            if i == 0:
                continue
            subroute = Subroute()

            # 個別経路のorg, dstのスポットIDを設定
            subroute.start_spot_id = spot_order[i - 1]
            subroute.goal_spot_id = dst_spot_id
            subroute.start_time = sec_to_hhmm(current_time)

            # orgスポットからdstスポットに移動する
            subroute.distance = int(self.cost_table[(subroute.start_spot_id, subroute.goal_spot_id)]["distance"])
            speed = RandomTspSolver.WALK_SPEED_DICT[travel_input.walk_speed]
            subroute.transit_time = int(float(subroute.distance) / speed)
            current_time += subroute.transit_time
            # note: 目的地に到着希望時刻が設定されている & 到着希望時刻より前に到着した場合は、到着希望時刻まで待機する
            desired_arrival_time = -1
            stay_time = -1
            for spot in travel_input.spots:
                if spot.spot_id == dst_spot_id:
                    desired_arrival_time = spot.desired_arrival_time
                    stay_time = spot.stay_time
            if desired_arrival_time != -1:
                subroute.surplus_wait_time = max(desired_arrival_time - current_time, 0)
                current_time = max(current_time, desired_arrival_time)
            subroute.goal_time = sec_to_hhmm(current_time)

            # dstスポットのイベントを消化するまでの時間を計測
            current_time += max(self.spot_data_dict[dst_spot_id]["wait-time"] * 60, 0)  # note:待ち時間が-1の場合は0にする
            dst_spot = RandomTspSolver.__find_target_spot_from_travel_input(travel_input, dst_spot_id)
            current_time += dst_spot.specified_wait_time if dst_spot else 0
            current_time += self.spot_data_dict[dst_spot_id]["play-time"]
            current_time += stay_time if stay_time != -1 else 0
            tour.subroutes.append(subroute)
            del subroute
        tour.goal_time = sec_to_hhmm(current_time)
        return tour

    def __node_pair_to_coords(self, org_node_id, dst_node_id):
        """
        2つのノードペアから形状点列を返す。

        note: インプットのノードペアから成るリンクが存在しない場合、空リストを返す。
        """
        key = (org_node_id, dst_node_id)
        if self.link_dict.get((org_node_id, dst_node_id)):
            return self.link_dict[(org_node_id, dst_node_id)]
        if self.link_dict.get(dst_node_id, org_node_id):
            return list(reversed(self.link_dict[(dst_node_id, org_node_id)]))
        return []