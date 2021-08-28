import json
import time
from disneyapp.data.db_handler import DBHandler


class DynamicDataManager:
    """
    待ち時間や運営中/停止中などの動的情報を管理するクラス。
    """
    prev_fetch_time = 0
    prev_fetch_data = {}

    @classmethod
    def fetch_latest_data(cls):
        current_time = int(time.time())
        # 前回データ取得時から5分以内であれば前回取得データを使いまわす
        if current_time - cls.prev_fetch_time < 300:
            return cls.prev_fetch_data
        cls.prev_fetch_time = current_time
        db_handler = DBHandler()
        cls.prev_fetch_data = db_handler.fetch_latest_dynamic_data(table_name="sea_dynamic_data")
        return cls.prev_fetch_data


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

    @classmethod
    def is_exist_spot_id(cls, target_id):
        """
        存在するスポットIDかどうか判定する。存在する場合はTrueを返す。
        """
        spots = cls.get_spots()
        for spot in spots:
            if target_id == spot["spot-id"]:
                return True
        return False

    @classmethod
    def get_spot_attr(cls, target_id):
        """
        スポットIDを指定して、そのスポットの情報をdict出返す。
        存在しないスポットを指定された場合はNoneを返す。
        """
        spots = cls.get_spots()
        for spot in spots:
            if target_id == spot["spot-id"]:
                return spot
        return None
