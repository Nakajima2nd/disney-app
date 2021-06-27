from disneyapp.data_manager import CombinedDatamanager
from disneyapp.models import TravelInput
from disneyapp.tsp_solver import RandomTspSolver
import copy, json
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET", "POST"])
def spot_list(request):
    spots_json_org = CombinedDatamanager.get_combined_spot_data()
    spots_json_edited = edit_static_spots_data(spots_json_org)
    return Response(spots_json_edited)


@api_view(["POST"])
def search(request):
    try:
        json_data = json.loads(request.body)
    except:
        return Response("入力が不正です：Jsonのパースに失敗しました。")
    travel_input = TravelInput(json_data)
    if travel_input.error_message != "":
        return Response("入力が不正です：" + travel_input.error_message)
    tsp_solver = RandomTspSolver()
    tour = tsp_solver.exec(travel_input)
    return Response(tour.to_dict())


def edit_static_spots_data(spots_json_org):
    spots_obj = {}
    spots_json_org_copied = copy.deepcopy(spots_json_org)
    for spot_data in spots_json_org_copied:
        target_type = spot_data["type"]
        del [spot_data["type"]]
        del [spot_data["nearest_node_id"]]
        if spot_data.get("play-time"):
            spot_data["play-time"] = int(spot_data["play-time"])
        if spots_obj.get(target_type):
            spots_obj[target_type].append(spot_data)
        else:
            spots_obj[target_type] = [spot_data]
    return spots_obj
