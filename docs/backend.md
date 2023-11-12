# Backend

These docs go over the [`backend/`](../backend/) dir. Go to the [`database.md`](./database.md) if you were looking for db specific things.


## Logging

Note that `print` is wonky on docker, so instead import `logging as log` and use `log.warn(stuff)` to print stuff to the console in docker.

## Docker Reset

For a soft restart do

```bash
sh run.sh restart
```

for a hard cache clearing restart, do

```bash
sh run.sh hard_restart
```

## Testing

```bash
sh run.sh test_backend
```

## Add packages

```bash
poetry add py_package_name
```
