from src.api.users import signup, get_user_id, get_user, login  # , delete_user
from src.api_types import (
    SignupBody,
    SignupResponse,
    UserResponse,
    UserIDResponse,
    LoginBody,
)


# attempt to create an account
def test_account_creation():
    body = SignupBody(username="test_user2", email="test@email.com", password="test")
    response: SignupResponse = signup(body)
    assert response.error == ""
    id: UserIDResponse = get_user_id("test_user2")
    assert id.id != -1


def test_login():
    body = LoginBody(email="test@email.com", password="test")
    response: LoginResponse = login(body)
    assert response.user_id != 0
    assert response.token != ""


def test_get_user():
    response: UserResponse = get_user(1)
    assert response.username == "test_user1"
    assert response.email == "test@test.com"


'''def test_account_deletion():
    #does not work because delete_user needs to include a req in the call
    delete_user(1)
    response: UserResponse = get_user(1)
    assert response.username == ""
    assert response.email == ""'''
