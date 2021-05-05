import json


class StaticDataManager:
    __nodes = []
    __links = []
    __spots = []

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