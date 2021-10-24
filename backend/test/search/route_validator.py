class RouteValidator:
    @staticmethod
    def is_valid_route(search_input, route):
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
        if not RouteValidator.__exist_expect_keys(route):
            return False
        return True

    @staticmethod
    def __exist_expect_keys(route):
        """
        ルートを構成するJsonに期待するキーが存在することを確認する。
        """
        expected_keys = ["start-time", "goal-time", "park-open-time", "park-close-time",
                         "violate-desired-arrival-time", "violate-business-hours", "cost", "spots", "subroutes"]
        for expected_key in expected_keys:
            if expected_key not in route:
                return False
        spot_expected_keys = ["spot-id", "spot-name", "short-spot-name", "lat", "lon", "type", "arrival_time",
                              "specified-wait-time-result", "wait-time", "play-time", "depart-time", "stay-time",
                              "violate-business-hours", "violate-desired-arrival-time"]
        for expected_key in spot_expected_keys:
            for spot in route["spots"]:
                if expected_key not in spot:
                    return False
        subroute_expected_keys = ["start-spot-id", "goal-spot-id", "start-time", "goal-time", "distance",
                                  "transit-time", "coords", "surplus-wait-time"]
        for expected_key in subroute_expected_keys:
            for subroute in route["subroutes"]:
                if expected_key not in subroute:
                    return False
        return True
