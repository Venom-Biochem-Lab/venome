# [frontend](../frontend/)

We use Svelte and specifically vite to build the application. The main svelte code is located in [frontend/src/](../frontend/src/). 

We also have a separate library called [frontend/venome-molstar](../frontend/venome-molstar/) which is a separate project for the visualization system. 

We directly include the source code from venome-molstar in our application so no need to build it separately. 


## UI Styling

Our frontend uses [Flowbite Svelte Components](https://flowbite-svelte.com/) and [Tailwind CSS](https://tailwindcss.com/), although feel free to use native CSS.

Check out Flowbite to use those ready-made svelte components (like buttons, dropdowns, tooltips, cards, and more).

## Add packages

First add the package locally for intellisense

```bash
cd frontend
yarn add -W js_package_name
```
(-W is needed for yarn workspaces which is what we are doing)

then install in the docker container with

```bash
sh run.sh install_frontend
```

## Backend fetch requests

You can simply import the `Backend` object and call the functions by name (which will subsequently call the server).

Here is an example where I call the backend function found in [backend/src/api/search.py](../backend/src/api/search.py#L115) called `search_range_length` and in it get translated into camel case as

```ts
import { Backend } from '../lib/backend';
console.log(await Backend.searchRangeLength()) 
```

Under the hood the `Backend` object simply does a `fetch()` but here we get type generation and an easy API.

To generate this `Backend` API in the frontend, you must run

```bash
./run.sh gen_api
```

which reads from the server and generates that library for the frontend. Super cool! In other words it reads our end points and create a nice wrapper over them for the frontend.
