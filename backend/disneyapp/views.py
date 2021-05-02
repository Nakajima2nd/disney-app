from django.http import HttpResponse
import json


def spot_list(request):
    spots_json = spot_list_stub()
    return HttpResponse(json.dumps(spots_json, indent=2))


def search(request):
    return HttpResponse("this is search")


def spot_list_stub():
    spots = {
        "attractions": [
            {
                "spot_id": 0,
                "name": "ソアリン：ファンタスティック・フライト",
                "lat": "35.62753096260775",
                "lon": "139.88570175371126",
                "play-time": 10,
                "wait-time": 60,
                "enable": True
            },
            {
                "spot_id": 1,
                "name": "ディズニーシー・トランジットスチーマーライン（メディテレーニアンハーバー）",
                "lat": "35.626573169189264",
                "lon": "139.88593456101927",
                "play-time": 20,
                "wait-time": -1,
                "enable": False
            }
        ],
        "restaurants": [
            {
                "spot_id": 29,
                "name": "カフェ・ポルトフィーノ",
                "lat": "35.62695264833476",
                "lon": "139.88714679981504",
                "enable": True
            },
            {
                "spot_id": 31,
                "name": "ザンビーニ･ブラザーズ･リストランテ",
                "lat": "35.627169846655995",
                "lon": "139.8860085445333",
                "enable": False
            }
        ],
        "shops": [
            {
                "spot_id": 67,
                "name": "イル・ポスティーノ・ステーショナリー",
                "lat": "35.627053829792416",
                "lon": "139.8864666793604",
                "enable": True,
            },
            {
                "spot_id": 68,
                "name": "ヴァレンティーナズ・スウィート",
                "lat": "35.62689230914014",
                "lon": "139.88835381094933",
                "enable": False
            }
        ]
    }
    return spots
