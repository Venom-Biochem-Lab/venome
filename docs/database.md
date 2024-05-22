# Database

## Backing up data

You can easily backup data with 

```bash
./run.sh backup backups/your_backup_name_here
```

then load from an existing snapshot with

```bash
./run.sh reload_from_backup backups/your_backup_name_here
```
or from production container mode

```diff
./run.sh reload_from_backup -p backups/your_backup_name_here
```

See [`run.md`](./run.md) for more info.

## Using with Python API Server

### Access

To access the database, first import the Database class from db.py:

```py
from ..db import Database
```

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

## PostgreSQL Shell

To use the shell to run SQL commands to directly on the database, run

```bash
sh run.sh psql
```
which will open up the `venome-posgres` docker image and login to `psql` (posgresSQL) for you.

You should get access to the psql shell now, where you can run stuff like

<img width="599" alt="Screenshot 2023-11-11 at 4 17 16 PM" src="https://github.com/xnought/venome/assets/65095341/9a1b4fa6-6dac-4ae8-b5f9-7fcd6b23a75a">


If you have errors, make sure the docker container is already running (`./run.sh start` cmd).

## Backups
If you plan to make any glaring changes, make sure to make backups/sql dumps with

```bash
sh run.sh sql_dump
```
and verify the backup succeeded by checking the  [`backend/backups/`](../backend/backups/README.md).

## Reloading from [`init.sql`](../backend/init.sql)

> [!WARNING]
> Reloading this file will override the existing data and schema in the running db

The [`init.sql`](../backend/init.sql) only gets loaded on the first run of docker. It stops running this file on subsequent docker runs.

To reload the docker db with this file, simply run

```bash
sh run.sh reload_init_sql
```
