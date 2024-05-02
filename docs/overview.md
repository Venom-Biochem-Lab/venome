# Overview

This document outlines all our design choices and architecture decisions. It also points you in the right direction to get started developing. 

But before you read the overview, if you're new, at the very least, get the website running which is described in the [⚡️ Quick Start](../README.md#️⚡️-quick-start) Section.

In the next few sections, I increase the amount of information I give you in passes. We start with the most high level: the first pass.

## First pass

The code is split into two main sections. The [`frontend`](../frontend/) and the [`backend`](../backend/).

The [`frontend`](../frontend/) is the website itself. It's the user interface that people interact with.

The [`backend`](../backend/) sits behind the [`frontend`](../frontend/). To be accurate, the [`frontend`](../frontend/) makes requests to the [`backend`](../backend/), and the [`backend`](../backend/) sends back responses.


## Second pass

The [`frontend`](../frontend/) is what runs on your browser. So you've guessed it, its JavaScript and HTML.

It's actually better than JavaScript and HTML, it's [Svelte](https://svelte.dev/).

Svelte is a hybrid of the two that makes writing reactive user interfaces with components super easy. Svelte compiles into vanilla JavaScript and HTML, which is what you see in the browser.

The [`backend`](../backend/) is what our frontend makes HTTP requests to. Our backend runs Python and [FastAPI](https://fastapi.tiangolo.com/) as the HTTP server. FastAPI is the library that handles all the requests.


## Third pass