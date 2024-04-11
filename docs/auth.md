# Authentication
Venome uses a first-party authentication scheme.

## Login Flow
1. User goes to login page and provides username and password and presses "Log In". Client sends POST request to backend's */users/login* API endpoint. The request contains JSON with the username and password (*submitForm()* in [`Login.svelte`](../frontend/src/routes/Login.svelte)).
2. Backend verifies provided information against database's username and hashed/salted password If verified, returns a JSON Web Token (JWT) to the frontend, and if not verified, sends an error (*login()* in [`users.py`](../backend/src/api/users.py))
3. Frontend, if the user is verified:
    * Stores the JWT into the browser as a cookie (*Cookies.set()* in [`Login.svelte`](../frontend/src/routes/Login.svelte)).
    * Sets *user* svelte store **loggedIn** attributes to true (*$user.loggedIn = true* in [`Login.svelte`](../frontend/src/routes/Login.svelte))
    * The JWT cookie and user store are used to access restricted functionality in the website and API.. See [`Impelentation Tips`](#implementation-tips).
4. When the user reloads the website, the Frontend checks to see if they're logged in by looking at the browser cookie and sets the *user* store accordingly (*onMount()* in [`Header.svelte`](../frontend/src/routes/Login.svelte)).
5. When the user presses "log out", it sends them back to the login page. This clears the auth cookie from the browser and unsets the *user* store attributes. (*onMount()* in [`Login.svelte`](../frontend/src/routes/Login.svelte))

## Implementation Tips
There are a few functions we created to make it easy to lock elements and endpoints behind authentication.

### Backend: Locking an API call behind authentication
1. Import *requires_authentication()* from auth.py
2. Call *requires_authentication()* at the top of the API call you want to restrict.

In /backend/src/auth.py, *requires_authentication()* takes in a Request object as a parameter, checks if it has an authorization header, and validates the contained JWT against the database to determine if the user  is an admin. If they aren't an admin, it raises an HTTP Exception; Otherwise, the API call proceeds as normal.

For an example, see the tutorial upload API endpoint in [`tutorials.py`](../backend/src/api/tutorials.py).

### Frontend: Accessing a locked API call
1. import *setToken()* /lib/backend.ts
2. Call *setToken()* before making the restricted API call.

In /frontend/src/lib/backend.ts, *setToken()* reads the authentication JWT stored in the user's browser cookie, and sets the TOKEN header for outgoing HTTP requests to that token.

For an example, look at [`Edit.svelte`](../frontend/src/routes/Edit.svelte) and search for setToken.

### Frontend: Hiding pages or elements if the user isn't logged in
1. Check if *$user.loggedIn* is true or false.
2. Hide the element or redirect as needed.

To track whether a user is logged in for the purposes of hiding elements, we use a Svelte store called "user" (defined in [`user.ts`](../frontend/stores/user.ts)). This store has an attribute called **loggedIn.** The **loggedIn** attribute is set to *true* either when the user has just logged in, or if they open the website while they have an authentication cookie stored. The attribute is set to *false* when the user logs out and defaults to *false* if the site is reloaded.

Svelte provides an easy shorthand to interface with a svelte store; You can simply type in "$user.*attribute*" to look at the contents of any store attribute. The other user store attributes (*username*, *admin*, etc.) could be used in a similar way in the future, but we are not using them at this time.

You can see some examples of use-cases in [`Header.svelte`](../frontend/src/lib/Header.svelte) and [`Upload.svelte`](../frontend/src/routes/Upload.svelte).

## Concerns and To-Dos
* Originally, we had a choice between using first-party or third-party authentication. We settled on using first-party authentication because it was quicker and easier to implement, but third-party authentication through something like Google would be a more secure choice. The Oauth 2 protocol (which services like Google use for third-party authentication) uses JWT-based authentication similar to what we did here, so some of the code we've already written could be adapted for use in third-party authentication.
* Our frontend and backend currently communicate over HTTP instead of HTTPS. This is mostly a concern where we send usernames and passwords (e.g. the /users/login API endpoint), but this should probably be changed even if switching to third-party authentication.
* The authentication token has an "exp" which lists a 24 hour expiration date (see generate_auth_token() in auth.py), but we don't use this anywhere. This can either be used in the future, or *probably* safely removed.
* Right now, we're only using the **loggedIn** attribute of the user store. While we do have attributes like **admin** and **username**, they are untested and probably have bugs.
* We implemented this authentication scheme with limited security experience. As such, there may be more flaws than listed here which we did not consider.

## Library References
* [`PyJWT`](https://github.com/jpadilla/pyjwt) for JWT generation and verification in the backend.
* [`js-cookie`](https://github.com/js-cookie/js-cookie) for securely storing JWTs in browser cookies in the frontend.