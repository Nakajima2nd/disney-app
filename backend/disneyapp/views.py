from disneyapp.data_manager import CombinedDatamanager
from disneyapp.models import TravelInput
from disneyapp.tsp_solver import RandomTspSolver
import copy, json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from disneyapp.db_handler import DBHandler

@api_view(["GET"])
def sample(request):
    db_handler = DBHandler()
    record = db_handler.get_single_record("raw_html")
    return Response(record)

@api_view(["GET", "POST"])
def spot_list(request):
    spots_json_org = CombinedDatamanager.get_combined_spot_data()
    filtered_spot_list = filter_unuse_spots(spots_json_org)
    spots_json_edited = edit_static_spots_data(filtered_spot_list)
    add_show_dynamic_data = add_show_dynamic_data_stub(spots_json_edited)
    return Response(add_show_dynamic_data)


@api_view(["POST"])
def search(request):
    try:
        try:
            json_data = json.loads(request.body)
        except:
            return Response({"message": "入力が不正です。Jsonのパースに失敗しました。"}, status=status.HTTP_400_BAD_REQUEST)
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
        del [spot_data["nearest-node-id"]]
        if spot_data.get("play-time"):
            spot_data["play-time"] = int(spot_data["play-time"])
        if spots_obj.get(target_type):
            spots_obj[target_type].append(spot_data)
        else:
            spots_obj[target_type] = [spot_data]
    return spots_obj


def add_show_dynamic_data_stub(spots_json):
    """
    ショーの動的情報を付与する。
    最終的にはここはスクレイピングしてきたデータを付与したいが、いったん固定のデータをもたせる。
    """
    show_list = spots_json["show"]
    target_dict = {
        "ミッキー＆フレンズのハーバーグリーティング": ["11:30", "16:50"],
        "ビッグバンドビート～ア・スペシャルトリート～" : ["11:15", "12:40", "14:40", "16:05"]
    }
    new_show_list = []
    for i, show in enumerate(show_list):
        if not target_dict.get(show["name"]):
            show["enable"] = False
            new_show_list.append(copy.deepcopy(show))
            continue
        show["enable"] = True
        show_time_list = target_dict[show["name"]]
        for show_time in show_time_list:
            show_copied = copy.deepcopy(show)
            show_copied["name"] += ("(" + show_time + ")")
            show_copied["short-name"] += ("(" + show_time + ")")
            show_copied["start-time"] = show_time
            new_show_list.append(show_copied)
    spots_json["show"] = new_show_list
    return spots_json
