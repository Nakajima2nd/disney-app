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

    def fetch_latest_dynamic_data(self, table_name):
        """
        最新の動的情報をDBから取得し、Jsonオブジェクトに変換して返す。
        """
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute("SELECT data FROM " + table_name + " ORDER BY datetime DESC limit 1")
                latest_dynamic_record = cur.fetchone()
                return json.loads(latest_dynamic_record["data"])

