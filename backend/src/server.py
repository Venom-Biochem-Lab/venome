import os
from .setup import disable_cors, init_fastapi_app, serve_endpoints
from .api import users, search, protein


app = init_fastapi_app()
disable_cors(app, origins=[os.environ["PUBLIC_FRONTEND_URL"]])
serve_endpoints(app, modules=[users, search, protein])


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
