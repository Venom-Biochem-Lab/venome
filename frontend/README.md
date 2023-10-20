# Frontend

In [SvelteKit](https://kit.svelte.dev/) which uses the [Svelte](https://svelte.dev/) JavaScript framework which makes frontend work really freaking easy and great for visualizations.

Here are [tutorials](https://learn.svelte.dev/tutorial/welcome-to-svelte) if you are interested, you'll find it simpler than regular JavaScript and much faster than other frameworks like React.

## Development

To run the frontend in your browser do

```bash
cd frontend
yarn install
yarn dev --open
```

## Access to Backend Functions

You can create functions in the [`backend/server.py`](../backend/server.py) and import them into the frontend.

To do this, you need to have saved your changes in the backend, restart the server, then run `yarn openapi` in the frontend to transfer the types and functions into a readable frontend format.

Now you can simply import the `Backend` object and call the functions by name (which will subsequently call the server).

Example

```ts
import { Backend } from '$lib/backend';
console.log(await Backend.helloWord()) // > {"message": "Hello World"}
```

It's that easy!

## Need help?

First check [SvelteKit](https://kit.svelte.dev/) docs to figure out what files mean what. Then ask @xnought.
