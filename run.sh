#!/bin/bash

# CALL STRUCTURE: sh run.sh <command>
# EXAMPLE: sh run.sh start
# more docs are in the docs/run.md file

function all() {
	start
}

function quickstart() {
	start
	add_foldseek
	add_tmalign
}

function start() {
	docker compose up -d
}

function stop() { 
	docker compose down
}

# generates the api bridge between frontend and backend
function gen_api() {
	cd frontend
	yarn openapi && docker compose restart frontend
	cd ..
}

# clears the postgres persistent storage
function rm_volume() {
 	stop
	docker volume rm venome_postgres_data
}

# runs db from scratch from the init.sql file, but first backs up the existing db
function reload_init_sql() {
	rm_volume
	start	
}

# creates a sql dump file of the database (backup) into the backend/data folder
function sql_dump() {
	docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome > backend/backups/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
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

function install_frontend() {
	docker exec -it venome-frontend yarn install
}

function install_backend() {
	docker exec -it venome-backend poetry install
}

function restart() {
	stop
	start
}

# on the docker container, reinstall all packages listed in local env (package.json, poetry.lock)
function refresh_packages() {
	start
	install_frontend
	install_backend
	restart
}


# only update dependencies and reload init sql
function soft_restart() {
	stop
	refresh_packages
	reload_init_sql
}

# complete from scratch rebuild
function hard_restart() {
	stop
	docker compose up --build -d	
	reload_init_sql
}

function upload_all() {
	cd galaxy && python3 upload_all.py
}

function delete_all() {
	cd galaxy && python3 delete_all.py && soft_restart
}

function add_foldseek() {
	docker exec -it venome-backend wget https://mmseqs.com/foldseek/foldseek-linux-sse2.tar.gz
	docker exec -it venome-backend tar -xvf foldseek-linux-sse2.tar.gz
	docker exec -it venome-backend rm -f foldseek-linux-sse2.tar.gz
}

function remove_foldseek() {
	docker exec -it venome-backend rm -f foldseek-linux-sse2.tar.gz*
	docker exec -it venome-backend rm -fr foldseek/
}

function add_tmalign() {
	docker exec -it venome-backend wget https://seq2fun.dcmb.med.umich.edu//TM-align/TMalign_cpp.gz
	docker exec -it venome-backend mkdir tmalign
	docker exec -it venome-backend gzip -d TMalign_cpp.gz
	docker exec -it venome-backend mv TMalign_cpp tmalign/tmalign
	docker exec -it venome-backend chmod a+x tmalign/tmalign
	docker exec -it venome-backend rm -f TMalign_cpp.gz
}

function remove_tmalign() {
	docker exec -it venome-backend rm -f TMalign_cpp.gz*
	docker exec -it venome-backend rm -fr tmalign/
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
