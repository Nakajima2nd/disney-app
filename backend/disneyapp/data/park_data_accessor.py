from disneyapp.data.data_manager import DynamicDataManager
from disneyapp.data.models import OpeningHours


class ParkDataAccessor:
    """
    開園時間などパーク全体の情報へのアクセサクラス。
    """
    @staticmethod
    def get_opening_hours():
        """
        最新の日時の開園時間、閉園時間を返す。
        """
        latest_data = DynamicDataManager.fetch_latest_data()
        opening_hours_dict = latest_data["開園時間"]
        opening_hours_obj = OpeningHours(opening_hours_dict)
        return opening_hours_obj
