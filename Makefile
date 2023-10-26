install-front:
	cd frontend; yarn install

install-back:
	cd backend; poetry install

front:
	cd frontend; yarn dev --open

back:
	cd backend; poetry run dev

api: # the backend server needs to be running too
	cd frontend; yarn openapi
