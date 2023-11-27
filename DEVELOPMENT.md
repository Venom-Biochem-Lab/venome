# Development

By the time you finish this guide, you will be able to run the JS frontend [Svelte](https://kit.svelte.dev/) and the Python backend [FastAPI](https://fastapi.tiangolo.com/). 

Note that we use `docker-compose` as defined in the [`docker-compose.yml`](./docker-compose.yml).

If you want to see more specific docs go to the [ `docs/` ](./docs/README.md) for more info.

## Installation

> [!IMPORTANT]
> You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) GUI installed and the `docker-compose` bash command.

You can run everything by doing

```bash
sh run.sh
```

and navigate to [http://0.0.0.0:5173](http://0.0.0.0:5173) webserver (or [http://localhost:5173](http://localhost:5173))

That's it. This will spin up a docker container with the backend, database, and frontend servers running.

To turn it off do

```bash
sh run.sh stop
```
Check out the [`run.sh`](./run.sh) for more shortcuts like this.

If you want intellisense/autocomplete in VSCode, continue to the rest of the installation. Otherwise you are done. Totally optional, but I'd do it for autocomplete.

### Backend 

> [!IMPORTANT]
> Before you do anything, make sure you have [Python](https://www.python.org/downloads/) installed.

Then install the [Poetry Python Package Manager](https://python-poetry.org/) by doing 

```bash
pip3 install poetry
```

Then install the packages listed under [`pyproject.toml`](./backend/pyproject.toml) by doing 

```bash
poetry config virtualenvs.in-project true # required for the .venv to get created
poetry install
```

**🥳 You're done with the backend installation!**

### Frontend

> [!IMPORTANT]
> Before you do anything, make sure you first have [Node](https://nodejs.org/en/download) installed.

If you haven't already, also install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) globally as the package manager for node by doing 

```bash
npm install --global yarn
```

Nice you have Yarn 🧶 now! Now install the frontend packages by doing

```bash
cd frontend
yarn install
```

**🥳 You're done with the frontend installation!**


## Navigating the codebase

> [!WARNING]
> Ignore the build script in the video, they are outdated
> We use docker now through `sh run.sh`
> Additionally the host has changed from `localhost` to `0.0.0.0`

I'll explain top-down how to understand the structure of this repository. First of all, you want to mainly pay attention to the [`frontend`](./frontend/) then the [`backend`](./backend/) code. I'll explain:

### Frontend

> [!IMPORTANT]
> 🎥 [Click here](https://drive.google.com/file/d/1KD3Hgbul0_7cIZiCaQZ1U4meCBthcrfS/view?usp=drive_link) to watch the frontend video overview by @xnought.


The main code for frontend is in [`frontend/src`](./frontend/src). We use the JavaScript framework called [Svelte](https://svelte.dev/) which makes writing frontends super easy and is the standard for websites with visualizations. To be very specific, we use [SvelteKit](https://kit.svelte.dev/) which is a framework built on the Svelte compiler for websites with multiple routes.

The home page you see when you run the frontend server is defined in [`frontend/src/routes/+page.svelte`](./frontend/src/routes/+page.svelte).

To make another route, for example an `/about` to show an about page in the frontend, we just create a directory with another `+page.svelte`.


For example, [`frontend/src/routes/about/+page.svelte`](./frontend/src/routes/about/+page.svelte).

See SvelteKit documentation for more info on how to add more complicated behavior. There are a ton of nice things to loop over data directly in the DOM, insert reactive variables, and maintain reactive global state. Ask @xnought if you want to learn more.

### Backend

> [!IMPORTANT]
> 🎥 [Click here](https://drive.google.com/file/d/1mmZqsALCY4UhcT592GR0Q1PMtZPogXkq/view?usp=drive_link) to watch the backend video overview by @xnought.

The frontend calls to the backend. The backend is in Python3 and specifically [FastAPI](https://fastapi.tiangolo.com/). FastAPI is a nice HTTP REST server where we can make HTTP requests to the backend from the frontend.

The main server lives in [`backend/src/server.py`](./backend/src/server.py).

Check out the FastAPI docs for more info.

### Frontend and Backend Interaction

> [!IMPORTANT]
> 🎥 [Click here](https://drive.google.com/file/d/1micYztZj8q5oufOhVctzPvsE9U1NgnyS/view?usp=drive_link) to watch how to interact with the backend from the frontend

Once we created the HTTP endpoints in the backend, we can call 
```bash
sh run.sh api
```

which generates frontend bindings/functions we can use in the frontend. See the [`+page.svelte`](./frontend/src/routes/+page.svelte) for an example usage with the `Backend` object (generated from the command above). You'll see in the network tab that it just makes a `fetch` call to the backend.

### Database

We use PostgreSQL in Docker. For more information go to the docs at [`database.md`](./docs/database.md).
