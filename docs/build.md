# docker

For tons of nice commands to quickly use, see the [`run.md`](./run.md). The production build differs from the development build. Read more to find out.

## Development Build

The development composes together docker containers to build the entire application.

In our case we have a backend Dockerfile as [`backend/Dockerfile`](../backend/Dockerfile) and a frontend Dockerfile as [`frontend/Dockerfile`](../frontend/Dockerfile). These development servers are run and configured in the [`docker-compose.yml`](./docker-compose.yml) file.

For more information see the [`backend.md`](./backend.md), the [`frontend.md`](./frontend.md), or the [`database.md`](./database.md).

To run with the default config, just run any of the `run.sh` documented in[`run.md`](./run.md).

For example

```bash
./run.sh start
```

or

```bash
./run.sh reload_from_backup backups/v0.0.3
```

## Production Build

The production build is slightly different than regular development. In fact, there is a different frontend build script [`frontend/Dockerfile.prod`](../frontend/Dockerfile.prod) and a different docker compose [`docker-compose-prod.yml`](../docker-compose-prod.yml).

To run with production, add the `-p` flag on `run.sh` commands after the cmd call.

For example

```bash
./run.sh start -p
```

will run `docker compose -f docker-compose-prod.yml up -d` instead of the normal config. This works for any other command too.

For example to delete the current database and reload from the last snapshot, as long as I include the `-p` flag too for production it works

```bash
./run.sh reload_from_backup -p backups/v0.0.3
```
