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

First let's look at the frontend, then I'll show you how we interact with the backend.

### Frontend Code
TODO

### Backend Code
TODO

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
