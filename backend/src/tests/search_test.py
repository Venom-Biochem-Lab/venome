from src.api.search import search_species



def test_search_species():
    response = search_species()
    assert len(response) == 2
    assert response[0] == "test species 1"
