# Testing

Tests will run on pull request, but here are some docs on how to test locally or add new tests.

## Running Tests

You can run tests with

```bash
sh run.sh test
```

which runs the backend and frontend tests.


To run them individually by

### Run Frontend Tests

```bash
sh run.sh test_frontend
```

### Run Backend Tests

```bash
sh run.sh test_backend
```

## Creating Tests

### Creating Frontend Tests

In the frontend add your tests to [`frontend/src/tests`](../frontend/src/tests/) folder.

Specifically name your files with `filename.test.ts` to label them as test files. Then check out the existing examples to see how to add unit tests.

Checkout [`example.test.ts`](../frontend/src/tests/example.test.ts) for an example.

### Creating Backend Tests

In the backend add your tests to [`backend/src/tests`](../backend/src/tests/) folder.

Specifically name your files with `filename_test.py` to label them as test files. Then check out the existing examples to see how to add unit tests.

Checkout [`example_test.py`](../backend/src/tests/example_test.py) for an example.
