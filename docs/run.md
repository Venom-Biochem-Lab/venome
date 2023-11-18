#  [`run.sh`](../run.sh)

The [`run.sh`](../run.sh) contains all the commands you would ever want to run.

You can easily call a function defined in the [`run.sh`](../run.sh) by calling

```bash
sh run.sh <cmd>
```

`<cmd>` can be any one of these useful commands (I noted 👉 as the most useful/important in my opinion)

|  `<cmd>` |  what it does  |
|---|---|
|  `start` | 👉 Starts/runs the docker container |
|  `stop` |  👉 Stops the docker container |
|  `refresh_packages` | 👉  Updates or adds new packages in frontend and backend, needs to be run every time you add a new package locally |
|  `restart` |  Stops, then Starts the docker container |
|  `soft_restart` | 👉 Updates or adds packages, reloads the init sql, and restarts. Use this if you're getting errors. |
|  `hard_restart` | 👉 Builds the docker container from scratch and starts it, do this if you're having errors that even `soft_restart` can't fix |
|  `gen_api` | 👉 Creates/Generates the frontend api code based on the backend endpoints |
|  `reload_init_sql` | 👉  When you change the the schema in [`init.sql`](../backend/init.sql), this reloads it, otherwise your changes won't show up in the docker |
|  `sql_dump` | Dumps the current db contents and schema into [`backups/`](../backend/backups/).|
|  `psql` | Opens up a direct terminal into the database to execute SQL commands live |
|  `test` | Runs all unit tests |
|  `test_backend` | Runs only backend unit tests |
|  `test_frontend` | Runs only frontend unit tests |

There are actually many more functions, so please check out [`run.sh`](../run.sh).



