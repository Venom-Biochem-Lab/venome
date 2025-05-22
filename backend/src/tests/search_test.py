from src.api.search import (
    search_species, 
    SearchProteinsBody, 
    SearchProteinsResults,
    search_proteins,
    RangeFilter,
    search_range_length
)

    query: str
    species_filter: str | None = None
    length_filter: RangeFilter | None = None
    mass_filter: RangeFilter | None = None
    atoms_filter: RangeFilter | None = None
    proteinsPerPage: int | None = None
    page: int | None = None
    sortBy: str | None = None

class SearchProteinsResults(CamelModel):
    total_found: int
    protein_entries: list[ProteinEntry]


def test_search_species():
    response = search_species()
    assert len(response) == 2
    assert response[0] == "test species 1"

#test query
def test_search_proteins():
    request = SearchProteinsBody(query="")
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 3
    request = SearchProteinsBody(query="fake_protein")
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 0

#test species filter
def test_search_proteins2():
    request = SearchProteinsBody(query="", species_filter="test species 1")
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2
    
#test different filters
def test_search_proteins3():
    filter = RangeFilter(min=1, max=2)
    request = SearchProteinsBody(query="", length_filter=filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2
    request = SearchProteinsBody(query="", mass_filter=filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(query="", atoms_filter=filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    
    filter = RangeFilter(min=3, max=5)
    request = SearchProteinsBody(query="", length_filter=filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(query="", mass_filter=filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(query="", atoms_filter)
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2

#test different sort methods
def test_search_proteins4():
    request = SearchProteinsBody(query="", sortBy="lengthAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq3"
    request = SearchProteinsBody(query="", sortBy="lengthDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    request = SearchProteinsBody(query="", sortBy="massAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    request = SearchProteinsBody(query="", sortBy="massDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq3"
    request = SearchProteinsBody(query="", sortBy="atomsAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq2"
    request = SearchProteinsBody(query="", sortBy="atomsDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    
def test_search_range_length():
    response: RangeFilter = search_range_length()