from src.api.search import (
    SearchProteinsBody,
    SearchProteinsResults,
    RangeFilter,
    search_species,
    search_proteins,
    search_range_length,
    search_range_mass,
    search_range_atoms,
)


def test_search_species():
    response = search_species()
    assert len(response) == 2
    assert response[0] == "test species 1"


def test_search_range_length():
    response: RangeFilter = search_range_length()
    assert response.min == 1
    assert response.max == 3


def test_search_range_mass():
    response: RangeFilter = search_range_mass()
    assert response.min == 1.1
    assert response.max == 3.3


def test_search_range_atoms():
    response: RangeFilter = search_range_atoms()
    assert response.min == 1
    assert response.max == 5


# test query
def test_search_proteins():
    request = SearchProteinsBody(query="")
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 3
    # this part is commented out because the query does not filter, it only sorts
    """request = SearchProteinsBody(query="fake_protein")
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 0"""


# test species filter
def test_search_proteins2():
    request = SearchProteinsBody(
        query="", species_filter="test species 1", atoms_filter=search_range_atoms()
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2


# test different filters
# note: each SearchProteinsBody has multiple filters as it throws an error if there is only one
# this is not an issue in production as all 3 filters will always be in the SearchProteinsBody
def test_search_proteins3():
    filter = RangeFilter(min=1, max=2)
    request = SearchProteinsBody(
        query="", length_filter=filter, atoms_filter=search_range_atoms()
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2
    request = SearchProteinsBody(
        query="", mass_filter=filter, atoms_filter=search_range_atoms()
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(
        query="", mass_filter=search_range_mass(), atoms_filter=filter
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1

    filter = RangeFilter(min=3, max=5)
    request = SearchProteinsBody(
        query="", length_filter=filter, atoms_filter=search_range_atoms()
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(
        query="", mass_filter=filter, atoms_filter=search_range_atoms()
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 1
    request = SearchProteinsBody(
        query="", mass_filter=search_range_mass(), atoms_filter=filter
    )
    response: SearchProteinResults = search_proteins(request)
    assert response.total_found == 2


# test different sort methods
def test_search_proteins4():
    request = SearchProteinsBody(query="", sortBy="lengthAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    request = SearchProteinsBody(query="", sortBy="lengthDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq3"
    request = SearchProteinsBody(query="", sortBy="massAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq3"
    request = SearchProteinsBody(query="", sortBy="massDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    request = SearchProteinsBody(query="", sortBy="atomsAsc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq1"
    request = SearchProteinsBody(query="", sortBy="atomsDesc")
    response: SearchProteinResults = search_proteins(request)
    assert response.protein_entries[0].name == "test_seq2"
