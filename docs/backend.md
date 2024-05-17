# [backend](../backend/)

The backend consists of a python HTTP server with FastAPI and a postgreSQL database all housed in a docker container.

## How the HTTP Server works

The main file to look at is [backend/src/server.py](../backend/src/server.py) which hosts all our endpoints. Each endpoint can be included via a router found in the [backend/src/api/](../backend/src/api/) folder.

See examples in that folder for how we set up get, post, and other types of HTTP requests.

For a way to visualize what endpoints you have, navigate to http://localhost:8000/docs to see auto generated swagger docs about what each endpoint does and what input they expect.

![Venome Docs Backend](https://github.com/xnought/venome/assets/65095341/05f198fb-5dc6-4220-bf06-58f601057021)


## Adding packages to the python server

```bash
cd backend
poetry add py_package_name
```

which adds the package locally (so your intellisense can detect it).

To have those packages also installed/reflected in the backend run

```bash
sh run.sh install_backend
```

## Docker

> [!IMPORTANT]
> You must have [Docker Desktop](https://www.docker.com/products/docker-desktop/) GUI installed and the `docker-compose` bash command.

We use docker to run our environments. We compose three images

- venome-backend (on port `8000`)
- venome-frontend (on port `5173`)
- venome-postgres (on port `5432`)

all are defined in the [docker-compose.yml](../docker-compose.yml).

more commands can be found in the [`run.md`](run.md) and more specific instructions can be found in the [`DEVELOPMENT.md`](../DEVELOPMENT.md).

### Inspecting the consoles

While the docker venome container is running, go to the Docker Desktop GUI. You should see the same as the following video


https://github.com/xnought/venome/assets/65095341/c44f1d8c-0d58-407c-9aa2-29c4a92fb666


this is where you can see print statements and other debug info / errors.

## Database

See [database.md](database.md)

## Foldseek

For similarity search we use [Foldseek](https://github.com/steineggerlab/foldseek). 

Without foldseek installed nothing will be computed and no errors. No harm at all.

However if you want to add foldseek run

```bash
./run.sh add_foldseek
```

to the docker container and then it will compute.

## TM Align

For protein aligning and model combining (e.g. on the Compare page), we use [TM Align](https://zhanggroup.org/TM-align/).

To add TM Align to your local development setup, run

```bash
./run.sh add_tmalign
```

which will download the executable to the docker.

## Uploading proteins programmatically

We have a script to upload all 437 venom lab proteins to venome. 

You'll simply have to do

```bash
./run.sh upload_all
```

and to delete them do 

```bash
./run.sh delete_all
```

If you get an error about `requests` library error, you'll need to install requests globally for python. Do `pip3 install requests`. 

The script doesn't upload thumbnails for the proteins in the browser. So you'll have to manually upload thumbnails in the browser after running the upload script. To do this, just go to http://localhost:5173/force-upload-thumbnails and wait till that finishes.
