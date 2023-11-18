# Database

This documentation goes over how to deal with the PostgreSQL database. 

## Query from Python Backend

There are some real examples of db use in the [`server.py`](../backend/src/server.py).

First, import the `Database` class from [`db.py`](../backend/src/db.py).

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

> **Note**
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


If you have errors, make sure the docker container is already running (`start` cmd).

## Backups
If you plan to make any glaring changes, make sure to make backups/sql dumps with

```bash
sh run.sh sql_dump
```
and verify the backup succeeded by checking the  [`backend/backups/`](../backend/backups/README.md).

## Reloading from the [`init.sql`](../backend/init.sql)

> **Warning**
> Reloading this file will override the existing data and schema in the running db

The [`init.sql`](../backend/init.sql) only gets loaded on the first run of docker. It stops running this file on subsequent docker runs.

To reload the docker db with this file, simply run

```bash
sh run.sh reload_init_sql
```

## Changes to the Schema/Tables 

**If you DON'T care about losing data**, consider simply editing the [`init.sql`](../backend/init.sql) with the updated schema, and reloading the db with this file as outlined in the [Previous Section](#reloading-from-the-initsql).

> **Important**
> As of now, we don't care about losing user data since we haven't deployed the system.
> The following is a problem for future us.

**If you DO care about losing data** we need to be more careful. Consider making a [Backup](#backups) first. Then doing the previous method. Then you can manually copy over the insert statements from the dump into the init.sql until we figure out a better way to make modifications.

**Shell Method** You can also make alterations to the current table and schema with [modifications](https://www.postgresql.org/docs/current/ddl-alter.html) on the `venome-postgres` psql shell which I showed you how to access in the [PostgreSQL Shell](#postgresql-shell) previous section. You will need to make backups and reinsert these changes into the init.sql so everyone else also gets these alterations.


