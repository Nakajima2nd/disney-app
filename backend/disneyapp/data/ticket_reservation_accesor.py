from disneyapp.data.db_handler import DBHandler
from disneyapp.data.models import TicketReservationInfo
import datetime


class TicketReservationAccessor:
    @staticmethod
    def fetch_ticket_status_list():
        """
        現在時刻から1か月分のチケット販売情報およい付随情報を返す。
        """
        ticket_status_list = []
        num_of_target_date = 30 # 何日分の情報を返すか
        db_handler = DBHandler()
        dt_now = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
        dt_upto_time = dt_now + datetime.timedelta(days=num_of_target_date)
        db_result_list = db_handler.fetch_ticket_reservation_info(dt_now.strftime("%Y-%m-%d"),
                                                                  dt_upto_time.strftime("%Y-%m-%d"))
        ticket_status_sea_dict = {}
        ticket_status_land_dict = {}
        last_update_time_dict = {}
        for db_result in db_result_list:
            datetime_str = db_result[0]
            type = db_result[1]
            can_reserve = db_result[2]
            last_update_time_dict[datetime_str] = db_result[3]
            if type == "sea":
                ticket_status_sea_dict[datetime_str] = can_reserve
            else:
                ticket_status_land_dict[datetime_str] = can_reserve
        date_list = list(set(list(ticket_status_land_dict.keys()) + list(ticket_status_sea_dict.keys())))
        date_list.sort()
        for date in date_list:
            ticket_info = TicketReservationInfo()
            ticket_info.date_str = date
            ticket_info.last_update_str = last_update_time_dict[date]
            if date in ticket_status_sea_dict:
                ticket_info.one_day_pass_sea = ticket_status_sea_dict[date]
            if date in ticket_status_land_dict:
                ticket_info.one_day_pass_land = ticket_status_land_dict[date]
            ticket_status_list.append(ticket_info)
        return [ticket_status.to_dict() for ticket_status in ticket_status_list]

