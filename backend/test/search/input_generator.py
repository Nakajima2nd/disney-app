class InputGenerator:
    @staticmethod
    def generate_search_input(size):
        """
        /search の入力となるdictをランダムに（網羅的に）生成する。

        Parameter:
        ----------
        size : int
            返却するdictの個数。
        """
        return [{
            "specified-time": "10:00",
            "walk-speed": "fast",
            "start-spot-id": 103,
            "goal-spot-id": 103,
            "optimize-spot-order": "true",
            "start-today": "false",
            "spots": [
              {
                "spot-id": 5
              },
              {
                "spot-id": 108,
                "desired-arrival-time": "12:40"
              },
              {
                "spot-id": 21
              },
              {
                "spot-id": 15
              }
            ]
        }]
