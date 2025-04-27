FROM python:3.13-slim

WORKDIR /app

COPY . /app/

RUN apt-get update && apt-get install --assume-yes libpq-dev gcc

RUN pip install poetry

RUN poetry config virtualenvs.create false

RUN poetry install

RUN uvicorn --help

EXPOSE 8000