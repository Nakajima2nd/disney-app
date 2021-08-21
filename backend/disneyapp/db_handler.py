import os
import psycopg2
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

    def get_single_record(self, table_name):
        with psycopg2.connect(self.database_url, sslmode='require') as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute("SELECT * FROM " + table_name + " ORDER BY updated_time DESC")
                return cur.fetchone()
