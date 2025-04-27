"""Initializes the FastAPI app and serves the endpoints."""

from src.setup import disable_cors, init_fastapi_app, serve_endpoints
from src.api import users, search, protein, articles


app = init_fastapi_app()
disable_cors(
    app,
    origins=[
        "http://localhost:5173",
        "https://venome.cqls.oregonstate.edu",
    ],
)
serve_endpoints(app, modules=[users, search, protein, articles])


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
