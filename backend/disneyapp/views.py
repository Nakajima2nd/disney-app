from django.http import HttpResponse
from data_manager import get_combined_spot_data
import json
import copy


def spot_list(request):
    spots_json_org = get_combined_spot_data()
    spots_json_edited = edit_static_spots_data(spots_json_org)
    return HttpResponse(json.dumps(spots_json_edited, indent=2))


def search(request):
    route_json = search_stab()
    return HttpResponse(json.dumps(route_json, indent=2))


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


def search_stab():
    route = {
        "start-time": "2021/5/1 10:00",
        "goal-time": "2021/5/1 17:30",
        "spots": [
            {
                "spot-id": 0,
                "spot-name": "フォートレス・エクスプロレーション",
                "lat": "35.62577595814663",
                "lon": "139.88521622867762",
                "type": "attraction",
                "enable": True,
                "wait-time": 30
            },
            {
                "spot-id": 1,
                "spot-name": "ヴェネツィアン・ゴンドラ",
                "lat": "35.62609086477499",
                "lon": "139.88796327515433",
                "type": "attraction",
                "enable": True,
                "wait-time": 40
            },
            {
                "spot-id": 38,
                "spot-name": "レストラン櫻",
                "lat": "35.62463665215171",
                "lon": "139.88699008414704",
                "type": "restaurant",
                "enable": True,
            },
            {
                "spot-id": 8,
                "spot-name": "マクダックス・デパートメントストア",
                "lat": "35.62508364370584",
                "lon": "139.88749816160015",
                "type": "shop",
                "enable": True
            }
        ],
        "subroutes": [
            {
                "start-spot-id": 0,
                "goal-spot-id": 1,
                "start-time": "2021/5/1 10:00",
                "goal-time": "2021/5/1 11:15",
                "distance": "100.2345678",
                "coords": [
                    [
                        "35.62691592246572",
                        "139.8893195938143"
                    ],
                    [
                        "35.62682693893482",
                        "139.8892139172065"
                    ],
                    [
                        "35.62680023990296",
                        "139.8890678648193"
                    ],
                    [
                        "35.62680555982497",
                        "139.8889512535838"
                    ],
                    [
                        "35.62683948418818",
                        "139.8888604654557"
                    ],
                    [
                        "35.62691223585058",
                        "139.8887832774211"
                    ]
                ]
            },
            {
                "start-spot-id": 1,
                "goal-spot-id": 38,
                "start-time": "2021/5/1 11:15",
                "goal-time": "2021/5/1 12:15",
                "distance": "700.87655678",
                "coords": [
                    [
                        "35.62663822630397",
                        "139.8875304755343"
                    ],
                    [
                        "35.62675210237133",
                        "139.8874589517663"
                    ],
                    [
                        "35.62680398707095",
                        "139.8872673089459"
                    ],
                    [
                        "35.62683515444623",
                        "139.8870525293728"
                    ],
                    [
                        "35.62687259193016",
                        "139.8868528323958"
                    ],
                    [
                        "35.62691632018011",
                        "139.8867372623208"
                    ],
                    [
                        "35.62693299247822",
                        "139.8866244729394"
                    ],
                    [
                        "35.62691006777197",
                        "139.8864533921633"
                    ]
                ]
            },
            {
                "start-spot-id": 38,
                "goal-spot-id": 8,
                "start-time": "2021/5/1 12:15",
                "goal-time": "2021/5/1 17:30",
                "distance": "1234.87655678",
                "coords": [
                    [
                        "35.62669650338328",
                        "139.8858361887772"
                    ],
                    [
                        "35.62673072850833",
                        "139.8857988117562"
                    ],
                    [
                        "35.62676298772651",
                        "139.8857984913631"
                    ],
                    [
                        "35.62683237358057",
                        "139.8858619945839"
                    ],
                    [
                        "35.62688382577697",
                        "139.8858939774632"
                    ],
                    [
                        "35.62695013018526",
                        "139.885845232058"
                    ],
                    [
                        "35.62709830858423",
                        "139.883738168824"
                    ],
                    [
                        "35.62723590644772",
                        "139.8838006271458"
                    ],
                    [
                        "35.62734259161811",
                        "139.8837890379084"
                    ],
                    [
                        "35.62744757345769",
                        "139.8837254097118"
                    ],
                    [
                        "35.6275104306632",
                        "139.8835969832307"
                    ],
                    [
                        "35.62763189625908",
                        "139.8835076055786"
                    ],
                    [
                        "35.62770833676418",
                        "139.8833962462816"
                    ],
                    [
                        "35.62778775323962",
                        "139.8832378855187"
                    ],
                    [
                        "35.62781089095348",
                        "139.8831076048557"
                    ],
                    [
                        "35.62782376062439",
                        "139.8829618752143"
                    ]
                ]
            }
        ]
    }
    return route