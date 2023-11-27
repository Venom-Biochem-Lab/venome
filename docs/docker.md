# Docker


> **Important**
> You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) GUI installed and the `docker-compose` bash command.

We use docker to run our environments. We compose three images

- venome-backend (on port `8000`)
- venome-frontend (on port `5173`)
- venome-postgres (on port `5432`)

all are defined in the [docker-compose.yml](../docker-compose.yml).

> [!NOTE]
> The postgres db is available outside of the container (your computer) on port `3000` instead. The ports above are internal docker container ports.

## Getting Started

To start the container 

```bash
sh run.sh start
```

now you can navigate to [http://localhost:5173](http://localhost:5173) to see the interface running.

and to stop the container

```bash
sh run.sh stop
```

to rebuild the container from scratch run

```bash
sh run.sh hard_restart
```

more commands can be found in the [`run.md`](run.md) and more specific instructions can be found in the [`DEVELOPMENT.md`](../DEVELOPMENT.md), [`backend.md`](./backend.md), or [`database.md`](./database.md).

## Inspecting the consoles

While the docker venome container is running, go to the Docker Desktop GUI. You should see the same as the following video


https://github.com/xnought/venome/assets/65095341/c44f1d8c-0d58-407c-9aa2-29c4a92fb666


this is where you can see print statements and other debug info / errors.


