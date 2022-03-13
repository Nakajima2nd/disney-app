import os
import psycopg2
import json
from dotenv import load_dotenv
from psycopg2.extras import DictCursor


class DBHandler:
    def __init__(self):
        load_dotenv()
        self.database_url = ""
        self.__init_database_url()

    def __init_database_url(self):
        self.database_url = os.getenv('DATABASE_URL')
        if not self.database_url:
            self.database_url = str(os.environ['DATABASE_URL'])

    def fetch_sea_dynamic_data(self):
        """
        最新のTDSの動的情報をDBから取得し、Jsonオブジェクトに変換して返す。
        """
        TABLE_NAME = "sea_dynamic_data"
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute("SELECT data FROM " + TABLE_NAME + " ORDER BY datetime DESC limit 1")
                latest_dynamic_record = cur.fetchone()
                return json.loads(latest_dynamic_record["data"])

    def fetch_ticket_reservation_info(self, from_time, upto_time):
        """
        指定した時刻範囲のチケット予約情報をDBから取得する。
        from_time, to_time : YYYY-MM-DD型式の文字列
        """
        TABLE_NAME = "dticket_status"
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(f"SELECT * FROM {TABLE_NAME} "
                            f"WHERE target_date >= '{from_time}' and target_date <= '{upto_time}'"
                            f"ORDER BY target_date")
                result = cur.fetchall()
                return result

    def fetch_restaurant_reservation_info(self):
        """
        レストラン予約情報をDBから取得する。
        """
        table_name = "drestaurant_status"
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(f"SELECT * FROM {table_name} ORDER BY target_date")
                result = cur.fetchall()
                return result

    def fetch_restaurant_name_type_dict(self):
        """
        レストラン名称->typeの辞書を返却する。
        """
        table_name = "drestaurant_list"
        name_type_dict = {}
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(f"SELECT * FROM {table_name}")
                for row in cur:
                    name_type_dict[row["restaurant_name"]] = row["type"]
        return name_type_dict

    def fetch_all_weather_info(self):
        """
        すべての天気情報をDBから取得する。
        """
        TABLE_NAME = "weather"
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(f"SELECT * FROM {TABLE_NAME} ORDER BY target_date")
                result = cur.fetchall()
                return result