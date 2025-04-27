"""Handles database access for the application."""

import os
from typing import LiteralString, Any

from psycopg import (
    sql,
    DatabaseError,
    Connection,
    Cursor,
    Binary,
    connect,
)


class DatabaseException(Exception):
    """Handles any exceptions from the database"""


# Inspired from:
# https://github.com/zeno-ml/zeno-hub/blob/main/backend/zeno_backend/database/database.py
class Database:
    """Database class for interacting with the postgres database in docker
    Check out docs/database.md for docs on this database and more
    """

    conn: Connection[tuple[Any, ...]] | None = None
    cur: Cursor[tuple[Any, ...]] | None = None

    def connect(self):
        """Connects to the database using the environment variables"""
        try:
            self.conn = connect(
                host=os.environ["DB_HOST"],
                port=os.environ["DB_PORT"],
                dbname=os.environ["DB_NAME"],
                user=os.environ["DB_USER"],
                password=os.environ["DB_PASSWORD"],
            )
            # ensures we insert into the database immediately
            self.conn.autocommit = True
            self.cur = self.conn.cursor()
        except (Exception, DatabaseError) as error:
            raise DatabaseException(error) from error

    def disconnect(self):
        """Disconnects from the database"""
        if self.cur is not None:
            self.cur.close()
        if self.conn is not None:
            self.conn.close()
        self.cur = None
        self.conn = None

    def execute(
        self,
        query: LiteralString | sql.Composed | str,
        params: list[Any] | None = None
    ):
        """Executes an SQL query and returns nothing"""
        try:
            if self.cur is not None:
                self.cur.execute(query, params)  # type: ignore
        except (Exception, DatabaseError) as error:
            raise DatabaseException(error) from error

    def execute_return(
        self,
        query: LiteralString | sql.Composed | str,
        params: list[Any] | None = None
    ):
        """Executes an SQL query and returns all of the results"""
        if self.cur is not None:
            self.execute(query, params)  # type: ignore
            return self.cur.fetchall()

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.disconnect()


def str_to_bytea(_str: str):
    """Converts a string to a bytea object for postgres

    Args:
        _str (str): The string to convert.
    Returns:
        bytea: The bytea object.
    """
    return Binary(_str.encode("utf-8"))


def bytea_to_str(_bytea):
    """Converts a bytea object to a string for postgres

    Args:
        _bytea (bytea): The bytea object to convert.
    Returns:
        str: The string."""
    return _bytea.decode("utf-8")
