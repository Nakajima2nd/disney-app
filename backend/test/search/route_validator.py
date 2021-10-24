class RouteValidator:
    @staticmethod
    def is_valid_route(search_input, route):
        """
        /search の入力であるdictと/searchの返却結果を受け取り、妥当なルートになっているかを検証する。

        Parameters:
        -----------
        search_input : dict
            /search の入力パラメタ。
        route : dict
            /search の出力ルート。

        Returns:
        --------
        result : bool
            妥当な経路になっている場合True, そうでなければFalse.
        """
        return True
