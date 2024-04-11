# Authentication
Right now, the Venome website uses first-party authentication.

## Flow Summary
1. User goes to login page and provides username and password
2. Client sends POST API request with JSON containing username and password to backend's */users/login*
3. Backend verifies provided information against database's username and hashed/salted password
4. If verified, backend returns a JSON Web Token (JWT) to the frontend.
5. Frontend client stores JWT into as a cookie.

## Used Libraries
### Backend
* [`PyJWT`](https://github.com/jpadilla/pyjwt) for TWT generation

### Frontend
* [`js-cookie`](https://github.com/js-cookie/js-cookie) for securely storing JWTs in browser cookies.

## Implementation Tips
There are a few functions we use to make it easy to lock endpoints behind authentication.

### Locking an API call behind authentication in the backend
1. Import *requires_authentication()* from auth.py
2. Call *requires_authentication()* at the top of the API call you want to list.

In /backend/src/auth.py, *requires_authentication()* takes in a Request as a parameter, checks if it has an authorization header, and validates the contained JWT against the database to determine if the user  is an admin. If they aren't an admin, it raises an HTTP Exception; Otherwise, the API call proceeds as normal.

For an example, see the tutorial upload API endpoint in [`tutorials.py`](../backend/src/api/tutorials.py).

### Accessing a locked API call from the frontend
1. import *setToken()* /lib/backend.ts
2. Call *setToken()* before making the restricted API call.

In /frontend/src/lib/backend.ts, *setToken()* reads the authentication JWT stored in the user's browser cookie, and sets the TOKEN header for outgoing HTTP requests to that token.

For an example, look at [`Edit.svelte`](../frontend/src/routes/Edit.svelte) and search for setToken.

### Hiding pages or elements if the user isn't logged in
1. Check if *$user.loggedIn* is true or false.
2. Hide the element or redirect as needed.

To track whether a user is logged in, we use a Svelte store called "user" (defined in /frontend/stores/user.ts). In the user store, the **loggedIn** attribute is set to *true* either when the user has just logged in, or if they open the website while they have an authentication cookie stored. The **loggedIn** attribute is set to *false* when the user logs out and defaults to *false* if the site is reloaded.  Svelte provides an easy shorthand to interface with a svelte store; You can simply type in "$user.*attribute*" to look at any of the store's attributes. There are other attributes in the user store which are not currently used (username and admin) but these can be accessed in the same wa

You can see some examples of use-cases in [`Header.svelte`](../frontend/src/lib/Header.svelte) and [`Upload.svelte`](../frontend/src/routes/Upload.svelte).

## Concerns and To-Dos
We implemented this authentication scheme with limited security experience. As such, there may be more flaws than listed here which we did not consider.

* Originally, we had a choice between using first-party or third-party authentication. We settled on using first-party authentication because it was quicker and easier to implement, but third-party authentication through something like Google would be a more secure choice. The Oauth 2 protocol (which services like Google use for third-party authentication) uses JWT-based authentication similar to what we did here, so some of the code we've already written could be adapted for use in third-party authentication.
* Our frontend and backend currently communicate over HTTP instead of HTTPS. This is mostly a concern where we send usernames and passwords (e.g. the /users/login API endpoint), but this should probably be changed even if switching to third-party authentication.
* The authentication token has an "exp" which lists a 24 hour expiration date (see generate_auth_token() in auth.py), but we don't use this anywhere. This can either be used in the future, or *probably* safely removed.