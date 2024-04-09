# Authentication
Right now, the Venome website uses first-party authentication.

## Flow Summary
1. User goes to login page and provides username and password
2. Client sends POST API request with JSON containing username and password to backend's */users/login*
3. Backend verifies provided information against database's username and hashed/salted password
4. If verified, backend returns a JSON Web Token (JWT) to the frontend.
5. Frontend client stores JWT into as a cookie.

## Implementation
There are a few functions we use to make it easy to lock endpoints behind authentication.

### Backend
In auth.py, *requires_authentication()* takes in a Request as a parameter, checks if it has an authorization header, and validates the contained JWT against the database to determine if the user 
is an admin. If they aren't an admin, it raises an HTTP Exception; Otherwise, the API call proceeds as normal.

To lock any API call behind authentication, simply import *requires_authentication()* from auth.py and add it to the top of your API call.

### Frontend
PLACEHOLDER

## Drawbacks and To-Dos
