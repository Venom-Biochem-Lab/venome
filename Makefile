install-front:
	cd frontend; yarn install

install-back:
	cd backend; poetry install

front:
	cd frontend; yarn dev --open

back:
	cd backend; poetry run dev
