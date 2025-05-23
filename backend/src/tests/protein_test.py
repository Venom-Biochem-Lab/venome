from src.api.protein import (
    protein_name_found,
    get_protein_entry,
    get_all_protein_entries,
    get_all_pending_protein_entries,
    get_all_denied_protein_entries,
    get_protein_entry_user,
    request_protein_entry,
    get_protein_status,
    edit_request_status,
    upload_protein_entry,
    delete_protein_entry,
)
from src.api_types import (
    ProteinEntry,
    ProteinBody,
    UploadError,
    RequestStatus,
    RequestBodyEdit,
    RequestBody,
)
from starlette.requests import Request
from starlette.types import Scope
from src.auth import generate_auth_token


def create_dummy_request() -> Request:
    token = generate_auth_token("test@test.com", admin=True)
    scope: Scope = {
        "type": "http",
        "headers": [
            (b"authorization", f"Bearer {token}".encode("utf-8")),
        ],
        "method": "GET",
        "path": "/",
    }
    return Request(scope)


# this test should run first as the other tests expect that test_seq7 will not exist
def test_delete_protein_entry():
    req = create_dummy_request()
    delete_protein_entry("test_seq7", req)
    assert get_protein_entry("test_seq7") == None


def test_get_all_entries():
    response: list[ProteinEntry] = get_all_protein_entries()
    assert len(response) == 3


def test_get_all_pending_entries():
    req = create_dummy_request()
    response: list[ProteinEntry] = get_all_pending_protein_entries(req)
    assert len(response) == 2


def test_get_all_denied_entries():
    req = create_dummy_request()
    response: list[ProteinEntry] = get_all_denied_protein_entries(req)
    assert len(response) == 1


def test_protein_name_search():
    assert protein_name_found("test_seq1") == True
    assert protein_name_found("test_seq2") == True
    assert protein_name_found("fake_protein_that_doesnt_exist") == False


def test_get_entry():
    response: ProteinEntry = get_protein_entry("test_seq1")
    assert response.length == 1
    assert response.mass == 3.3
    assert response.atoms == 1
    assert response.species_name == "test species 1"


def test_get_protein_entry_user():
    response: UserResponse = get_protein_entry_user("test_seq1")
    assert response.username == "test_user1"
    assert response.email == "test@test.com"
    response: UserResponse = get_protein_entry_user("test_seq3")
    assert response.username == "test_user2"
    assert response.email == "test2@test.com"


# successfully add protein
def test_upload_protein_entry():
    body = ProteinBody(
        name="test_seq7",
        description="new fake sequence",
        species_name="test species 1",
        content="content",
        refs="refs",
        pdb_file_str="blank",
    )
    req = create_dummy_request()
    response = upload_protein_entry(body, req)
    # returns a write error because the test cannot write to a file
    # fix later
    assert response == UploadError.WRITE_ERROR


# successfully request protein
def test_request_protein_entry():
    proteinBody = ProteinBody(
        name="test_seq8",
        description="new fake sequence",
        species_name="test species 1",
        content="content",
        refs="refs",
        pdb_file_str="blank",
    )
    body = RequestBody(
        user_id=2, comment="comment", status="Pending", protein=proteinBody
    )
    req = create_dummy_request()
    response = request_protein_entry(body, req)
    # returns a write error because the test cannot write to a file
    # fix later
    assert response == UploadError.WRITE_ERROR


# request protein with taken name
def test_request_protein_entry2():
    proteinBody = ProteinBody(
        name="test_seq1",
        description="existing fake sequence",
        species_name="test species 1",
        content="content",
        refs="refs",
        pdb_file_str="blank",
    )
    body = RequestBody(
        user_id=2, comment="comment", status="Pending", protein=proteinBody
    )
    req = create_dummy_request()
    response = request_protein_entry(body, req)
    assert response == UploadError.NAME_NOT_UNIQUE


# request protein with no pdb file str - parse_error
def test_request_protein_entry3():
    proteinBody = ProteinBody(
        name="test_seq9",
        description="existing fake sequence",
        species_name="test species 1",
        content="content",
        refs="refs",
        pdb_file_str="",
    )
    body = RequestBody(
        user_id=2, comment="comment", status="Pending", protein=proteinBody
    )
    req = create_dummy_request()
    response = request_protein_entry(body, req)
    assert response == UploadError.PARSE_ERROR


def test_get_protein_status():
    req = create_dummy_request()
    response: RequestStatus = get_protein_status("test_seq1", req)
    assert response == RequestStatus.APPROVED
    response2: RequestStatus = get_protein_status("test_seq4", req)
    assert response2 == RequestStatus.PENDING
    response3: RequestStatus = get_protein_status("test_seq6", req)
    assert response3 == RequestStatus.DENIED


def test_edit_request_status():
    req = create_dummy_request()
    body = RequestBodyEdit(request_id=4, status=RequestStatus.DENIED)
    response = edit_request_status(body, req)
    assert response is None
    status_response: RequestStatus = get_protein_status("test_seq4", req)
    assert status_response == RequestStatus.DENIED


# MAKE SURE WE SAVE THE ARTICLE WHEN UPLOADING NEW UPDATE!!!
# add more users and proteins to the sql file so that when the ones get deleted it still works
# or just change to ci.yml to run the tests one by oneit
