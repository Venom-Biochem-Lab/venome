<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "$lib/backend";
	import ProteinVis from "$lib/ProteinVis.svelte";
	import { Spinner } from "flowbite-svelte";

	export let data; // linked to +page.ts return (aka the id)
	let entry: ProteinEntry | null = null;
	let error = false;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinId, "info from backend");

		entry = await Backend.getProteinEntry(data.proteinId);
		// if we could not find the entry, the id is garbo
		if (entry == null) error = true;

		console.log("Received", entry);
	});
</script>

{#if entry}
	<!-- if got entry from backend, display it -->
	<h1>{entry.name}</h1>
	<br />
	<code>
		<pre>
			{JSON.stringify(entry, null, 2)}
		</pre>
	</code>

	<ProteinVis
		format="pdb"
		url="http://localhost:8000/data/pdbAlphaFold/{entry.name}.pdb"
	/>
{:else if !error}
	<!-- Otherwise, tell user we tell the user we are loading -->
	<h1>Loading Protein Entry <Spinner /></h1>
{:else if error}
	<!-- if we error out, tell the user the id is shiza -->
	<h1>Error</h1>
	<p>Could not find a protein with the id <code>{data.proteinId}</code></p>
{/if}

<style>
</style>
