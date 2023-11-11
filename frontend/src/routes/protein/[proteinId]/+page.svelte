<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";

	export let data; // linked to +page.ts return (aka the id)

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinId, "info from backend");
		const entry = await Backend.getProteinEntry(data.proteinId);
		console.log("Received", entry);
	});
</script>

<h1>Protein Wiki Entry</h1>
<div>
	{data.proteinId}
</div>

<style>
</style>
