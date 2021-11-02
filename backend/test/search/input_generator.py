import random


class InputGenerator:
    random.seed(1)

    def __init__(self, spot_list):
        self.spot_list = spot_list

    def generate_search_input(self, size):
        """
        /search の入力となるdictをランダムに（網羅的に）生成する。

        Parameter:
        ----------
        size : int
            返却するdictの個数。
        """
        search_input_list = []
        for count in range(size):
            search_input = dict()
            search_input["specified-time"] = InputGenerator.__get_specified_time()
            search_input["walk-speed"] = InputGenerator.__get_walk_speed()
            search_input["start-spot-id"] = self.__get_start_spot_id()
            search_input["goal-spot-id"] = self.__get_goal_spot_id()
            search_input["optimize-spot-order"] = InputGenerator.__get_optimize_spot_order()
            search_input["start-today"] = InputGenerator.__get_start_today()
            search_input["spots"] = self.__get_spots()
            search_input_list.append(search_input)
        return search_input_list

    @staticmethod
    def __get_specified_time():
        specified_time_list = ["9:00", "12:00", "15:00", "18:00"]
        return random.choice(specified_time_list)

    @staticmethod
    def __get_walk_speed():
        walk_speed_list = ["slow", "normal", "fast"]
        return random.choice(walk_speed_list)

    def __get_random_spot(self):
        spot_type_list = ["attraction", "restaurant", "show", "greeting", "place", "shop"]
        spot_type = random.choice(spot_type_list)
        spot = random.choice(self.spot_list[spot_type])
        # 一応、スポットのタイプを付与する
        spot["type"] = spot_type
        return spot

    def __get_start_spot_id(self):
        return 103
        # return self.__get_random_spot()["spot-id"]

    def __get_goal_spot_id(self):
        return 103
        # return self.__get_random_spot()["spot-id"]

    @staticmethod
    def __get_optimize_spot_order():
        optimize_spot_order_list = ["true", "false"]
        return random.choice(optimize_spot_order_list)

    @staticmethod
    def __get_start_today():
        start_today_list = ["true", "false"]
        return random.choice(start_today_list)

    def __set_desired_arrival_time(self, spot):
        # 1/6の確率で到着時刻を設定する
        set_arrival_time = [True, False, False, False, False, False]
        if random.choice(set_arrival_time):
            desired_arrival_time_list = ["10:00", "11:00", "13:00",
                                         "14:00", "15:00", "16:00",
                                         "17:00", "18:00", "19:00"]
            desired_arrival_time = random.choice(desired_arrival_time_list)
            spot["desired-arrival-time"] = desired_arrival_time

    def __set_stay_time(self, spot):
        # 1/5の確率で滞在時間を設定する
        set_arrival_time = [True, False, False, False, False]
        if random.choice(set_arrival_time):
            stay_time_list = ["10", "30", "60"]
            stay_time = random.choice(stay_time_list)
            spot["stay-time"] = stay_time

    def __set_specified_wait_time(self, spot):
        # 1/5の確率で指定待ち時間を指定する
        set_arrival_time = [True, False, False, False, False]
        if random.choice(set_arrival_time):
            specified_wait_time_list = ["10", "30", "60"]
            specified_wait_time = random.choice(specified_wait_time_list)
            spot["specified-wait-time"] = specified_wait_time

    def __get_spots(self):
        spot_num_candidate = [5, 10, 15]
        spot_num = random.choice(spot_num_candidate)
        spots = []
        for i in range(spot_num):
            spot = dict()
            spot_info = self.__get_random_spot()
            spot["spot-id"] = spot_info["spot-id"]
            # 到着希望時刻
            if spot_info["type"] in ["attraction", "restaurant", "place", "greeting", "show"]:
                self.__set_desired_arrival_time(spot)
            # 滞在時間
            if spot_info["type"] in ["restaurant", "shop"]:
                self.__set_stay_time(spot)
            # 指定待ち時間
            if spot_info["type"] == "show":
                self.__set_specified_wait_time(spot)
            spots.append(spot)
        return spots
