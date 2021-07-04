from disneyapp.data_manager import StaticDataManager, CombinedDatamanager
from disneyapp.models import Tour, TourSpot, Subroute, TravelInput
import random, copy


def sec_to_hhmm(sec):
    """
    秒からhh:mm形式の文字列に変換する。
    """
    hour = int(sec / 3600)
    minute = int((sec - hour * 3600) / 60)
    minute_str = str(minute)
    if minute <= 9:
        minute_str = "0" + minute_str
    hhmm = str(hour) + ":" + minute_str
    return hhmm


class RandomTspSolver:
    TRY_TIMES = 1000  # 試行回数

    # 歩くスピード [m/s]
    WALK_SPEED_DICT = {
        "slow": 0.85,
        "normal": 1.00,
        "fast": 1.15
    }

    def __init__(self):
        # todo: このへんのdictはsolverではなくdata_managerで持つほうが良い。要リファクタ
        self.spot_data_dict = RandomTspSolver.__make_spot_data_dict()
        self.cost_table = RandomTspSolver.__make_cost_table()  # org_spot_id, dst_spot_id -> distance
        self.link_dict = RandomTspSolver.__make_link_dict()

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
            current_tour_with_od = [travel_input.start_spot_id] + current_tour + [travel_input.goal_spot_id]
            score = self.__eval_spot_list_order(current_tour_with_od)
            if score < current_best_score:
                current_best_score = score
                current_best_tour = copy.deepcopy(current_tour_with_od)
        return self.__build_tour(travel_input, current_best_tour)


    @staticmethod
    def __make_spot_data_dict():
        combined_spot_data = CombinedDatamanager.get_combined_spot_data()
        spot_data_dict = {}
        for spot_data in combined_spot_data:
            spot_data_dict[int(spot_data["spot_id"])] = {
                "play-time": int(spot_data["play-time"]) if spot_data.get("play-time") else 0,
                "wait-time": int(spot_data["wait-time"]) if spot_data.get("wait-time") else 0,
                "name": spot_data["name"],
                "lat": spot_data["lat"],
                "lon": spot_data["lon"],
                "type": spot_data["type"]
            }
        return spot_data_dict

    @staticmethod
    def __make_cost_table():
        all_spot_pair_list = StaticDataManager.get_all_spot_pair()
        cost_table = {}
        for spot_pair in all_spot_pair_list:
            key = (spot_pair["org_spot_id"], spot_pair["dst_spot_id"])
            node_list = spot_pair["nodes"]
            cost_table[key] = {
                "distance": spot_pair["distance"],
                "nodes": node_list
            }
        return cost_table

    @staticmethod
    def __make_link_dict():
        link_list = StaticDataManager.get_links()
        link_dict = {}
        for link in link_list:
            key = (int(link["org_node_id"]), int(link["dst_node_id"]))
            link_dict[key] = link["coords"]
        return link_dict

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
            distance += self.cost_table[(prev_spot, current_spot)]["distance"]
        return distance

    def __build_tour(self, travel_input, spot_order):
        """
        巡回探索の入出力を受け取り、返却情報を構築する。
        """
        tour = self.__trace_from_front(travel_input, spot_order)
        self.__set_subroute_coordinates(tour)
        self.__set_spot(spot_order, tour)
        return tour

    def __set_subroute_coordinates(self, tour):
        """
        Tourオブジェクトの個別経路の形状点列を設定する。
        """
        subroutes = tour.subroutes
        for subroute in subroutes:
            node_list = self.cost_table[(subroute.start_spot_id, subroute.goal_spot_id)]["nodes"]
            for i, dst_node_id in enumerate(node_list):
                if i == 0:
                    continue
                org_node_id = node_list[i - 1]
                coord_list = self.__node_pair_to_coords(org_node_id, dst_node_id)
                subroute.coords.extend(coord_list)

    def __set_spot(self, spot_order, tour):
        """
        Tourオブジェクトのスポット情報を設定する。
        """
        for spot_id in spot_order:
            tour_spot = TourSpot()
            tour_spot.spot_id = spot_id
            tour_spot.spot_name = self.spot_data_dict[spot_id]["name"]
            tour_spot.lat = self.spot_data_dict[spot_id]["lat"]
            tour_spot.lon = self.spot_data_dict[spot_id]["lon"]
            tour_spot.type = self.spot_data_dict[spot_id]["type"]
            tour_spot.wait_time = self.spot_data_dict[spot_id]["wait-time"]
            tour_spot.play_time = self.spot_data_dict[spot_id]["play-time"]
            tour.spots.append(tour_spot)

    def __trace_from_front(self, travel_input, spot_order):
        """
        巡回経路を出発側からTraceし、スポットの到着時刻を算出する。
        """
        tour = Tour()
        tour.start_time = sec_to_hhmm(travel_input.specified_time)
        current_time = travel_input.specified_time
        for i, dst_spot_id in enumerate(spot_order):
            if i == 0:
                continue
            subroute = Subroute()

            # 個別経路のorg, dstのスポットIDを設定
            subroute.start_spot_id = spot_order[i - 1]
            subroute.goal_spot_id = dst_spot_id
            subroute.start_time = sec_to_hhmm(current_time)

            # orgスポットからdstスポットに移動する
            subroute.distance = int(self.cost_table[(subroute.start_spot_id, subroute.goal_spot_id)]["distance"])
            speed = RandomTspSolver.WALK_SPEED_DICT[travel_input.walk_speed]
            subroute.transit_time = int(float(subroute.distance) / speed)
            current_time += subroute.transit_time
            # note: 目的地に到着希望時刻が設定されている & 到着希望時刻より前に到着した場合は、到着希望時刻まで待機する
            desired_arrival_time = -1
            for spot in travel_input.spots:
                if spot.spot_id == dst_spot_id:
                    desired_arrival_time = spot.desired_arrival_time
            if desired_arrival_time != -1:
                current_time = max(current_time, desired_arrival_time)
            subroute.goal_time = sec_to_hhmm(current_time)

            # dstスポットのイベントを消化するまでの時間を計測
            current_time += max(self.spot_data_dict[dst_spot_id]["wait-time"] * 60, 0)  # note:待ち時間が-1の場合は0にする
            current_time += self.spot_data_dict[dst_spot_id]["play-time"]
            # current_time += goal_spot_info.stay_time if goal_spot_info.stay_time != -1 else 0
            tour.subroutes.append(subroute)
            del subroute
        tour.goal_time = sec_to_hhmm(current_time)
        return tour

    def __node_pair_to_coords(self, org_node_id, dst_node_id):
        """
        2つのノードペアから形状点列を返す。

        note: インプットのノードペアから成るリンクが存在しない場合、空リストを返す。
        """
        key = (org_node_id, dst_node_id)
        if self.link_dict.get((org_node_id, dst_node_id)):
            return self.link_dict[(org_node_id, dst_node_id)]
        if self.link_dict.get(dst_node_id, org_node_id):
            return list(reversed(self.link_dict[(dst_node_id, org_node_id)]))
        return []