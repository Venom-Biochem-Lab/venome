# How To: Create and Use API Endpoints
This is step-by-step guide on how to create API endpoints. For higher-level overviews on how our backend works, see [backend.md](backend.md) and [overview.md](overview.md).


## 1. Create the Endpoint
We use a Python framework called FastAPI to generate our API calls. Each one of our API calls are python functions inside of [`backend/src/api/`](../backend/src/api/). You can see a lot of examples in that folder, but each individual API call looks something like this:

```python
class TestOverviewResponse(CamelModel):
    hello_there: str
    echo: str

@router.get("/test/overview", response_model=TestOverviewResponse)
def test_overview(query):
	return TestOverviewResponse(
        hello_there="world",
        echo=query
    )
```

You can learn about what each constituent part means over at [overview.md](overview.md), in the fourth pass. For this example, I modified test_overview to take in a "query" argument, which the caller supplies in the form of a JSON.

Most often, you want to make a backend to access our database. You can learn more about how to do this in [database.md](database.md)


## 2. Test the Endpoint

Once you've created the endpoint, we highly recommend that you test it *before* spending time trying to integrate it into the frontend. Even though we call our server the "backend", it's technically a separate API server that anyone can make queries to.

To test the endpoint, you have a few optinos:

For *get* requests, once you have the backend running ([deployment.md]('deployment.md')), you can just type `localhost:8000/{api_endpoint}` into your browser and get a result.

For other request types, you can use API testing software such as [Insomnia](https://insomnia.rest/) to make API requests. Beyond accessing *delete*, *post*, and *update* requests, Insomnia allows you to do things like set bearer tokens (important for testing restricted API calls) and manually send JSON files over.

Using something like Insomnia can cut down on your dev time by a lot.

## 3. Generate a function that the function can use to query the backend

Once you're done creating and testing your API call, you must generate a function that the front-end can use to query the backend. To do this, you can simply run the shell command `./run.sh gen_api`

You can read more about how this works in the fifth pass at [overview.md](overview.md).

## 4. Importing the generated functions / objects

When the `gen_api` shell command was ran, it few objects to help the frontend access the backend.

First, it will have created an asynchronous function for the frontend to call whenever it wants to access the endpoint. This function will share the same name as your Python call (but since we're using CamelModel, it's going to be ). All of the API functions created are stored as methods inside of the `Backend` object.

Second, it will have generated object types based on the response model you created for the API to return. So using the hypothetical */test/overview* endpoint from earlier, the `gen_api` command would have generated an object type called `TestOverviewResponse.`

To access these objects in the frontned, you simply need to import them in the script section of your Svelte file:

```ts
import { Backend, type TestOverviewResponse } from "../lib/backend";
```

## 5. Use the objects to grab data from the backend

Now that you have the objects imported, you only need to use them! To continue along with the example from the top of the document, this is how you would make a call to the backend and store its data:

```ts
let testResponse = TestOverviewResponse;

testResponse  = await Backend.testOverview({
    query: "Echo this!"
});
```

From here, you can use the testResponse like you could any other JSON object in svelte:

```svelte
<div>
    <b>Test Response:</b>
    {testResponse.helloThere}
    <b>The Echo:</b>
    {echo}
</div>
```

This test response endpoint was a fairly simple one. You can see another example in [overview.md](overview.md), or you can also look at some of our Svelte files (like [`Protein.svelte`](../frontend/src/routes/Protein.svelte)) for more complex use cases.
