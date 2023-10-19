from __future__ import annotations
from fastapi import FastAPI
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


def init_fastapi() -> FastAPI:
    app = FastAPI(
        name="Venome Backend", custom_generate_unique_id=custom_generate_unique_id
    )
    return app


def run_http_server(app: FastAPI, host="localhost", port=8000):
    disable_cors(app)
    uvicorn.run(app, host=host, port=port)
