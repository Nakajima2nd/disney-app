import json
import time
import urllib.request


class DynamicDataManager:
    """
    待ち時間や運営中/停止中などの動的情報を管理するクラス。
    """
    GAS_URL = "https://script.google.com/macros/s/AKfycbxb7eif10mJTk8yweLmabtNBomRph2H-9E7phD8fv2WQiIgmwjmzHQTF2FXQu5eF737Ng/exec"
    prev_fetch_time = 0
    prev_fetch_data = {}

    @classmethod
    def fetch_latest_data(cls):
        current_time = int(time.time())
        cls.prev_fetch_time = current_time
        url = DynamicDataManager.GAS_URL + "?mode=latest"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as res:
            raw_dict = json.loads(res.read())
            cls.prev_fetch_data = DynamicDataManager.__parse_raw_data(raw_dict)
        return cls.prev_fetch_data

    @staticmethod
    def __parse_raw_data(raw_data_dict):
        ret_dict = { "spots": {} }
        for key in raw_data_dict:
            if key == "timestamp":
                ret_dict[key] = raw_data_dict[key]
            else:
                enable_str, standby_pass_status, wait_time = raw_data_dict[key].split(",")
                enable = True if enable_str == "運営中" else False
                ret_dict["spots"][key] = {
                    "enable": enable,
                    "sp_status": standby_pass_status,
                    "wait-time": int(wait_time)
                }
        return ret_dict


class StaticDataManager:
    """
    ネットワークデータやスポットデータなどの静的情報を管理するクラス。
    """
    __nodes = []
    __links = []
    __spots = []
    __all_spot_pair = []

    @classmethod
    def __load_nodes(cls):
        with open("data/sea/nodes.json", "r", encoding="utf-8") as f:
            json_data = json.load(f)
            cls.__nodes = json_data["nodes"]

    @classmethod
    def __load_links(cls):
        with open("data/sea/links.json", "r", encoding="utf-8") as f:
            json_data = json.load(f)
            cls.__links = json_data["links"]

    @classmethod
    def __load_spots(cls):
        with open("data/sea/spots.json", "r", encoding="utf-8") as f:
            json_data = json.load(f)
            cls.__spots = json_data["spots"]

    @classmethod
    def __load_all_spot_pair(cls):
        with open("data/sea/all_spot_pair_routes.json", "r", encoding="utf-8") as f:
            json_data = json.load(f)
            cls.__all_spot_pair = json_data["all_spot_pair_routes"]

    @classmethod
    def get_nodes(cls):
        if not cls.__nodes:
            cls.__load_nodes()
        return cls.__nodes

    @classmethod
    def get_links(cls):
        if not cls.__links:
            cls.__load_links()
        return cls.__links

    @classmethod
    def get_spots(cls):
        if not cls.__spots:
            cls.__load_spots()
        return cls.__spots

    @classmethod
    def get_all_spot_pair(cls):
        if not cls.__all_spot_pair:
            cls.__load_all_spot_pair()
        return cls.__all_spot_pair


class CombinedDatamanager:
    """
    静的情報と動的情報を組み合わせた情報を管理するクラス。
    """
    @staticmethod
    def get_combined_spot_data():
        """
        note: 動的情報の更新タイミングはDynamicDataManagerが管理するため、このクラスでは情報を保持せず毎回リストを計算する
        """
        static_data = StaticDataManager.get_spots()
        dynamic_data = DynamicDataManager.fetch_latest_data()
        for elem in static_data:
            name = elem["name"]
            if not dynamic_data["spots"].get(name):
                continue
            elem["enable"] = dynamic_data["spots"][name]["enable"]
            elem["wait-time"] = dynamic_data["spots"][name]["wait-time"]
            elem["sp_status"] = dynamic_data["spots"][name]["sp_status"]
        return static_data
