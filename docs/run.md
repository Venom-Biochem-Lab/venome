#  [`run.sh`](../run.sh)

The [`run.sh`](../run.sh) contains all the commands to run the backend, frontend, restart the containers, and more.

You can easily call a function defined in the [`run.sh`](../run.sh) by calling

```bash
./ run.sh <cmd>
```

or for production mode

```bash
./run.sh <cmd> -p
```

## Command reference

Commands from [`run.sh`](../run.sh) listed below with descriptions for how to use it.

> [!IMPORTANT]
> Use the `-p` flag right after the `<cmd>` for production mode. This will change the default [`docker-compose.yml`](../docker-compose.yml) to [`docker-compose-prod.yml`](../docker-compose-prod.yml) in the [`run.sh`](../run.sh).
> For example you can run `./run.sh start -p` to build in production mode. Or to source the schema with the init.sql you can do `./run.sh sql_reload -p backend/init.sql`.

### Build commands

|  ./run.sh `<cmd>` |  what it does  |
|---|---|
|  `gen_api` |  Creates/Generates the frontend api code based on the FastAPI endpoints [`frontend/src/lib/backend/openapi/`](../frontend/src/lib/openapi/). Note that the docker needs to be running. |
|  `start` |  Starts/runs the docker container where edits to the backend or frontend will hot reload |
|  `stop` |   Stops the docker container |
|  `restart` |   Stops then starts the docker container. |
|  `rebuild_from_scratch` |  Nukes the docker and rebuilds everything from scratch. |
|  `refresh_packages` |   Updates or adds new packages in frontend and backend, needs to be run every time you add a new package locally |


### Database commands

Note that for production mode, if there is a second argument like `<filename>` it follows the `-p` flag. For example `./run.sh sql_reload -p backend/init.sql`. If you're running in default dev mode, ignore this.

|  ./run.sh `<cmd>` |  what it does  |
|---|---|
|  `psql` | Opens up a direct terminal into the database to execute SQL commands live |
|  `sql_reload <filename>` | Deletes all the database and sources the `<filename>`. Example: `./run.sh sql_reload backend/init.sql`.|
|  `sql_source <filename>` | Sources/executes the `<filename>` on the db. Example: `./run.sh sql_source backend/init.sql`.|
|  `sql_delete` | Deletes all database contents.|
|  `sql_dump <filname>` | Dumps the current db contents and schema to `<filename>`. Example: `./run.sh sql_dump example.sql` will dump the db to `example.sql`.|
|  `sql_date_backup` | Dumps the current db contents and schema to `backend/backups` with the current timestamp as filename. |

### Addons
|  ./runsh `<cmd>` |  what it does  |
|---|---|
|  `add_venom_lab_proteins` |  Uploads all venom lab protein with POST requests (might have to `pip3 install requests` globally)  |
|  `remove_venom_lab_proteins` |  Deletes all venom lab protein with DELETE requests (might have to `pip3 install requests` globally)  |
|  `add_foldseek` |  installs foldseek onto the docker container via wget |
|  `remove_foldseek` |  deletes foldseek from the docker container |
|  `add_tmalign` | installs tm align onto the docker container via wget |
|  `remove_tmalign` | deletes tmalign from the docker container |


