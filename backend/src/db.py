import os
import psycopg
from typing import LiteralString, Any
from psycopg import sql


# inspired from https://github.com/zeno-ml/zeno-hub/blob/main/backend/zeno_backend/database/database.py
class Database:
    """Database class for interacting with the postgres database in docker
    Check out docs/database.md for docs on this database and more
    """

    conn: psycopg.Connection[tuple[Any, ...]] | None = None
    cur: psycopg.Cursor[tuple[Any, ...]] | None = None

    def connect(self):
        try:
            self.conn = psycopg.connect(
                host=os.environ["DB_HOST"],
                port=os.environ["DB_PORT"],
                dbname=os.environ["DB_NAME"],
                user=os.environ["DB_USER"],
                password=os.environ["DB_PASSWORD"],
            )
            # ensures we insert into the database immediately
            self.conn.autocommit = True
            self.cur = self.conn.cursor()
        except (Exception, psycopg.DatabaseError) as error:
            raise Exception(error) from error

    def disconnect(self):
        if self.cur is not None:
            self.cur.close()
        if self.conn is not None:
            self.conn.close()
        self.cur = None
        self.conn = None

    def execute(
        self, query: LiteralString | sql.Composed, params: list[Any] | None = None
    ):
        """Executes an SQL query and returns nothing"""
        try:
            if self.cur is not None:
                self.cur.execute(query, params)
        except (Exception, psycopg.DatabaseError) as error:
            raise Exception(error) from error

    def execute_return(
        self, query: LiteralString | sql.Composed, params: list[Any] | None = None
    ):
        """Executes an SQL query and returns all of the results"""
        if self.cur is not None:
            self.execute(query, params)
            return self.cur.fetchall()

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, type, value, traceback):
        self.disconnect()
