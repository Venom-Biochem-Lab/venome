import os
import psycopg


# inspired from https://github.com/zeno-ml/zeno-hub/blob/main/backend/zeno_backend/database/database.py
class DB:
    def connect(self):
        try:
            self.conn = psycopg.connect(
                host=os.environ["DB_HOST"],
                port=os.environ["DB_PORT"],
                dbname=os.environ["DB_NAME"],
                user=os.environ["DB_USER"],
                password=os.environ["DB_PASSWORD"],
            )
            self.cur = self.conn.cursor()
        except (Exception, psycopg.DatabaseError) as error:
            raise Exception(error) from error
