from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute


def disable_cors(app: FastAPI, origins=["*"]):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


def include_routers(app: FastAPI, routers: list[APIRouter]):
    for r in routers:
        app.include_router(r)


# https://github.com/zeno-ml/zeno/blob/main/zeno/server.py#L52
def custom_generate_unique_id(route: APIRoute):
    return route.name


def init_fastapi_app() -> FastAPI:
    app = FastAPI(
        title="Venome Backend", generate_unique_id_function=custom_generate_unique_id
    )
    return app
