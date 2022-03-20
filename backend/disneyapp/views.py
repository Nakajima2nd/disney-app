from disneyapp.data.spot_list_data_converter import SpotListDataConverter, DynamicDataManager
from disneyapp.algorithm.models import TravelInput
from disneyapp.algorithm.tsp_solver import RandomTspSolver
from disneyapp.data.park_data_accessor import ParkDataAccessor
from disneyapp.data.ticket_reservation_accesor import TicketReservationAccessor
from disneyapp.data.restaurant_reservation_accessor import RestaurantReservationAccessor

import copy, json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


@api_view(["GET"])
def spot_list(request):
    spots_json_org = SpotListDataConverter.get_merged_spot_data_list()
    filtered_spot_list = filter_unuse_spots(spots_json_org)
    spots_json_edited = edit_static_spots_data(filtered_spot_list)
    return Response(spots_json_edited)


@api_view(["POST", "GET"])
def search(request):
    json_data = None
    if request.method == "POST":
        try:
            json_data = json.loads(request.body)
        except:
            return Response({"message": "入力が不正です。Jsonのパースに失敗しました。"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            json_data = TravelInput.request_param_to_dict(request.GET)
        except:
            return Response({"message": "入力が不正です。リクエストパラメタのパースに失敗しました。"}, status=status.HTTP_400_BAD_REQUEST)
    return exec_search(json_data)


@api_view(['GET'])
def business_hours(request):
    opening_hours = ParkDataAccessor.get_opening_hours()
    return Response(
        {
            "open-time": opening_hours.open_time,
            "close-time": opening_hours.close_time
        }
    )


@api_view(['GET'])
def ticket_reservation(request):
    result = TicketReservationAccessor.fetch_ticket_status_list()
    return Response(result)


@api_view(['GET'])
def hotel_restaurant_reservation(request):
    result = RestaurantReservationAccessor.fetch_restaurant_status_list(type_str="hotel")
    return Response(result)


@api_view(['GET'])
def park_restaurant_reservation(request):
    result = RestaurantReservationAccessor.fetch_restaurant_status_list(type_str="park")
    return Response(result)


@api_view(["GET"])
def debug(request):
    return Response("debug")


def exec_search(json_data):
    try:
        travel_input = TravelInput(json_data)
        if travel_input.error_message != "":
            return Response({"message": "入力が不正です。" + travel_input.error_message}, status=status.HTTP_400_BAD_REQUEST)
        tsp_solver = RandomTspSolver()
        tour = tsp_solver.exec(travel_input)
        if not tour:
            return Response({"message": "すべての時刻制約を満たす経路が見つかりませんでした。"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(tour.to_dict())
    except:
        return Response({"message": "バックエンドサーバで予期せぬエラーが発生しました。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def filter_unuse_spots(org_spot_list):
    """
    不要なスポットを削除する。
    """
    filter_spots = [
        # 乗り場と降り場が異なるアトラクションはのぞく
        "ディズニーシー・トランジットスチーマーライン（メディテレーニアンハーバー）",
        "ディズニーシー・エレクトリックレールウェイ（アメリカンウォーターフロント）",
        "ディズニーシー・トランジットスチーマーライン（アメリカンウォーターフロント）",
        "ディズニーシー・エレクトリックレールウェイ（ポートディスカバリー）",
        "ディズニーシー・トランジットスチーマーライン（ロストリバーデルタ）",
        # play-timeが存在しないアトラクションはのぞく
        "フォートレス・エクスプロレーション",
        "アリエルのプレイグラウンド"
    ]
    filtered_spot_list = []
    for org_spot in org_spot_list:
        if org_spot["name"] not in filter_spots:
            filtered_spot_list.append(org_spot)
    return filtered_spot_list


def edit_static_spots_data(spots_json_org):
    """
    フロントエンドの仕様に合わせてtypeをキーにしたdictに編集する。
    """
    spots_obj = {}
    spots_json_org_copied = copy.deepcopy(spots_json_org)
    for spot_data in spots_json_org_copied:
        target_type = spot_data["type"]
        del [spot_data["type"]]
        if spot_data.get("play-time"):
            spot_data["play-time"] = int(spot_data["play-time"])
        if spots_obj.get(target_type):
            spots_obj[target_type].append(spot_data)
        else:
            spots_obj[target_type] = [spot_data]
    return spots_obj
