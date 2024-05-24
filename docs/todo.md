# Todo

This is from the 2023-2024 capstone group to the future groups about stuff we wanted to do, but didn't have enough time to.

- Secure authentication. Right now we have our own first-party authentication solution where we store users, hashed passwords, and we check the hashes. Have a more secure way to do this.
  - The secret key in [`auth.py`](../backend/src/auth.py) isn't even remotely secure at the moment. If you stick with first-party authentication, you should find a better way to generate this.
  - It would probably be best to adopt a third-party authentication scheme instead, e.g. "Log In with Google."
- Protein clustering. Clustering our venome proteins against larger databases to reveal families or other stuff.  
- Foldseek against protein data bank. In addition to similar proteins within venome, also show similar from the protein data bank.
- Species page. We don't currently allow people to create or view species, so have a way to dynamically add species and view them in the frontend.
- Better way to upload and download new backups. Currently you can make backups, but having it git version controlled is a pain. Instead have a google drive or cloudflare cloud storage that we can download and upload backups to.
