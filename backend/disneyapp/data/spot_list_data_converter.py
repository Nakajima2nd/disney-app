from disneyapp.data.data_manager import StaticDataManager, DynamicDataManager
from disneyapp.data.models import AttractionSpotInfo, RestaurantSpotInfo, GreetingSpotInfo, ShopSpotInfo, ShowSpotInfo, PlaceSpotInfo


class SpotListDataConverter:
    @staticmethod
    def select_spot_info_class(static_spot_data):
        type = static_spot_data["type"]
        if type == "attraction":
            return AttractionSpotInfo()
        elif type == "restaurant":
            return RestaurantSpotInfo()
        elif type == "show":
            return ShowSpotInfo()
        elif type == "greeting":
            return GreetingSpotInfo()
        elif type == "shop":
            return ShopSpotInfo()
        else:
            return PlaceSpotInfo()

    @staticmethod
    def get_merged_spot_data_list():
        """
        静的データと動的データを、スポット名称をキーにマージして返す。

        Returns: array-like
            スポット情報のリスト。
        """
        spot_static_data_list = StaticDataManager.get_spots()
        spot_dynamic_data = DynamicDataManager.fetch_latest_data()
        merged_spot_data_list = []
        for static_spot_data in spot_static_data_list:
            merged_spot_data = SpotListDataConverter.select_spot_info_class(static_spot_data)
            merged_spot_data.set_static_data(static_spot_data)
            spot_name = static_spot_data["name"]
            if spot_dynamic_data.get(spot_name):
                merged_spot_data.set_dynamic_data(spot_dynamic_data[spot_name])
            merged_spot_data_list.extend(merged_spot_data.to_dict())
        return merged_spot_data_list

    @staticmethod
    def get_merged_spot_data_dict():
        """
        静的データと動的データをマージし、spot-idをキーにしたdictにして返す。
        """
        merged_spot_data_list = SpotListDataConverter.get_merged_spot_data_list()
        merged_spot_data_dict = {}
        for merged_spot_data in merged_spot_data_list:
            spot_id = merged_spot_data["spot-id"]
            merged_spot_data_dict[spot_id] = merged_spot_data
        return merged_spot_data_dict
