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
	start-start-rebuild
}

# generates the api bridge between frontend and backend
function api() {
	cd frontend
	yarn openapi
}

# clears the postgres persistent storage
function rm_volume() {
 	stop
	docker volume rm venome_postgres_data
}

# creates a sql dump file of the database (backup) into the backend/data folder
function sql_dump() {
	docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome > backend/data/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

function restart_venv() {
	cd backend
	poetry config virtualenvs.in-project true
	poetry env list; poetry env remove --all
	poetry install
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
