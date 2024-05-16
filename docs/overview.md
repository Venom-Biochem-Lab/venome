# Overview

This document outlines all our design choices and architecture decisions. It also points you in the right direction to get started developing. 

But before you read the overview, if you're new, at the very least, get the website running which is described in the [⚡️ Quick Start](../README.md#️⚡️-quick-start) Section.

In the next few sections, I increase the amount of information I give you in passes. We start with the most high level: the first pass.

## First pass

The code is split into two main sections. The [`frontend`](../frontend/) and the [`backend`](../backend/).

The [`frontend`](../frontend/) is the website itself. It's the user interface that people interact with.

The [`backend`](../backend/) sits behind the [`frontend`](../frontend/). To be accurate, the [`frontend`](../frontend/) makes requests to the [`backend`](../backend/), and the [`backend`](../backend/) sends back responses.


## Second pass

The [`frontend`](../frontend/) is what runs on your browser. So you've guessed it, its JavaScript and HTML.

It's actually better than JavaScript and HTML, it's [Svelte](https://svelte.dev/).

Svelte is a hybrid of the two that makes writing reactive user interfaces with components super easy. Svelte compiles into vanilla JavaScript and HTML, which is what you see in the browser.

The [`backend`](../backend/) is what our frontend makes HTTP requests to. Like `GET` or `POST` requests. Our backend runs Python and [FastAPI](https://fastapi.tiangolo.com/) as the HTTP server. FastAPI is the library that handles all the requests.


## Third pass

The Svelte [`frontend`](../frontend/)'s entry point is [`frontend/src/App.svelte`](../frontend/src/App.svelte). You can think of this as the web app that you see. As you can see there isn't much there, there is just a `<Router />` component.

The `<Router />` or [`frontend/src/Router.svelte`](../frontend/src/Router.svelte) component, defines which URLs a user can route to. Hence router. Lets take a look at that Router file.

One example, the home route `/`, which is the default, corresponds to `<Route path="/"><Home /></Route>`. All this says is when the user has the URL `/`, Svelte will mount/render the `<Home />` component.

The entire Svelte frontend is rendered this way using. 

The Python/FastAPI [`backend`](../backend/)'s main file is [`backend/src/server.py`](../backend/src/server.py). This is the file python runs to run the entire backend. As you can see, this file really only calls one function `serve_endpoints()` which serves the HTTP endpoints defined in the [`backend/src/api/`](../backend/src/api/) folder

The entire HTTP backend runs through these defined endpoints.

## Fourth pass

The Svelte [`frontend`](../frontend/) defines all the routes like I said in the [`frontend/src/Router.svelte`](../frontend/src/Router.svelte) component. For organizational purposes, all the sub components which correspond to a route declaration are kept in the [`frontend/src/routes/`](../frontend/src/routes/) folder. The rest of the frontend code that are not routes live in the  [`frontend/src/lib/`](../frontend/src/lib/) folder.

To give you one example, the [`frontend/src/routes/Protein.svelte`](../frontend/src/routes/Protein.svelte) corresponds to a particular `/protein/` route. But within this Protein Svelte component, I reference other useful shared code, like [`frontend/src/lib/Molstar.svelte`](../frontend/src/lib/Molstar.svelte) which renders proteins in 3D.


The FastAPI [`backend`](../backend/) has all its definitions in the [`backend/src/api/`](../backend/src/api/) folder. Routes are defined through a `router` variable decorator which is a FastAPI `APIRouter()` object declared at the top of any file that serves endpoints.

You can easily then define HTTP endpoints like so

```python
class TestOverviewResponse(CamelModel):
	hello_there: str

@router.get("/test/overview", response_model=TestOverviewResponse)
def test_overview():
	return TestOverviewResponse(hello_there="world")
```

would trigger if a `GET` request to the backend at route `test/overview` was received and would respond with the JSON of `{"helloThere": "world"}`. As you can see `TestOverviewResponse` object is transformed in JSON on the response and the variables are switched from snake_case to camelCase.

Please see examples in the [`backend/src/api/protein.py`](../backend/src/api/protein.py).

## Fifth pass

This entire 5th pass is dedicated to how we request data from the [`backend`](../backend/) from the [`frontend`](../frontend/).

Like I said, we make HTTP requests in the frontend, but you check our entire frontend you won't find a single `fetch()` request.

We use a library called `openapi-typescript-codegen` which reads the Python endpoint definition and generates/compiles each as a frontend function we can simply import. 

For example, take the `POST` endpoint for how we search for proteins in [`search.py`](../backend/src/api/search.py) at `/search/proteins` which is defined like

```python
@router.post("/search/proteins", response_model=SearchProteinsResults)
def search_proteins(body: SearchProteinsBody):
	# code not shown...
```

when I run `./run.sh gen_api`, I use `openapi-typescript-codegen` which reads the python function name, the endpoint, the return type, and the input type and transpiles it into a custom `fetch()` call to the backend that our frontend can super easily use (with type info!).

Then, all I have to do is import the `Backend` object in the frontend and use the function with the same name I defined in python (but with camelCase):

```ts
import { Backend } from "../lib/backend";

const { proteinEntries, totalFound } = await Backend.searchProteins({
	query: "kinase",
});
```

which under the hood make a HTTP `POST` request to the python endpoint. What's great is the `proteinEntries` and `totalFound` have autocomplete types in typescript autogenerated from the backend!

See [`Protein.svelte`](../frontend/src/routes/Protein.svelte) for more concrete examples.

> [!IMPORTANT]
> On every change the a backend endpoint (response_model, name, endpoint) you will need to run `./run.sh gen_api` again to regenerate the frontend fetch wrapper functions