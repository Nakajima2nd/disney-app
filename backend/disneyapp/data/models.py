class AttractionSpotInfo:
    """
    spot/list で返却するアトラクション情報のクラス。
    """
    def __init__(self):
        # static data
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.play_time = -1
        self.url = ""
        self.area = ""
        self.speed_thrill = "false"
        self.description = ""
        # dynamic data
        self.enable = True
        self.wait_time = -1
        self.mean_wait_time = -1
        self.timespan_mean_wait_time = {}
        self.standby_pass_status = ""
        self.status = ""
        self.start_time = ""
        self.end_time = ""

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.play_time = obj["play-time"] if obj.get("play-time") else -1
        self.url = obj["url"]
        self.area = obj["area"]
        self.speed_thrill = obj["speed-thrill"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        self.enable = False if obj["disable-flag"] else True
        self.wait_time = int(obj["wait-time"])
        self.mean_wait_time = int(obj["mean-wait-time"])
        self.timespan_mean_wait_time = obj["timespan-mean-wait-time"]
        self.standby_pass_status = obj["standby-pass-status"]
        self.status = obj["status"]
        self.start_time = obj["start-time"]
        self.end_time = obj["end-time"]

    def to_dict(self):
        return [{
            "spot-id": self.spot_id,
            "name": self.name,
            "short-name": self.short_name,
            "lat": self.lat,
            "lon": self.lon,
            "play-time": self.play_time,
            "url": self.url,
            "area": self.area,
            "speed-thrill": self.speed_thrill,
            "description": self.description,
            "enable": self.enable,
            "wait-time": self.wait_time,
            "mean-wait-time": self.mean_wait_time,
            "timespan-mean-wait-time": self.timespan_mean_wait_time,
            "standby-pass-status": self.standby_pass_status,
            "status": self.status,
            "start-time": self.start_time,
            "end-time": self.end_time,
            "type": "attraction"
        }]


class RestaurantSpotInfo:
    """
    spot/list で返却するレストラン情報のクラス。
    """
    def __init__(self):
        # static data
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.url = ""
        self.menu_url = ""
        self.can_reserve = "false"
        self.area = ""
        self.menu_type = []
        self.budget_day = ""
        self.budget_night = ""
        self.seats = ""
        self.description = ""
        # dynamic data
        self.enable = True
        self.wait_time = -1
        self.mean_wait_time = -1
        self.timespan_mean_wait_time = {}
        self.status = ""
        self.start_time = ""
        self.end_time = ""

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.url = obj["url"]
        self.menu_url = obj["menu-url"]
        self.can_reserve = obj["can-reserve"]
        self.area = obj["area"]
        self.menu_type = obj["menu-type"]
        self.budget_day = obj["budget-day"]
        self.budget_night = obj["budget-night"]
        self.seats = obj["seats"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        self.enable = False if obj["disable-flag"] else True
        self.wait_time = int(obj["wait-time"])
        self.mean_wait_time = int(obj["mean-wait-time"])
        self.timespan_mean_wait_time = obj["timespan-mean-wait-time"]
        self.status = obj["status"]
        self.start_time = obj["start-time"]
        self.end_time = obj["end-time"]

    def to_dict(self):
        return [{
            "spot-id": self.spot_id,
            "name": self.name,
            "short-name": self.short_name,
            "lat": self.lat,
            "lon": self.lon,
            "url": self.url,
            "menu-url": self.menu_url,
            "can-reserve": self.can_reserve,
            "area": self.area,
            "menu-type": self.menu_type,
            "budget-day": self.budget_day,
            "budget-night": self.budget_night,
            "seats": self.seats,
            "description": self.description,
            "enable": self.enable,
            "wait-time": self.wait_time,
            "mean-wait-time": self.mean_wait_time,
            "timespan-mean-wait-time": self.timespan_mean_wait_time,
            "status": self.status,
            "start-time": self.start_time,
            "end-time": self.end_time,
            "type": "restaurant"
        }]


class ShowSpotInfo:
    """
    spot/list で返却するショー情報のクラス。
    """
    def __init__(self):
        # static data
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.play_time = -1
        self.url = ""
        self.area = ""
        self.description = ""
        # dynamic data
        self.enable = True
        self.next_start_time = ""
        self.start_time_list = []

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.play_time = obj["play-time"] if obj.get("play-time") else -1
        self.url = obj["url"]
        self.area = obj["area"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        self.enable = False if obj["disable-flag"] else True
        self.next_start_time = obj["next-start-time"]
        self.start_time_list = obj["start-time-list"]

    def to_dict(self):
        ret_list = []
        for start_time in self.start_time_list:
            ret_list.append(
                {
                    "spot-id": self.spot_id,
                    "name": self.name + "(" + start_time + ")",
                    "short-name": self.short_name + "(" + start_time + ")",
                    "lat": self.lat,
                    "lon": self.lon,
                    "play-time": self.play_time,
                    "url": self.url,
                    "area": self.area,
                    "description": self.description,
                    "enable": self.enable,
                    "next-start-time": self.next_start_time,
                    "start-time": start_time,
                    "type": "show"
                }
            )
        return ret_list


class GreetingSpotInfo:
    """
    spot/list で返却するグリーティング情報のクラス。
    """
    def __init__(self):
        # static data
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.play_time = -1
        self.url = ""
        self.area = ""
        self.character = ""
        self.description = ""
        # dynamic data
        self.enable = True
        self.standby_pass_status = ""
        self.wait_time = -1
        self.mean_wait_time = -1
        self.timespan_mean_wait_time = {}
        self.status = ""
        self.start_time = ""
        self.end_time = ""

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.play_time = obj["play-time"] if obj.get("play-time") else -1
        self.url = obj["url"]
        self.area = obj["area"]
        self.character = obj["character"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        self.enable = False if obj["disable-flag"] else True
        self.standby_pass_status = obj["standby-pass-status"]
        self.wait_time = int(obj["wait-time"])
        self.mean_wait_time = int(obj["mean-wait-time"])
        self.timespan_mean_wait_time = obj["timespan-mean-wait-time"]
        self.status = obj["status"]
        self.start_time = obj["start-time"]
        self.end_time = obj["end-time"]

    def to_dict(self):
        return [{
            "spot-id": self.spot_id,
            "name": self.name,
            "short-name": self.short_name,
            "lat": self.lat,
            "lon": self.lon,
            "play-time": self.play_time,
            "url": self.url,
            "area": self.area,
            "character": self.character,
            "description": self.description,
            "enable": self.enable,
            "standby-pass-status": self.standby_pass_status,
            "wait-time": self.wait_time,
            "mean-wait-time": self.mean_wait_time,
            "timespan-mean-wait-time": self.timespan_mean_wait_time,
            "status": self.status,
            "start-time": self.start_time,
            "end-time": self.end_time,
            "type": "greeting"
        }]


class ShopSpotInfo:
    """
    spot/list で返却するショップ情報のクラス。
    """

    def __init__(self):
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.url = ""
        self.area = ""
        self.description = ""

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.url = obj["url"]
        self.area = obj["area"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        # shopは動的情報は存在しない
        pass

    def to_dict(self):
        return [{
            "spot-id": self.spot_id,
            "name": self.name,
            "short-name": self.short_name,
            "lat": self.lat,
            "lon": self.lon,
            "url": self.url,
            "area": self.area,
            "description": self.description,
            "type": "shop"
        }]


class PlaceSpotInfo:
    """
    spot/list で返却するプレイス情報のクラス。
    """
    def __init__(self):
        self.spot_id = -1
        self.name = ""
        self.short_name = ""
        self.lat = ""
        self.lon = ""
        self.url = ""
        self.area = ""
        self.description = ""

    def set_static_data(self, obj):
        self.spot_id = obj["spot-id"]
        self.name = obj["name"]
        self.short_name = obj["short-name"]
        self.lat = obj["lat"]
        self.lon = obj["lon"]
        self.url = obj["url"] if obj.get("url") else ""
        self.area = obj["area"]
        self.description = obj["description"]

    def set_dynamic_data(self, obj):
        # placeは動的情報は存在しない
        pass

    def to_dict(self):
        return [{
            "spot-id": self.spot_id,
            "name": self.name,
            "short-name": self.short_name,
            "lat": self.lat,
            "lon": self.lon,
            "url": self.url,
            "area": self.area,
            "description": self.description,
            "type": "place"
        }]


class OpeningHours:
    """
    パークの開園時間のクラス。
    """
    def __init__(self, opening_hours_dict):
        self.open_time = opening_hours_dict["open-time"]
        self.close_time = opening_hours_dict["close-time"]


class WeatherInfo:
    """
    天気情報のクラス。
    """
    def __init__(self):
        self.date_str = ""
        self.day_str = ""
        self.weather_str = ""
        self.high_temperature = -9999 # 最高気温
        self.low_temperature = -9999  # 最低気温
        self.chance_of_rain = -9999  # 降水確率
        self.wind_speed = -9999       # 風速

    def to_dict(self):
        return {
            "date-str": self.date_str,
            "day-str": self.day_str,
            "weather-str": self.weather_str,
            "high-temp": self.high_temperature,
            "low-temp": self.low_temperature,
            "chance-of-rain": self.chance_of_rain,
            "wind-speed": self.wind_speed
        }


class TicketReservationInfo:
    """
    チケット予約情報のクラス。
    """
    def __init__(self):
        self.date_str = ""
        self.one_day_pass_sea = False
        self.one_day_pass_land = False
        self.last_update_str = ""
        self.weather_info = WeatherInfo()

    def to_dict(self):
        return {
            "date_str" : self.date_str,
            "last_update": self.last_update_str,
            "oneday-pass": {
                "sea": self.one_day_pass_sea,
                "land": self.one_day_pass_land
            },
            "weather" : self.weather_info.to_dict()
        }