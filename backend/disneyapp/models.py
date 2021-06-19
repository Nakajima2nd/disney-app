class Subroute:
    def __int__(self):
        self.start_spot_id = -1
        self.goal_spot_id = -1
        self.start_time = ""
        self.goal_time = ""
        self.distance = -1
        self.transit_time = -1
        self.coords = []


class Spot:
    def __init__(self):
        self.spot_id = -1
        self.spot_name = ""
        self.lat = ""
        self.lon = ""
        self.type = ""
        self.enable = True
        self.wait_time = -1


class Tour:
    def __init__(self):
        self.start_time = ""
        self.goal_time = ""
        self.spots = []
        self.subroutes = []
