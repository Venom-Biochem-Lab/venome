<img src="./docs/assets/logo-v3.svg" alt="venome title" />


![Github Actions CI tests](https://github.com/xnought/venome/actions/workflows/ci.yml/badge.svg)

A wikipedia for venom proteins: upload, search, organize, visualize, and download protein files all open source.

In collaboration with the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) at Oregon State University 🦫.

> [!IMPORTANT]
> -   [Getting Started](#getting-started) to quickly run the docker container locally
> -   [`docs/`](./docs/) contains deeper code documentation
> -   [`frontend/`](./frontend/) contains the user interface in Svelte/TypeScript
> -   [`backend/`](./backend/) contains the backend HTTP server and Database

## Getting Started

If you want to run the frontend and backend yourself, you can! Keep reading...

By the time you finish this guide, you will be able to run the JS frontend [Svelte](https://kit.svelte.dev/) and the Python backend [FastAPI](https://fastapi.tiangolo.com/). 

Note that we use `docker-compose` as defined in the [`docker-compose.yml`](./docker-compose.yml).

If you want to see more specific docs go to the [ `docs/` ](./docs/README.md) for more info.

> [!IMPORTANT]
> You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) GUI installed and the `docker-compose` bash command.

You can run everything by doing

```bash
sh run.sh
```

or directly executing 

```bash
./run.sh
```

this will download a docker container running the svelte frontend, the python backend, and the postgres database all in development hot-reload mode. Installation may take a few minutes. 

Now navigate to [http://localhost:5173](http://localhost:5173) to see the frontend. 

> [!TIP]
> Check the [`docs/run.md`](./docs/run.md) for documentation on the [`run.sh`](./run.sh) file for more build commands

### Local Development Environment

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

### Where to look

I'd recommend going to the [`frontend/package.json`](./frontend/package.json) and [`frontend/src/App.svelte`](./frontend/src/App.svelte) if you want to get started in the frontend.

I'd recommend going to the [`backend/src/server.py`](./backend/src/server.py) and [`backend/init.sql`](./backend/init.sql) for the backend/db.



> [!TIP]
> If you have more questions, create an issue on this github or look for specific documentation in the [`docs/`](./docs/) directory


## Resources

-   [Design Space (Figma)](https://www.figma.com/file/G1pbQsYy4lCTVCvMEnGydX/Unknown-Venome-Project?type=design&node-id=0%3A1&mode=design&t=re8tfITwMPw75A2I-1)
-   [Whiteboard (Figma Jam)](https://www.figma.com/file/ZKwrwzXrbwqMJUTFPF4yV0/Open-Venome-Project?type=whiteboard&node-id=0%3A1&t=DZbia2Quj2IXPhHm-1)
-   [Protein BioChem](<https://bio.libretexts.org/Bookshelves/Biochemistry/Book%3A_Biochemistry_Free_For_All_(Ahern_Rajagopal_and_Tan)/02%3A_Structure_and_Function/203%3A_Structure__Function-_Proteins_I>)
-   [SvelteKit](https://kit.svelte.dev/)
-   [Svelte](https://svelte.dev/)
-   [FastAPI](https://fastapi.tiangolo.com/)

