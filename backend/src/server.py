from __future__ import annotations
from fastapi import FastAPI
from config import init_fastapi_app, run_http_server, CamelModel


app: FastAPI = init_fastapi_app()


# indicates the type that gets returned
class AllResponse(CamelModel):
    message: str


@app.get("/", response_model=AllResponse)
def hello_world():
    return AllResponse(message="Hello World")


"""
    EXAMPLE POST REQUEST USAGE
"""


class RandNormBody(CamelModel):
    num_values: int
    mean: float = 0.0
    std_var: float = 1.0


class RandNormResponse(CamelModel):
    data: list[float]


@app.post("/random-normal", response_model=RandNormResponse)
def random_normal(body: RandNormBody):
    import numpy as np

    normal_distribution = np.random.randn(body.num_values) * body.std_var + body.mean
    return RandNormResponse(data=normal_distribution.tolist())


if __name__ == "__main__":
    run_http_server(app, host="localhost", port=8000)
