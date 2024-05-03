<img src="./docs/assets/logo-v3.svg" alt="venome title" />


![Github Actions CI tests](https://github.com/xnought/venome/actions/workflows/ci.yml/badge.svg)

A website to store, visualize, and analyze venom proteins.

In collaboration with the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) at Oregon State University 🦫.

**Quick Links**

-   [⚡️ Quick Start](#️⚡️-quick-start) below to quickly run the development server locally
-   [`docs/`](./docs/) for in depth help or details
	- [`overview.md`](./docs/overview.md) for an in depth overview of the entire application (if you're the next group working on this, start here)
	- [`run.md`](./run.md) for how to use our [`run.sh`](./run.sh) build script
	- [`frontend.md`](./docs/frontend.md) for the **frontend** architecture and help
	- [`backend.md`](./docs/backend.md) for the **backend** architecture and help
	- [`auth.md`](./docs/auth.md) for how we did authentication 
	- [`deployment.md`](./docs/deployment.md) for how to deploy to the internet

## ️⚡️ Quick Start

This section tells you how to run the Venome website in three easy steps.

**1. Install Docker**

A quick way to install Docker is by installing [Docker Desktop](https://www.docker.com/products/docker-desktop/). 


**2. Build the Website**

Execute the [`run.sh`](./run.sh) script in your terminal with the command

```bash
./run.sh quickstart
```

**3. View the Website**

Then navigate to http://localhost:5173 to see the frontend in action.

**(optional)**

Optionally you can upload all the venom lab proteins by running

```bash
./run.sh upload_all
```

### Local Development Environment

If you would like to have autocomplete and other nice development features, keep reading.

We use VSCode for all development and make sure to download a few extensions like

- Ruff code formatter (for backend)
- Prettier code formatter (for frontend)
- Svelte (for frontend)
- Python (for backend)

for a better experience. Then to get autocomplete with those languages, you'll need to manually install the packages that have already been installed in the docker, but locally. Otherwise your VSCode won't know how to autocomplete. 

First install the [Poetry Python Package Manager](https://python-poetry.org/) by doing 

```bash
pip3 install poetry
```

Then install the packages listed under [`pyproject.toml`](./backend/pyproject.toml) by doing 

```bash
poetry config virtualenvs.in-project true # required for the .venv to get created
poetry install
```

Then install frontend packages

```bash
cd frontend
yarn
```

