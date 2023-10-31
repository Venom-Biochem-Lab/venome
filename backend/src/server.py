from .setup import init_fastapi_app, disable_cors
from .api_types import AllEntries, ProteinEntry


app = init_fastapi_app()
disable_cors(app, origins=["http://0.0.0.0:5173", "http://localhost:5173"])


# important to note the return type (response_mode) so frontend can generate that type through `make api`
@app.get("/all-entries", response_model=AllEntries)
def get_all_entries():
    # dummy fake data
    # TODO: Swap out with a real call to the database with real data
    fake_protein_entries = [
        ProteinEntry(name="Protein A", description="A for Apple"),
        ProteinEntry(name="Protein B", description="B for Banana"),
        ProteinEntry(name="Protein C", description="C for Code"),
    ]

    response = AllEntries(protein_entries=fake_protein_entries)

    """
        These python classes get transformed into json when sent to the frontend
        So response really looks like 
        {
            proteinEntries: [{name: "Protein A", name: "Protein B", name: "Protein C"}]
        } 
    """
    return response


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
