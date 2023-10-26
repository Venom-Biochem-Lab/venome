# Development

By the time you finish this guide, you will be able to run the JS frontend [Svelte](https://kit.svelte.dev/) and the Python backend [FastAPI](https://fastapi.tiangolo.com/).

> **Note**
> We use bash for everything and **NOT** Powershell

## Installation

### Backend

> **Warning**
> Before you do anything, make sure you have [Python](https://www.python.org/downloads/) installed.

Then install the [Poetry Python Package Manager](https://python-poetry.org/) by doing 

```bash
cd backend
pip3 install poetry
```

Then install the packages listed under [`pyproject.toml`](./backend/pyproject.toml) by doing 

```bash
poetry install
```

**🥳 You're done with the backend installation!**

### Frontend

> **Warning**
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

## Running the Development Servers 

It's very simple! You need two terminals open:

On the first terminal, run the backend

```bash
cd backend
poetry run dev
```

which will run the [ `server.py` ](./backend/src/server.py) HTTP server on localhost port 8000.

Then, in the other terminal, run the frontend development server

```bash
cd frontend
yarn dev --open
```

which should open up your browser to the user interface at [http://localhost:5173/](http://localhost:5173/).

**🥳 You now should be up an running!**

In the future, from the root directory you can use make commands to quickly run things instead of having to `cd` to different places and run different commands. Check out [`Makefile`](./Makefile). 

But don't use it unless you understand what it's running.

## Navigating the codebase

I'll explain top-down how to understand the structure of this repository. First of all, you want to mainly pay attention to the [`frontend`](./frontend/) then the [`backend`](./backend/) code. I'll explain:

### Frontend

> **Important**
> 🎥 [Click here](https://drive.google.com/file/d/1KD3Hgbul0_7cIZiCaQZ1U4meCBthcrfS/view?usp=drive_link) to watch the frontend video overview by @xnought.


The main code for frontend is in [`frontend/src`](./frontend/src). We use the JavaScript framework called [Svelte](https://svelte.dev/) which makes writing frontends super easy and is the standard for websites with visualizations. To be very specific, we use [SvelteKit](https://kit.svelte.dev/) which is a framework built on the Svelte compiler for websites with multiple routes.

The home page you see when you run the frontend server is defined in [`frontend/src/routes/+page.svelte`](./frontend/src/routes/+page.svelte).

To make another route, for example an `/about` to show an about page in the frontend, we just create a directory with another `+page.svelte`.


For example, [`frontend/src/routes/about/+page.svelte`](./frontend/src/routes/about/+page.svelte).

See SvelteKit documentation for more info on how to add more complicated behavior. There are a ton of nice things to loop over data directly in the DOM, insert reactive variables, and maintain reactive global state. Ask @xnought if you want to learn more.

### Backend

> **Important**
> 🎥 [Click here](https://drive.google.com/file/d/1zOV_Gz-_MFURB0nupxCt965w1siUAaMl/view?usp=drive_link) to watch the backend video overview by @xnought.

The frontend calls to the backend. The backend is in Python3 and specifically [FastAPI](https://fastapi.tiangolo.com/). FastAPI is a nice HTTP REST server where we can make HTTP requests to the backend from the frontend.

The main server lives in [`backend/src/server.py`](./backend/src/server.py).

Check out the FastAPI docs for more info.

### Frontend and Backend Interaction

> **Important**
> 🎥 [Click here](https://drive.google.com/file/d/1micYztZj8q5oufOhVctzPvsE9U1NgnyS/view?usp=drive_link) to watch how to interact with the backend from the frontend

Once we created the HTTP endpoints in the backend, we can call 
```bash
cd frontend
yarn openapi
```

which generates frontend bindings/functions we can use in the frontend. See the [`+page.svelte`](./frontend/src/routes/page.svelte) for an example usage with the `Backend` object (generated from the command above). You'll see in the network tab that it just makes a `fetch` call to the backend.

## FAQ

### How to add JavaScript packages to the frontend?

```bash
cd frontend
yarn add npm_package_name
```

for example if I wanted to install [D3](https://www.npmjs.com/package/d3):

```bash
cd frontend
yarn add d3
```

### How to add Python packages to the backend?

```bash
cd backend
poetry add pypi_package_name
```

for example if I wanted to install [PyTorch](https://pypi.org/project/torch/):

```bash
cd backend
poetry add torch
```
