# Database

This documentation goes over how to deal with the PostgreSQL database. 

## Query from Python Backend

There are some real examples of db use in the [`server.py`](../backend/src/server.py).

First, import the `Database` class from [`db.py`](../backend/src/db.py).

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

> **Note**
> `with Database() as db`
> opens up the `db` connection, then closes it when the scope is finished


## PostgreSQL Shell

To use the shell to run SQL commands to directly on the database, run

```bash
sh run.sh psql
```


Which will open up the `venome-posgres` docker image and login to `psql` (posgresSQL) for you.

You should get access to the psql shell now, where you can run stuff like

<img width="599" alt="Screenshot 2023-11-11 at 4 17 16 PM" src="https://github.com/xnought/venome/assets/65095341/9a1b4fa6-6dac-4ae8-b5f9-7fcd6b23a75a">


If you have errors, make sure the docker container is already running (`start` cmd).

## Changes to the Schema/Tables 

You can make direct alterations to the table and schema with [modifications](https://www.postgresql.org/docs/current/ddl-alter.html) on the `venome-postgres` terminal.

Although I'd suggest you first backup the current data with a

```bash
sh run.sh sql_dump
```

first which will dump the contents of the db into [`backend/data/backups/`](../backend/data/backups/README.md).
