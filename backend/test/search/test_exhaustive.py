from input_generator import InputGenerator
from route_validator import RouteValidator

import requests
import json


def test_exhaustive():
    input_dict_list = InputGenerator.generate_search_input(1)
    for input_dict in input_dict_list:
        url = "http://localhost:8001/search"
        response = requests.post(url, json=input_dict)
        assert response.status_code == 200
        route_dict = json.loads(response.text)
        assert RouteValidator.is_valid_route(input_dict, route_dict)


