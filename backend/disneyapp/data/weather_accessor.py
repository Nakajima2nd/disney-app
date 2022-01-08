from disneyapp.data.models import WeatherInfo
from disneyapp.data.db_handler import DBHandler


class WeatherAccessor:
    @staticmethod
    def fetch_weather_info_list():
        db_handler = DBHandler()
        db_weather_info_list = db_handler.fetch_all_weather_info()
        weather_info_list = []
        for db_weather_info in db_weather_info_list:
            weather_info = WeatherInfo()
            weather_info.date_str = str(db_weather_info[0])
            weather_info.day_str = db_weather_info[1]
            weather_info.weather_str = db_weather_info[2]
            weather_info.high_temperature = db_weather_info[3]
            weather_info.low_temperature = db_weather_info[4]
            weather_info.chance_of_rain = db_weather_info[5]
            weather_info.wind_speed = db_weather_info[6]
            weather_info_list.append(weather_info)
        return [weather_info.to_dict() for weather_info in weather_info_list]

    @staticmethod
    def fetch_weather_info_dict():
        weather_info_list = WeatherAccessor.fetch_weather_info_list()
        weather_info_dict = {}
        for weather_info in weather_info_list:
            date_str = weather_info["date-str"]
            weather_info_dict[date_str] = weather_info
        return weather_info_dict
