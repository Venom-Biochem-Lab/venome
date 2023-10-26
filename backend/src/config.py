from __future__ import annotations
from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict
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


# https://github.com/zeno-ml/zeno-hub/blob/9d2f8b5841d99aeba9ec405b0bc6a5b1272b276f/backend/zeno_backend/classes/base.py#L20
def to_camel(string: str) -> str:
    """Converter for variables from snake_case to camelCase.

    Args:
        string (str): the variable to convert to camelCase.

    Returns:
        str: camelCase representation of the variable.
    """
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


# https://github.com/zeno-ml/zeno-hub/blob/9d2f8b5841d99aeba9ec405b0bc6a5b1272b276f/backend/zeno_backend/classes/base.py#L20
class CamelModel(BaseModel):
    """Converting snake_case pydantic models to camelCase models."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


def init_fastapi_app() -> FastAPI:
    app = FastAPI(
        title="Venome Backend", generate_unique_id_function=custom_generate_unique_id
    )
    disable_cors(app)
    return app


def run_http_server(app: FastAPI, host="localhost", port=8000):
    uvicorn.run(app, host=host, port=port)
