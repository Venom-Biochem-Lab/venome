install-front:
	cd frontend; yarn install

intall-back:
	cd backend; poetry install

front:
	cd frontend; yarn dev --open

back:
	cd backend; poetry run dev
