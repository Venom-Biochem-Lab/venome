#!/bin/bash

# CALL STRUCTURE: sh run.sh <command>
# EXAMPLE: sh run.sh start
# more docs are in the docs/run.md file

COMPOSE_CONFIG=docker-compose.yml

function all() {
	start
}

function quickstart() {
	start
	add_foldseek
	add_tmalign
}

function start() {
	docker compose -f $COMPOSE_CONFIG up -d
}

function stop() { 
	docker compose -f $COMPOSE_CONFIG down
}

# generates the api bridge between frontend and backend
function gen_api() {
	cd frontend
	yarn openapi
	cd ..
	docker compose -f $COMPOSE_CONFIG restart frontend
}

# clears the postgres persistent storage
function rm_volume() {
	stop
	docker volume rm venome_postgres_data
	start
}


function sql_date_backup() {
  docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome --inserts > backend/backups/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

function sql_dump() {
	if [ "$1" != "" ]; then
		docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome --inserts > $1
	else
		echo "ERROR: .sql file not specified."
	fi
}

function sql_delete() {
	rm_volume
}

function sql_source() {
	# holy shit this is scuffed
	# in production mode, need to copy over stuff
	if [ "$1" != "" ]; then
	 	temp_file=temp.sql
		docker cp $1 venome-postgres:/$temp_file # send over the sql file to postgres server
		docker exec -t venome-postgres psql --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome -f $temp_file # execute the sql file
		docker exec -t venome-postgres rm -f $temp_file
	else
		echo "ERROR: .sql file not specified."
	fi
}

function sql_reload() {
	sql_delete 
	sleep 5 # not sure why this works, but a delay is needed oddly sql_delete takes time to finish
	sql_source $1
}

function backup() {
	if [ "$1" != "" ]; then
		mkdir $1
		sql_dump $1/dump.sql
		docker cp venome-backend:/app/src/data/stored_proteins/ $1
	else
		echo "ERROR: backup name not specified."
	fi
}

function reload_from_backup() {
	if [ "$1" != "" ]; then
		docker exec -t venome-backend rm -fr src/data/stored_proteins # remove what's already there
		docker cp $1/stored_proteins/ venome-backend:/app/src/data/stored_proteins/ # send over our backup files to docker
		sleep 5
		sql_reload  $1/dump.sql # reload from the schema
	else
		echo "ERROR: backup name not specified."
	fi
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

# complete from scratch rebuild
function restart_from_scratch() {
	stop
	docker compose -f $COMPOSE_CONFIG up --build -d	
}

function add_foldseek() {
	docker exec -it venome-backend wget --no-check-certificate https://mmseqs.com/foldseek/foldseek-linux-sse41.tar.gz
	docker exec -it venome-backend tar -xvf foldseek-linux-sse41.tar.gz
	docker exec -it venome-backend rm -f foldseek-linux-sse41.tar.gz
}

function remove_foldseek() {
	docker exec -it venome-backend rm -f foldseek-linux-sse41.tar.gz*
	docker exec -it venome-backend rm -fr foldseek/
}


#This needs to be run within the terminal in the backend/ directory to have this work on windows.
=======
# NOTE: Only run this if you are on a linux machine. Otherwise paste the command into your Docker terminal backend

function add_pdb_database(){
	docker exec -it venome-backend foldseek/bin/foldseek databases PDB pdb PDBproteins
}

function remove_pdb_database(){
	cd backend
	rm -rf PDBproteins
	rm -rf pdb*
}

function add_tmalign() {
	docker exec -it venome-backend wget --no-check-certificate https://seq2fun.dcmb.med.umich.edu//TM-align/TMalign_cpp.gz
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

function rebuild_venome_molstar_pkg() {
	# build locally
	cd frontend
	yarn build:venome_molstar

	# build on docker
	docker exec -it venome-frontend cd frontend
	docker exec -it venome-frontend yarn build:venome_molstar
}

function scrape_func_names() {
	functions=($(grep -oE 'function[[:space:]]+[a-zA-Z_][a-zA-Z_0-9]*' ./run.sh | sed 's/function[[:space:]]*//'))
}

=======
function create_secret(){
	if [ "$1" != "" ]; then
		echo "Creating .env file for secret key"
		echo SECRET_KEY=$1 > backend/.env
	else
		echo "ERROR: Secret key not specified."
	fi
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

		if [ "$2" == "-p" ]; then
			# if you put a -p after the function name, indicates production config
			COMPOSE_CONFIG=docker-compose-prod.yml
			$1 $3 # $2 was -p so rest of arguments onwards $3 is second arg now
			else
			$1 $2 # $2 and on are arguments passed into the $1 function
		fi

		exit 0
	fi
done

# if we get to this point, the command does not exist
echo "ERROR: command '$1' does not exist"
exit 1
