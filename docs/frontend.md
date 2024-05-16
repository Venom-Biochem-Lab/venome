# [frontend](../frontend/)

We use Svelte and specifically vite to build the application. The main svelte code is located in [frontend/src/](../frontend/src/). 

We also have a separate library called [frontend/venome-molstar](../frontend/venome-molstar/) which is a separate project for the visualization system. 

We directly include the source code from venome-molstar in our application so no need to build it separately. 

## How routes work

The Svelte [`frontend`](../frontend/)'s entry point is [`frontend/src/App.svelte`](../frontend/src/App.svelte). You can think of this as the web app that you see. As you can see there isn't much there, there is just a `<Router />` component.

The `<Router />` or [`frontend/src/Router.svelte`](../frontend/src/Router.svelte) component, defines which URLs a user can route to. Hence router. Lets take a look at that Router file.

One example, the home route `/`, which is the default, corresponds to `<Route path="/"><Home /></Route>`. All this says is when the user has the URL `/`, Svelte will mount/render the `<Home />` component.

The entire Svelte frontend is rendered this way using. 

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

Here is an example where I call the backend function found in [backend/src/api/search.py](../backend/src/api/search.py) called `search_range_length` and in it get translated into camel case as

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

## venome-molstar

Although the entire application is svelte, it uses a package called [PDBe-Molstar](https://github.com/molstar/pdbe-molstar) with some modifications (which is why we copied it onto our repo). Their package is React and TS based. But you can easily build the library again using `yarn ts:build` when you are in the `venome-molstar` directory.

We directly import the build in our svelte application as you can see in [`Molstar.svelte`](../frontend/src/lib/Molstar.svelte).

If you change the files in the venome-molstar, you must rebuild the application using `yarn ts:build`.

Alternatively, run the `./run.sh rebuild_venome_molstar_pk` to rebuild it both on the local and docker. This will give you local autocomplete.