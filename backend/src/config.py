from __future__ import annotations
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
import uvicorn


def disable_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# https://github.com/zeno-ml/zeno/blob/main/zeno/server.py#L52
def custom_generate_unique_id(route: APIRoute):
    return route.name


def to_camel(string):
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class CamelModel(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


def init_fastapi_app() -> FastAPI:
    app = FastAPI(
        title="Venome Backend", generate_unique_id_function=custom_generate_unique_id
    )
    return app


def run_http_server(app: FastAPI, host="localhost", port=8000, reload=True):
    disable_cors(app)
    uvicorn.run("src.server:app", host=host, port=port, reload=reload)
