# Backend

Note that `print` is wonky on docker, so instead import `logging` and use `logging.warn(stuff)` to print stuff.

## Add packages

```bash
poetry add py_package_name
```

Note you'll need to rebuild the docker container after adding a new package

```bash
make hard-restart
```