# Future Work for next group (Todo)

This is from the 2024-2025 capstone group to the future groups about stuff we wanted to do, but didn't have enough time to.

**High Urgency**

- Add the rest of the AlphaFold 3 visualizations to the database
- Better way to upload and download new backups. Currently you can make backups, but having it git version controlled is a pain. Instead have a google drive or cloudflare cloud storage that we can download and upload backups to.
- User testing with real users and students that use the site. (use students in Nate's class)

**Low Urgency**

- Protein clustering. Clustering our venome proteins against larger databases to reveal families or other stuff.
  - Add Taxonomy for proteins (issue #282)
- Species page. We don't currently allow people to create or view species, so have a way to dynamically add species and view them in the frontend. (issue #109)
- Automatically backup the database so we don't lose all the data accidentally. (issue #273)
- Upload a file to compare against our venome database (issue #283)
- Dynamic integration for multiple visualization types (issue #280)
- Better error handling, many of the errors give generic errors or incorrect errors
  - When uploading a file that is not compatible, the error given says that the name is already taken in the database (issue #260)
- The edit user function does not work properly (issue #305)
