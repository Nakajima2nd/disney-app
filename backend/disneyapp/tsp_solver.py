from data_manager import StaticDataManager, CombinedDatamanager
from models import Tour, Spot, Subroute


class RandomTspSolver:
    def __init__(self):
        # spot_id -> (play-time, wait-time)
        self.spot_data_dict = RandomTspSolver.__make_spot_data_dict()
        # org_spot_id, dst_spot_id -> distance
        self.cost_table = RandomTspSolver.__make_cost_table()

    def exec(self):
        """
        順列をランダムに生成して最もコストの小さい巡回路を生成する。
        """
        pass

    @staticmethod
    def __make_spot_data_dict():
        combined_spot_data = CombinedDatamanager.get_combined_spot_data()
        spot_data_dict = {}
        for spot_data in combined_spot_data:
            spot_data_dict[spot_data["spot_id"]] = {
                "play-time": int(spot_data["play-time"]),
                "wait-time": int(spot_data["wait-tiime"])
            }
        return spot_data_dict

    @staticmethod
    def __make_cost_table():
        all_spot_pair_list = StaticDataManager.get_cost_table()
        cost_table = {}
        for spot_pair in all_spot_pair_list:
            cost_table[(spot_pair["org_spot_id"], spot_pair["dst_spot_id"])] = spot_pair["distance"]
        return cost_table

    def __eval_tour(self):
        pass
