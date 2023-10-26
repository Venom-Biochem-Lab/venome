from __future__ import annotations
from fastapi import FastAPI
from .config import init_fastapi_app, run_http_server
from pydantic import BaseModel
import numpy as np


HOST = "localhost"
PORT = 8000
DEV_MODE = True
app: FastAPI = init_fastapi_app()


# indicates the type that gets returned
class AllResponse(BaseModel):
    name: str


@app.get("/", response_model=AllResponse)
def hello_world():
    return AllResponse(name="Donny")


class RandNormBody(BaseModel):
    length: int
    mean: float = 0
    stdDev: float = 1


@app.post("/gen-norm-dist", response_model=list[float])
def gen_norm_dist(body: RandNormBody):
    dist = np.random.randn(body.length) * body.stdDev + body.mean
    return dist.tolist()


def main():
    if DEV_MODE:
        run_http_server(app, HOST, PORT)
    else:
        raise NotImplementedError("Production mode not implemented yet.")


if __name__ == "__main__":
    main()
