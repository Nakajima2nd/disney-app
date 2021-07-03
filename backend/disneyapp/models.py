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
        self.stay_time = -1  # [秒]


class TravelInput:
    def __init__(self, json_data):
        self.time_mode = ""
        self.specified_time = 0  # 00:00からの経過秒数
        self.walk_speed = ""
        self.spots = []
        self.error_message = ""
        self.init_by_json(json_data)

    def init_by_json(self, json_data):
        # time_mode
        if not json_data.get("time-mode"):
            self.error_message = "time-modeが存在しません。"
            return
        self.time_mode = json_data["time-mode"]
        valid_time_mode_list = ["start", "end"]
        if self.time_mode not in valid_time_mode_list:
            self.error_message = "time-modeはstart/endのいずれかを指定してください。"
            return

        # specified-time
        if not json_data.get("specified-time"):
            self.error_message = "specified-timeが存在しません。"
            return
        specified_time_str = json_data["specified-time"]
        try:
            # hh:mm -> 秒数 への変換
            hh_str, mm_str = specified_time_str.split(":")
            self.specified_time = int(hh_str) * 3600 + int(mm_str) * 60
        except:
            self.error_message = "時間の形式が不正です。hh:mm形式で指定してください。"

        # walk-speed
        if not json_data.get("walk-speed"):
            self.error_message = "walk-speedが存在しません。"
            return
        self.walk_speed = json_data["walk-speed"]
        valid_walk_speed_list = ["slow", "normal", "fast"]
        if self.walk_speed not in valid_walk_speed_list:
            self.error_message = "walk-speedはslow/normal/fastのいずれかを指定してください。"
            return

        # spots
        if not json_data.get("spots"):
            self.error_message = "spotsが存在しません。"
            return
        spots = json_data["spots"]
        if len(spots) < 3:
            self.error_message = "spotsの要素数は3つ以上指定してください。"
            return
        for spot in spots:
            if not spot.get("spot-id"):
                self.error_message = "spot-idの存在しないspotが存在します。"
                return
            travel_input_spot = TravelInputSpot()
            try:
                travel_input_spot.spot_id = int(spot["spot-id"])
            except:
                self.error_message = "spot-idには整数を指定してください。"
                return
            if not StaticDataManager.is_exist_spot_id(travel_input_spot.spot_id):
                self.error_message = "spot-idに存在しないスポットID(" + str(travel_input_spot.spot_id) + ")が指定されています。"
                return
            if json_data.get("stay-time"):
                try:
                    travel_input_spot.stay_time = int(json_data["stay-time"])
                except:
                    self.error_message = "stay-timeには整数を指定してください。"
            self.spots.append(travel_input_spot)


