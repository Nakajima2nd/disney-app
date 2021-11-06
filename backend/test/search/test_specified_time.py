import requests
import json


def __get_base_request():
    return {
        "specified-time": "12:00",
        "walk-speed": "fast",
        "start-spot-id": 103,
        "goal-spot-id": 103,
        "optimize-spot-order": "true",
        "start-today": "false",
        "spots": [
            {
                "spot-id": 115
            },
            {
                "spot-id": 91
            },
            {
                "spot-id": 22
            },
            {
                "spot-id": 116
            },
            {
                "spot-id": 108
            }
        ]
    }


def get_route(request_json):
    url = "http://localhost:8001/search"
    response = requests.post(url, json=request_json)
    assert response.status_code == 200
    return json.loads(response.text)


def test_desired_arrival_time():
    """
    到着希望時刻を満たすかどうかのテストを実行する。
    """
    request = __get_base_request()

    # 時刻指定を1つした場合にそれを守るルートが出る
    first_target_time = "15:00"
    first_target_index = 4
    request["spots"][first_target_index]["desired-arrival-time"] = first_target_time
    response = get_route(request)
    for spot in response["spots"]:
        if spot["original-spot-order"] == first_target_index:
            assert spot["arrival-time"] == first_target_time

    # 時刻指定を2つした場合にそれを守るルートが出る
    second_target_time = "16:00"
    second_target_index = 3
    request["spots"][second_target_index]["desired-arrival-time"] = second_target_time
    response = get_route(request)
    for spot in response["spots"]:
        if spot["original-spot-order"] == first_target_index:
            assert spot["arrival-time"] == first_target_time
        if spot["original-spot-order"] == second_target_index:
            assert spot["arrival-time"] == second_target_time


def test_specified_wait_time():
    """
    指定待ち時間を満たすかどうかのテストを実行する。
    """
    request = __get_base_request()
    target_index = 4
    target_wait_time = 60
    request["spots"][target_index]["specified-wait-time"] = target_wait_time
    response = get_route(request)
    for spot in response["spots"]:
        if spot["original-spot-order"] == target_index:
            assert spot["specified-wait-time-result"] == target_wait_time


def test_stay_time():
    """
    スポットの滞在時間を満たすかどうかのテストを実行する。
    """
    request = __get_base_request()
    target_index = 1
    target_stay_time = 50
    request["spots"][target_index]["stay-time"] = target_stay_time
    response = get_route(request)
    for spot in response["spots"]:
        if spot["original-spot-order"] == target_index:
            assert spot["stay-time"] == target_stay_time
