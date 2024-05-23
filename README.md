<img src="./docs/assets/logo-v3.svg" alt="venome title" />


![Github Actions CI tests](https://github.com/venom-biochem-lab/venome/actions/workflows/ci.yml/badge.svg)

A website to store, visualize, and analyze venom proteins.

In collaboration with the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) at Oregon State University 🦫.

**Quick Links**

-   [Dev Quick Start](#dev-quick-start) below to quickly run the development server locally
-   [`docs/`](./docs/) for in depth help or details
	- [`run.md`](./docs/run.md) for how to use our [`run.sh`](./run.sh) build script
	- [`overview.md`](./docs/overview.md) for an in depth overview for developers (if you're the next group working on this, start here)
	- [`frontend.md`](./docs/frontend.md) for the **frontend** architecture and help
	- [`backend.md`](./docs/backend.md) for the **backend** architecture and help
	- [`database.md`](./docs/database.md) for the **database** architecture and help
	- [`api.md`](./docs/api.md) for how to create backend endpoints and connect them to the frontend
	- [`auth.md`](./docs/auth.md) for how we did authentication and limitations
	- [`deployment.md`](./docs/deployment.md) for how to deploy to production
	- [`build.md`](./docs/build.md) for more details on building for development and production

## Dev Quick Start

This section tells you how to run the Venome website in four easy steps.

**1. Install Docker**

A quick way to install Docker is by installing [Docker Desktop](https://www.docker.com/products/docker-desktop/). 


**2. Build the Website**

Execute the [`run.sh`](./run.sh) script in your terminal with the command

```bash
./run.sh start
```

**3. Setup the Database**

Load the existing data and database schema with 

```bash
./run.sh reload_from_backup backups/v0.0.2
```

**4. View the website**

🎉🥳 You're done! Go to http://localhost:5173 to see the website live.


**(optional addons)**

You can also add foldseek similarity search and TM Alignment with

```bash
./run.sh add_foldseek
./run.sh add_tmalign
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

