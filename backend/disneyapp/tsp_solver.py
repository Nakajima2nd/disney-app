from data_manager import StaticDataManager, CombinedDatamanager
from models import Tour, TourSpot, Subroute, TravelInput
import random, copy


class RandomTspSolver:
    TRY_TIMES = 1000  # 試行回数

    def __init__(self):
        # spot_id -> (play-time, wait-time)
        self.spot_data_dict = RandomTspSolver.__make_spot_data_dict()
        # org_spot_id, dst_spot_id -> distance
        self.cost_table = RandomTspSolver.__make_cost_table()

    def exec(self, travel_input):
        """
        順列をランダムに生成して最もコストの小さい巡回路を生成する。

        Parameter
        ---------
        ravel_input : TravelInput
            巡回探索の入力オブジェクト。

        Returns:
        --------
        tour : Tour
            巡回探索の出力オブジェクト。
        """
        base_tour = [ travel_input_spot.spot_id for travel_input_spot in travel_input.spots ]
        current_best_score = 9999999999999
        current_best_tour = None
        for count in range(RandomTspSolver.TRY_TIMES):
            current_tour = random.sample(base_tour, len(base_tour))
            score = self.__eval_spot_list_order(current_tour)
            if score < current_best_score:
                current_best_score = score
                current_best_tour = copy.deepcopy(current_tour)
        return self.__build_tour(travel_input, current_best_tour)


    @staticmethod
    def __make_spot_data_dict():
        combined_spot_data = CombinedDatamanager.get_combined_spot_data()
        spot_data_dict = {}
        for spot_data in combined_spot_data:
            spot_data_dict[spot_data["spot_id"]] = {
                "play-time": int(spot_data["play-time"]) if spot_data.get("play-time") else 0,
                "wait-time": int(spot_data["wait-time"]) if spot_data.get("wait-time") else 0
            }
        return spot_data_dict

    @staticmethod
    def __make_cost_table():
        all_spot_pair_list = StaticDataManager.get_all_spot_pair()
        cost_table = {}
        for spot_pair in all_spot_pair_list:
            cost_table[(spot_pair["org_spot_id"], spot_pair["dst_spot_id"])] = spot_pair["distance"]
        return cost_table

    def __eval_spot_list_order(self, spot_list):
        """
        巡回順の評価値を返す。現状、経路長だけで評価している。
        """
        # todo: 到着時刻範囲などのペナルティコストも盛る
        distance = 0
        for i, current_spot in enumerate(spot_list):
            if i == 0:
                continue
            prev_spot = spot_list[i-1]
            distance += self.cost_table[(prev_spot, current_spot)]
        return distance

    def __build_tour(self, travel_input, spot_order):
        """
        巡回探索の入出力を受け取り、返却情報を構築する。

        Parameter:
        ----------
        travel_input : TravelInput
            巡回経路探索の入力情報。
        spot_order : array-like(int)
            スポットIDのリスト。最適巡回順にソート済。
        """
        if travel_input.time_mode == "start":
            return self.__trace_from_front(travel_input, spot_order)
        else:
            return self.__trace_from_back(travel_input, spot_order)

    def __trace_from_front(self, travel_input, spot_order):
        """
        巡回経路を出発側からTraceし、スポットの到着時刻などを算出する。
        """
        # todo: 実装する
        return Tour(travel_input, spot_order)

    def __trace_from_back(self, travel_input, spot_order):
        """
        巡回経路をゴール側からTraceし、スポットの到着時刻などを算出する。
        """
        # todo: 実装する。とりあえずmode=startと同じ挙動にしておく。
        return self.__trace_from_front(travel_input, spot_order)