import numpy as np
from .setup import init_fastapi_app, disable_cors
from .api_types import AllResponse, RandNormBody


app = init_fastapi_app()
disable_cors(app, origins=["http://0.0.0.0:5173"])


@app.get("/", response_model=AllResponse)
def hello_world():
    """Example GET request"""
    return AllResponse(example_msg="Donny")


@app.post("/gen-norm-dist", response_model=list[float])
def gen_norm_dist(body: RandNormBody):
    """Example POST request"""
    dist = np.random.randn(body.length) * body.std_dev + body.mean
    return dist.tolist()


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
