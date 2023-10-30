import numpy as np
from .setup import init_fastapi_app, disable_cors
from .api_types import AllResponse, RandNormBody
from .db import Database


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


# some test usage of the database
db = Database()
db.connect()

# insert some values in to test
for i in range(15):
    db.execute(
        """INSERT INTO protein_entries (name) VALUES (%s);""",
        [f"meat-{i}"],
    )


# print out those values
result = db.execute_return("SELECT * FROM protein_entries")
print("result", result)

db.disconnect()
