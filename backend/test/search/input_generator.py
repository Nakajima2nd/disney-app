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
        spot["spot-type"] = spot_type
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

    def __get_spots(self):
        spot_num_candidate = [5, 10, 15]
        spot_num = random.choice(spot_num_candidate)
        spots = []
        for i in range(spot_num):
            spot = dict()
            spot["spot-id"] = self.__get_random_spot()["spot-id"]
            spots.append(spot)
        return spots
