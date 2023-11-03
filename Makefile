all: restart

# IMPORTANT To run the docker
start:
	docker-compose up -d

# starts, but builds from scratch without cache
start-clear-cache:
	docker-compose up --build -d	

# IMPORTANT stops the container 
stop:
	docker-compose down

restart:
	make stop
	make start

hard-restart:
	make stop
	make start-clear-cache

# IMPORTANT generates the api for the frontend to call the backend (Backend object and types)
# Note that the backend server must be running
api: 
	cd frontend; yarn openapi

# clears the postgres persistent storage
rm-volume:
	make stop
	docker volume rm venome_postgres_data

# creates a sql dump file of the database (backup) into the backend/data folder
backup:
	docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome > backend/data/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

# Getting started install
install:
	pip3 intall poetry
	poetry config virtualenvs.in-project true
	@echo "Install Docker Desktop https://www.docker.com/products/docker-desktop/"
	@echo "and make sure `docker-compose` is available as a bash command"

# reset the local backend/.venv (local python packages for autocomplete)
restart-venv:
	cd backend; poetry config virtualenvs.in-project true;
	cd backend; poetry env list; poetry env remove --all; 
	cd backend; poetry install