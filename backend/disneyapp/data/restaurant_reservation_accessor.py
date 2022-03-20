from disneyapp.data.db_handler import DBHandler
from disneyapp.data.models import RestaurantReservationInfo
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta


class RestaurantReservationAccessor:
    @staticmethod
    def get_target_date_list():
        """
        2か月分の日付オブジェクトを返す。
        """
        current_date = datetime.now(timezone(timedelta(hours=9)))
        end_date = current_date + relativedelta(months=2) - timedelta(days=2)
        target_date_list = [current_date]
        should_continue = True
        while should_continue:
            next_date = current_date + timedelta(days=1)
            current_date = next_date
            target_date_list.append(next_date)
            if next_date > end_date:
                should_continue = False
        return target_date_list

    @staticmethod
    def fetch_restaurant_status_list(type_str: str):
        """
        現在時刻から2か月分のレストランの空き状況を返す。
        """
        # DBからレストラン予約情報を取得する
        db_handler = DBHandler()
        db_result_list = db_handler.fetch_restaurant_reservation_info()
        db_result_dict = {} # datetime, name -> can_reserve
        for db_result in db_result_list:
            datetime_str = str(db_result[0])
            name = db_result[1]
            can_reserve = db_result[2]
            db_result_dict[(datetime_str, name)] = can_reserve

        # 2か月分のdatetimeについてループをまわして、結果のリストを作成する
        restaurant_status_list = []
        name_type_dict = db_handler.fetch_restaurant_name_type_dict()
        target_date_list = RestaurantReservationAccessor.get_target_date_list()
        for target_date in target_date_list:
            for restaurant_name, type in name_type_dict.items():
                target_date_str = target_date.strftime('%Y-%m-%d')
                status = db_result_dict.get((target_date_str, restaurant_name))
                if not status:
                    status = False
                restaurant_status = RestaurantReservationInfo(date_str=target_date_str,
                                                              type_str=type,
                                                              name=restaurant_name,
                                                              status=status)
                restaurant_status_list.append(restaurant_status)
        hotel_park_status_list = [restaurant_status.to_dict() for restaurant_status in restaurant_status_list]
        return filter(lambda x:x["type-str"] == type_str, hotel_park_status_list)


