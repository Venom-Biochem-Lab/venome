#!/bin/bash

# CALL STRUCTURE: sh run.sh <command>
# EXAMPLE: sh run.sh start

function all() {
	start
}

function start() {
	docker-compose up -d
}

function stop() { 
	docker-compose down
}

# start, but with new cache
function start_rebuild() {
	docker-compose up --build -d	
}

function restart() {
	stop
	start
}

function hard_restart() {
	stop
	start_rebuild
}

# generates the api bridge between frontend and backend
function api() {
	cd frontend
	yarn openapi && restart
	cd ..
}

# clears the postgres persistent storage
function rm_volume() {
 	stop
	docker volume rm venome_postgres_data
}

# creates a sql dump file of the database (backup) into the backend/data folder
function sql_dump() {
	docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome > backend/data/backups/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

# runs db from scratch from the init.sql file
function reload_init_sql_no_backup() {
	# stop the servers and remove the existing db data
	echo Removing existing db data...
	stop
	rm_volume

	# start the servers again
	echo Starting dbs from scratch...
	start	
}

# runs db from scratch from the init.sql file, but first backs up the existing db
function reload_init_sql() {
	sql_dump # backup the existing db to backend/data/backups
	reload_init_sql_no_backup
}

function restart_venv() {
	cd backend
	poetry config virtualenvs.in-project true
	poetry env list; poetry env remove --all
	poetry install
	cd ..
}

# opens up the postgresql shell which directly accesses the db in the container
function psql() {
	start # make sure the docker is running
	docker exec -it venome-postgres bash -c 'psql postgresql://myuser:mypassword@0.0.0.0:5432/venome'
}

function test_backend() {
	cd backend
	poetry run pytest
	cd ..
}

function test_frontend() {
	cd frontend
	yarn test
	cd ..
}

function test() {
	test_backend
	test_frontend
}

function install_frontend() {
	docker exec -it venome-frontend yarn install
}

function install_backend() {
	docker exec -it venome-backend poetry install
}

function scrape_func_names() {
	functions=($(grep -oE 'function[[:space:]]+[a-zA-Z_][a-zA-Z_0-9]*' ./run.sh | sed 's/function[[:space:]]*//'))
}

# CALL THE COMMAND FROM THE COMMAND LINE ARGUMENT
# 
# for example `sh run.sh start` will run the start function

# if no command line args, just run the all function
if [ -z "$1" ]; then
	all
	exit 0
fi

# otherwise run the user specified command
scrape_func_names
for func in "${functions[@]}"; do
	# if the func exists in this file, and the first cmd line arg matches the func name, 
	# run the func
	if [ "$1" == "$func" ]; then
		$1
		exit 0
	fi
done

# if we get to this point, the command does not exist
echo "ERROR: command '$1' does not exist"
exit 1
