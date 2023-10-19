<img width="100%" alt="banner" src="https://github.com/xnought/venome/assets/65095341/9abaef4e-b4ac-488f-b190-86fca1a1c940">

**A user friendly system to discover insights into venom protein data.**

## Getting Started

Both the **Frontend** and **Backend** need to be running at the same time.

### Frontend

First install the [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) package manager.

Then, use yarn to install the frontend packages

```bash
cd frontend
yarn install
```

To start the development server then do

```bash
yarn dev --open
```

Now navigate to your browser at [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

### Backend

First install the backend python packages

```bash
cd backend
pip3 install -r requirements.txt
```

Then, run the HTTP server by

```bash
python3 server.py
```

## Docs

To generate the documentation website, run

```bash
cd docs
yarn
yarn dev
```

## Files

-   [`frontend`](./frontend/README.md) contains the user interface in Svelte/JS
-   [`backend`](./backend/README.md) contains the HTTP server and Database

## Resources

-   [Design Space (Figma)](https://www.figma.com/file/G1pbQsYy4lCTVCvMEnGydX/Unknown-Venome-Project?type=design&node-id=0%3A1&mode=design&t=re8tfITwMPw75A2I-1)
-   [Whiteboard (Figma Jam)](https://www.figma.com/file/ZKwrwzXrbwqMJUTFPF4yV0/Open-Venome-Project?type=whiteboard&node-id=0%3A1&t=DZbia2Quj2IXPhHm-1)
-   [Protein BioChem](<https://bio.libretexts.org/Bookshelves/Biochemistry/Book%3A_Biochemistry_Free_For_All_(Ahern_Rajagopal_and_Tan)/02%3A_Structure_and_Function/203%3A_Structure__Function-_Proteins_I>)
