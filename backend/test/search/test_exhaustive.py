from input_generator import InputGenerator
from route_validator import RouteValidator

import requests
import json


def test_exhaustive():
    """
    /searchの網羅的なテストを実施する。
    """
    REQUEST_NUM = 100
    route_validator = RouteValidator()
    url = "http://localhost:8001/search"
    spot_list_dict = json.loads(requests.get("http://localhost:8001/spot/list").text)
    input_generator = InputGenerator(spot_list_dict)
    input_dict_list = input_generator.generate_search_input(REQUEST_NUM)
    for i, input_dict in enumerate(input_dict_list):
        print(str(i) + "/" + str(len(input_dict_list)) + " completed...")
        response = requests.post(url, json=input_dict)
        assert response.status_code == 200
        route_dict = json.loads(response.text)
        result = route_validator.is_valid_route(input_dict, route_dict)
        assert result, route_validator.error_message + " " + json.dumps(input_dict)
