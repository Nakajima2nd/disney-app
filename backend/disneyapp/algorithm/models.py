from disneyapp.data.data_manager import StaticDataManager


class Subroute:
    def __init__(self):
        self.start_spot_id = -1
        self.goal_spot_id = -1
        self.start_time = ""
        self.goal_time = ""
        self.distance = -1
        self.transit_time = -1
        # 時刻指定などが原因で発生した、余分な待ち時間
        self.surplus_wait_time = 0
        self.coords = []

    def to_dict(self):
        ret_dict = dict()
        ret_dict["start-spot-id"] = self.start_spot_id
        ret_dict["goal-spot-id"] = self.goal_spot_id
        ret_dict["start-time"] = self.start_time
        ret_dict["goal-time"] = self.goal_time
        ret_dict["distance"] = self.distance
        ret_dict["transit-time"] = self.transit_time
        ret_dict["coords"] = []
        for coord in self.coords:
            pair = [ coord[0], coord[1] ]
            ret_dict["coords"].append(pair)
        ret_dict["surplus-wait-time"] = self.surplus_wait_time
        return ret_dict


class TourSpot:
    def __init__(self):
        self.spot_id = -1
        self.spot_name = ""
        self.spot_short_name = ""
        self.lat = ""
        self.lon = ""
        self.type = ""
        self.play_time = -1 # sec
        self.wait_time = -1
        self.arrival_time = ""
        self.depart_time = ""
        self.violate_business_hours = False
        self.violate_desired_arrival_time = False

    def to_dict(self):
        ret_dict = dict()
        ret_dict["spot-id"] = self.spot_id
        ret_dict["spot-name"] = self.spot_name
        ret_dict["short-spot-name"] = self.spot_short_name
        ret_dict["lat"] = self.lat
        ret_dict["lon"] = self.lon
        ret_dict["type"] = self.type
        ret_dict["play-time"] = self.play_time
        ret_dict["wait-time"] = self.wait_time
        ret_dict["arrival-time"] = self.arrival_time
        ret_dict["depart-time"] = self.depart_time
        ret_dict["violate-business-hours"] = self.violate_business_hours
        ret_dict["violate-desired-arrival-time"] = self.violate_desired_arrival_time
        return ret_dict


class Tour:
    def __init__(self):
        self.start_time = ""  # hh:mm
        self.goal_time = ""   # hh:mm
        self.spots = []
        self.subroutes = []
        self.violate_desired_arrival_time = False
        self.violate_business_hours = False
        self.cost = -1

    def to_dict(self):
        ret_dict = dict()
        ret_dict["start-time"] = self.start_time
        ret_dict["goal-time"] = self.goal_time
        ret_dict["violate-desired-arrival-time"] = self.violate_desired_arrival_time
        ret_dict["violate-business-hours"] = self.violate_business_hours
        ret_dict["cost"] = self.cost
        ret_dict["spots"] = []
        for spot in self.spots:
            ret_dict["spots"].append(spot.to_dict())
        ret_dict["subroutes"] = []
        for subroute in self.subroutes:
            ret_dict["subroutes"].append(subroute.to_dict())
        return ret_dict


class TravelInputSpot:
    def __init__(self):
        self.spot_id = -1
        self.desired_arrival_time = -1  # 00:00 からの経過秒数
        self.stay_time = -1  # [秒]
        self.specified_wait_time = 0


class TravelInput:
    """
    /search の入力情報を保持するクラス。入力情報のバリデーションもこのクラスで実施する。
    """
    def __init__(self, json_data):
        self.time_mode = ""
        self.wait_time_mode = "mean"
        self.specified_time = -1  # 00:00からの経過秒数
        self.walk_speed = ""
        self.start_spot_id = -1
        self.goal_spot_id = -1
        self.spots = []
        self.error_message = ""
        self.optimize_spot_order = "true"
        self.start_today = "true"
        self.init_by_json(json_data)

    def __init_time_mode(self, json_data):
        """
        time_modeを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if not json_data.get("time-mode"):
            self.error_message = "time-modeが存在しません。"
            return False
        self.time_mode = json_data["time-mode"]
        valid_time_mode_list = ["start", "end"]
        if self.time_mode not in valid_time_mode_list:
            self.error_message = "time-modeはstart/endのいずれかを指定してください。"
            return False
        return True

    def __init_specified_time(self, json_data):
        """
        specified_timeを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if not json_data.get("specified-time"):
            self.error_message = "specified-timeが存在しません。"
            return False
        specified_time_str = json_data["specified-time"]
        try:
            # hh:mm -> 秒数 への変換
            split_time_str = specified_time_str.split(":")
            self.specified_time = int(split_time_str[0]) * 3600 + int(split_time_str[1]) * 60
        except:
            self.error_message = "時間の形式が不正です。hh:mm形式で指定してください。"
            return False
        return True

    def __init_walk_speed(self, json_data):
        """
        walk_speedを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if not json_data.get("walk-speed"):
            self.error_message = "walk-speedが存在しません。"
            return False
        self.walk_speed = json_data["walk-speed"]
        valid_walk_speed_list = ["slow", "normal", "fast"]
        if self.walk_speed not in valid_walk_speed_list:
            self.error_message = "walk-speedはslow/normal/fastのいずれかを指定してください。"
            return False
        return True

    def __init_start_spot_id(self, json_data):
        """
        start_spot_idを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if json_data.get("start-spot-id") == None:
            self.error_message = "start-spot-idが存在しません。"
            return False
        try:
            self.start_spot_id = int(json_data["start-spot-id"])
        except:
            self.error_message = "start-spot-idには整数を指定してください。"
            return False
        if not StaticDataManager.is_exist_spot_id(self.start_spot_id):
            self.error_message = "start-spot-idに存在しないスポットID(" + str(self.start_spot_id) + ")が指定されています。"
            return False
        return True

    def __init_goal_spot_id(self, json_data):
        """
        goal_spot_idを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if json_data.get("goal-spot-id") == None:
            self.error_message = "goal-spot-idが存在しません。"
            return False
        try:
            self.goal_spot_id = int(json_data["goal-spot-id"])
        except:
            self.error_message = "goal-spot-idには整数を指定してください。"
            return False
        if not StaticDataManager.is_exist_spot_id(self.goal_spot_id):
            self.error_message = "goal-spot-idに存在しないスポットID(" + str(self.goal_spot_id) + ")が指定されています。"
            return False
        return True

    def __init_spot(self, spot_json):
        """
        TravelInputSpotオブジェクトを生成する。
        生成に失敗した場合はNoneを返す。
        """
        # spot-id
        if spot_json.get("spot-id") == None:
            self.error_message = "spot-idの存在しないspotが存在します。"
            return None
        travel_input_spot = TravelInputSpot()
        try:
            travel_input_spot.spot_id = int(spot_json["spot-id"])
        except:
            self.error_message = "spot-idには整数を指定してください。"
            return None
        if not StaticDataManager.is_exist_spot_id(travel_input_spot.spot_id):
            self.error_message = "spot-idに存在しないスポットID(" + str(travel_input_spot.spot_id) + ")が指定されています。"
            return None

        spot_type = StaticDataManager.get_spot_attr(travel_input_spot.spot_id)["type"]

        # desired-arrival-time
        if spot_json.get("desired-arrival-time"):
            if spot_type not in ["attraction", "greeting", "restaurant", "place", "show"]:
                self.error_message = "desired-arrival-timeを指定できるのは、attraction/greeting/restaurant/place/showのいずれかのみです。"
                return None
            try:
                # hh:mm -> 秒数 への変換
                hh_str, mm_str = spot_json["desired-arrival-time"].split(":")
                travel_input_spot.desired_arrival_time = int(hh_str) * 3600 + int(mm_str) * 60
            except:
                self.error_message = "時間の形式が不正です。hh:mm形式で指定してください。"
                return None

        # stay-time
        if spot_json.get("stay-time"):
            if spot_type not in ["restaurant", "shop"]:
                self.error_message = "stay-timeを指定できるのは、restaurant/shopのいずれかのみです。"
                return None
            try:
                travel_input_spot.stay_time = int(spot_json["stay-time"]) * 60
            except:
                self.error_message = "stay-timeには整数を指定してください。"
                return None

        # specified-wait-time
        if spot_json.get("specified-wait-time"):
            if spot_type != "show":
                self.error_message = "specified-wait-timeを指定できるのはshowのみです。"
                return None
            try:
                # note: 指定された待ち時間の分だけ到着希望時刻を早める
                travel_input_spot.desired_arrival_time -= int(spot_json["specified-wait-time"]) * 60
                travel_input_spot.specified_wait_time = int(spot_json["specified-wait-time"]) * 60
            except:
                self.error_message = "specified-wait-timeには整数を指定してください。"
                return None

        return travel_input_spot

    def __init_spots(self, json_data):
        """
        spotsを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if json_data.get("spots") == None:
            self.error_message = "spotsが存在しません。"
            return False
        spots = json_data["spots"]
        if len(spots) == 0:
            self.error_message = "spotsの要素数は1つ以上指定してください。"
            return False
        for i, spot_json in enumerate(spots):
            if spot_json.get("spot-id") == None:
                self.error_message = str(i) + "番目のspotにspot-idが存在しません。"
                return False
            if not (travel_input_spot := self.__init_spot(spot_json)):
                return False
            self.spots.append(travel_input_spot)
        return True

    def __init_optimize_spot_order(self, json_data):
        if not json_data.get("optimize-spot-order"):
            self.error_message = "optimize-spot-orderが存在しません。"
            return False
        self.optimize_spot_order = json_data["optimize-spot-order"]
        valid_optimize_spot_order_list = ["true", "false"]
        if self.optimize_spot_order not in valid_optimize_spot_order_list:
            self.error_message = "optimize-spot-orderはtrue/falseのいずれかで指定してください。"
            return False
        return True

    def __init_start_today(self, json_data):
        # note: フロントエンドの対応が入るまではバックエンドAPIの破壊的変更を入れない
        if "start-today" in json_data:
            self.start_today = json_data["start-today"]
        return True
        # if not json_data.get("start-today"):
        #     self.error_message = "start-todayが存在しません"
        #     return False
        # self.start_today = json_data["start-today"]
        # valid_start_today_list = ["true", "false"]
        # if self.start_today not in valid_start_today_list:
        #     self.error_message = "start-todayはtrue/falseのいずれかで指定してください。"
        #     return False
        # return True

    def init_by_json(self, json_data):
        # note: time-modeはいったんdisableにする
        # if not self.__init_time_mode(json_data):
        #     return
        if not self.__init_specified_time(json_data):
            return
        if not self.__init_walk_speed(json_data):
            return
        if not self.__init_start_spot_id(json_data):
            return
        if not self.__init_goal_spot_id(json_data):
            return
        if not self.__init_optimize_spot_order(json_data):
            return
        if not self.__init_start_today(json_data):
            return
        self.__init_spots(json_data)
