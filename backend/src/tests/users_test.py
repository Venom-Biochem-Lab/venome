from src.api.users import (
    signup,
    get_user_id,
    get_user,
    get_users,
    login,
    delete_user,
    # edit_user,
    get_user_proteins,
)
from src.api_types import (
    SignupBody,
    SignupResponse,
    UserResponse,
    UserIDResponse,
    LoginBody,
    LoginResponse,
    UsersResponse,
    # UserBody,
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


def test_get_users():
    req = create_dummy_request()
    response: UsersResponse = get_users(req)
    assert len(response.users) == 2
    assert response.users[0].username == "test_user1"


# this function checks all proteins, not just the approved ones
def test_get_user_proteins():
    response: list[str] = get_user_proteins(1)
    assert len(response) == 2
    response: list[str] = get_user_proteins(2)
    assert len(response) == 4


# successfully attempt to create an account
def test_account_creation():
    body = SignupBody(username="test_user3", email="test@email.com", password="test")
    response: SignupResponse = signup(body)
    assert response.error == ""
    id: UserIDResponse = get_user_id("test_user3")
    assert id.id != -1


# attempt to create an account with an already taken username
def test_account_creation_2():
    body = SignupBody(username="test_user2", email="test2@test.com", password="test")
    response: SignupResponse = signup(body)
    assert response.error == "Server error."


# attempt to create an account with an already taken email
def test_account_creation_3():
    body = SignupBody(username="test_user4", email="test@test.com", password="test")
    response: SignupResponse = signup(body)
    assert response.error == "Server error."
    id: UserIDResponse = get_user_id("test_user4")
    assert id.id == -1


# successfully attempt to login
def test_login():
    body = LoginBody(email="test@email.com", password="test")
    response: LoginResponse = login(body)
    assert response.user_id != 0
    assert response.token != ""


# fail to login with bad username
def test_login_2():
    body = LoginBody(email="fake@email.com", password="test")
    response: LoginResponse = login(body)
    assert response.user_id == 0
    assert response.token == ""
    assert response.error == "Invalid Email or Password"


# fail to login with bad password
def test_login_3():
    body = LoginBody(email="test@email.com", password="fake")
    response: LoginResponse = login(body)
    assert response.user_id == 0
    assert response.error == "Invalid Password"


def test_get_user():
    response: UserResponse = get_user(1)
    assert response.username == "test_user1"
    assert response.email == "test@test.com"
    response: UserResponse = get_user(999)
    assert response.username == ""
    assert response.email == ""


# I believe this function is currently broken, issue #305 on GitHub
'''#successfully edit user
def test_edit_user():
    req = create_dummy_request()
    body = UserBody(id = 1, username = "edited", email = "edited@test.com", admin = False)
    edit_user(1, body, req)
    response: UserResponse = get_user(1)
    assert response.username == "edited"
    assert response.email == "edited@test.com"
    assert response.admin == False

#fail to edit user by changing username to taken username
def test_edit_user_2():
    req = create_dummy_request()
    body = UserBody(id = 1, username = "test_user2")
    edit_user(1, body, req)
    response: UserResponse = get_user(1)
    assert response.username == "test_user1"'''


def test_account_deletion():
    req = create_dummy_request()
    delete_user(1, req)
    response: UserResponse = get_user(1)
    assert response.username == ""
    assert response.email == ""
