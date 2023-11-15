# Backend

These docs go over the [`backend/`](../backend/) dir. Go to the [`database.md`](./database.md) if you were looking for db specific things.


## Logging

Note that `print` is wonky on docker, so instead import `logging as log` and use `log.warn(stuff)` to print stuff to the console in docker.

## Add packages

```bash
poetry add py_package_name
```

which adds the package locally (so your intellisense can detect it).

To have those packages also installed/reflected in the backend run

```bash
sh run.sh install_backend
```

or rebuild the entire docker (this method is slower, but guaranteed to work) with 

```bash
sh run.sh hard_restart
```

## Testing

```bash
sh run.sh test_backend
```

