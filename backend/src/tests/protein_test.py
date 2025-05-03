from src.api.protein import protein_name_found, get_protein_entry, get_all_protein_entries
from src.api_types import ProteinEntry

def test_get_all_entries():
    response = get_all_protein_entries()
    assert len(response) == 3

def test_protein_name_search():
    assert protein_name_found("test_seq1")
    assert protein_name_found("test_seq2"
    assert !protein_name_found("fake_protein_that_doesnt_exist"))

def test_get_entry():
    response: ProteinEntry = get_protein_entry("test_seq1")
    assert response.length == 1
    assert response.mass == 1.1
    assert response.atoms == 1
    assert response.species_name == "test species 1"