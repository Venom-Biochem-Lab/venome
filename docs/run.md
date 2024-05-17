#  [`run.sh`](../run.sh)

The [`run.sh`](../run.sh) contains all the commands to run the backend, frontend, restart the containers, and more.

You can easily call a function defined in the [`run.sh`](../run.sh) by calling

```bash
sh run.sh <cmd>
```

or

```bash
./run.sh <cmd>
```

## Common Uses

**starting up**

```bash
./run.sh start
```

**starting with foldseek and tmalign**
```bash
./run.sh quickstart
```

**If you're having big errors and have tried everything. Start over from scratch with**

```bash
./run.sh hard_restart
```

**If you want to restart everything without nuking the whole project, try a softer version**


```bash
./run.sh soft_restart
```


**If you changed the [`init.sql`](../backend/init.sql) and you're not seeing any changes**

```bash
./run.sh reload_init_sql
```

## More Commands

|  `<cmd>` |  what it does  |
|---|---|
|  `start` |  Starts/runs the docker container where edits to the backend or frontend will hot reload |
|  `quickstart` | Starts/runs the docker container as above, and installs foldseek / tmalign. |
|  `stop` |   Stops the docker container |
|  `soft_restart` |  Updates or adds packages, reloads the database from [`init.sql`](../backend/init.sql). |
|  `hard_restart` |  Builds the docker container from scratch and starts it, do this if you're having errors that even `soft_restart` can't fix |
|  `refresh_packages` |   Updates or adds new packages in frontend and backend, needs to be run every time you add a new package locally |
|  `gen_api` |  Creates/Generates the frontend api code based on the backend endpoints |
|  `reload_init_sql` |   When you change the the schema in [`init.sql`](../backend/init.sql), this reloads it, otherwise your changes won't show up in the docker |
|  `sql_dump` | Dumps the current db contents and schema into [`backups/`](../backend/backups/).|
|  `psql` | Opens up a direct terminal into the database to execute SQL commands live |
|  `upload_all` |  Uploads all the pdb files to the system via POST requests |
|  `delete_all` |  Deletes all protein entries and restarts the server from scratch |
|  `add_foldseek` |  installs foldseek onto the docker container via wget |
|  `remove_foldseek` |  deletes foldseek from the docker container |
|  `add_tmalign` | installs tm align onto the docker container via wget |
|  `remove_tmalign` | deletes tmalign from the docker container |

There are actually many more functions, so please check out [`run.sh`](../run.sh).

