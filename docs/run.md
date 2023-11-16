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
|  `restart` |  Stops, then Starts the docker container |
|  `hard_restart` | 👉 Builds the docker container from scratch and starts it, do this if you're having errors |
|  `gen_api` | 👉 Creates/Generates the frontend api code based on the backend endpoints |
|  `reload_init_sql` | Reload/change the schema in [`init.sql`](../backend/init.sql)|
|  `sql_dump` | Dumps the current db contents and schema into [`backups/`](../backend/backups/).|
|  `psql` | Opens up a direct terminal into the database to execute SQL commands live |
|  `test` | Runs all unit tests |
|  `test_backend` | Runs only backend unit tests |
|  `test_frontend` | Runs only frontend unit tests |

There are actually many more functions, so please check out [`run.sh`](../run.sh).



