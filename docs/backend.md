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

## Database

This documentation goes over how to deal with the PostgreSQL database. 

### Usage

Then, you can execute SQL queries by

```py
with Database() as db:
	db.execute("""<SQL HERE>""")	
```

or if you want the values returned from the execute, use

```py
with Database() as db:
	out = db.execute_return("""<SQL HERE>""")	
```

which will return a list of the results too. 

> [!NOTE]
> `with Database() as db`
> opens up the `db` connection, then closes it when the scope is finished

### Handling Query Errors from Python Backend

Wrap `execute` or `execute_return` in try except statements like this: 

```py
with Database() as db:
	try:
		out = db.execute_return("""<SQL HERE>""")	
	except Exception as e:
		# here if you encounter an error in the above query
		pass
```

to catch errors.

### PostgreSQL Shell

To use the shell to run SQL commands to directly on the database, run

```bash
sh run.sh psql
```
which will open up the `venome-posgres` docker image and login to `psql` (posgresSQL) for you.

You should get access to the psql shell now, where you can run stuff like

<img width="599" alt="Screenshot 2023-11-11 at 4 17 16 PM" src="https://github.com/xnought/venome/assets/65095341/9a1b4fa6-6dac-4ae8-b5f9-7fcd6b23a75a">


If you have errors, make sure the docker container is already running (`./run.sh start` cmd).

### Backups
If you plan to make any glaring changes, make sure to make backups/sql dumps with

```bash
sh run.sh sql_dump
```
and verify the backup succeeded by checking the  [`backend/backups/`](../backend/backups/README.md).

### Reloading from the [`init.sql`](../backend/init.sql)

> [!WARNING]
> Reloading this file will override the existing data and schema in the running db

The [`init.sql`](../backend/init.sql) only gets loaded on the first run of docker. It stops running this file on subsequent docker runs.

To reload the docker db with this file, simply run

```bash
sh run.sh reload_init_sql
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

## Foldseek

For similarity search we use [Foldseek](https://github.com/steineggerlab/foldseek). 

Without foldseek installed nothing will be computed and no errors. No harm at all.

However if you want to add foldseek run

```bash
./run.sh add_foldseek
```

to the docker container and then it will compute.

## TM Align

To add TM Align do

```bash
./run.sh add_tmalign
```

which will download the executable to the docker.