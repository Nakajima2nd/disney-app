from disneyapp.data_manager import StaticDataManager


class Subroute:
    def __init__(self):
        self.start_spot_id = -1
        self.goal_spot_id = -1
        self.start_time = ""
        self.goal_time = ""
        self.distance = -1
        self.transit_time = -1
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
        return ret_dict


class TourSpot:
    def __init__(self):
        self.spot_id = -1
        self.spot_name = ""
        self.lat = ""
        self.lon = ""
        self.type = ""
        self.play_time = -1 # sec
        self.wait_time = -1

    def to_dict(self):
        ret_dict = dict()
        ret_dict["spot-id"] = self.spot_id
        ret_dict["spot-name"] = self.spot_name
        ret_dict["lat"] = self.lat
        ret_dict["lon"] = self.lon
        ret_dict["type"] = self.type
        ret_dict["play-time"] = self.play_time
        ret_dict["wait-time"] = self.wait_time
        return ret_dict


class Tour:
    def __init__(self):
        self.start_time = ""  # hh:mm
        self.goal_time = ""   # hh:mm
        self.spots = []
        self.subroutes = []

    def to_dict(self):
        ret_dict = dict()
        ret_dict["start-time"] = self.start_time
        ret_dict["goal-time"] = self.goal_time
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
        self.desired_arrival_time = 0  # 00:00 からの経過秒数
        self.stay_time = -1  # [秒]
        self.specified_wait_time = 0  # [秒]


class TravelInput:
    def __init__(self, json_data):
        self.time_mode = ""
        self.specified_time = 0  # 00:00からの経過秒数
        self.walk_speed = ""
        self.start_spot_id = -1
        self.goal_spot_id = -1
        self.spots = []
        self.error_message = ""
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
            hh_str, mm_str = specified_time_str.split(":")
            self.specified_time = int(hh_str) * 3600 + int(mm_str) * 60
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
        if not json_data.get("start-spot-id"):
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
        if not json_data.get("goal-spot-id"):
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
        if not spot_json.get("spot-id"):
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
            if spot_type not in ["attraction", "greeting", "restaurant", "place"]:
                self.error_message = "desired-arrival-timeを指定できるのは、attraction/greeting/restaurant/placeのいずれかのみです。"
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
                travel_input_spot.specified_wait_time = int(spot_json["specified-wait-time"]) * 60
            except:
                self.error_message = "specified-wait-timeには整数を指定してください。"
                return None

        return travel_input_spot

    def __init_spots(self, json_data):
        """
        spotsを初期化する。初期化に失敗した場合はFalseを返す。
        """
        if not json_data.get("spots"):
            self.error_message = "spotsが存在しません。"
            return False
        spots = json_data["spots"]
        if len(spots) < 3:
            self.error_message = "spotsの要素数は3つ以上指定してください。"
            return False
        for spot_json in spots:
            if not (travel_input_spot := self.__init_spot(spot_json)):
                return False
            self.spots.append(travel_input_spot)
        return True

    def init_by_json(self, json_data):
        if not self.__init_time_mode(json_data):
            return
        if not self.__init_specified_time(json_data):
            return
        if not self.__init_walk_speed(json_data):
            return
        if not self.__init_start_spot_id(json_data):
            return
        if not self.__init_goal_spot_id(json_data):
            return
        self.__init_spots(json_data)
