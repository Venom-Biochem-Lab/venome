"""Does preliminary setup for the FastAPI app."""

from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute


def disable_cors(app: FastAPI, origins=None) -> FastAPI:
    """Disables CORS for the FastAPI app.

    Args:
        app (FastAPI): The FastAPI app to disable CORS for.
        origins (list, optional): List of allowed origins. Defaults to ["*"].
    Returns:
        FastAPI: The FastAPI app with CORS disabled.
    """
    if origins is None:
        origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


def serve_endpoints(app: FastAPI, modules):
    """Serves the endpoints for the FastAPI app.
    Args:
        app (FastAPI): The FastAPI app to serve endpoints for.
        modules (list): List of modules containing the routers to include.
    """
    include_routers(app, [m.router for m in modules])


def include_routers(app: FastAPI, routers: list[APIRouter]):
    """Includes the routers in the FastAPI app.
    Args:
        app (FastAPI): The FastAPI app to include routers in.
        routers (list[APIRouter]): List of routers to include.
    """
    for r in routers:
        app.include_router(r)


# https://github.com/zeno-ml/zeno/blob/main/zeno/server.py#L52
def custom_generate_unique_id(route: APIRoute) -> str:
    """Custom function to generate unique IDs for FastAPI routes.
    Args:
        route (APIRoute): The route to generate a unique ID for.
    Returns:
        str: The unique ID for the route.
    """
    return route.name


def init_fastapi_app() -> FastAPI:
    """Initializes the FastAPI app with custom settings.
    Returns:
        FastAPI: The initialized FastAPI app.
    """
    app = FastAPI(
        title="Venome Backend",
        generate_unique_id_function=custom_generate_unique_id
    )
    app = disable_cors(app)
    return app
