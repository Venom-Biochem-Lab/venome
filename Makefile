all: up

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	make down
	make up

hard-restart:
	make down
	docker-compose up --build -d	

api: # generates the api for the frontend to call the backend 
	cd frontend; yarn openapi

rm-volume:
	make down
	docker volume rm venome_postgres_data

backup:
	docker exec -t venome-postgres pg_dump --dbname=postgresql://myuser:mypassword@0.0.0.0:5432/venome > backend/data/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

install:
	pip3 intall poetry
	poetry config virtualenvs.in-project true
	@echo "Install Docker Desktop https://www.docker.com/products/docker-desktop/"
	@echo "and make sure `docker-compose` is available as a bash command"

restart-venv:
	cd backend; poetry config virtualenvs.in-project true;
	cd backend; poetry env list; poetry env remove --all; 
	cd backend; poetry install