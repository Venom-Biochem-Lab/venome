<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";

	export let data; // linked to +page.ts return (aka the id)
	let entry: any;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinId, "info from backend");
		entry = await Backend.getProteinEntry(data.proteinId);
		console.log("Received", entry);
	});
</script>

{#if entry}
	<!-- if got entry from backend, display it -->
	<h1>{entry}</h1>
{:else}
	<!-- Otherwise, tell user we have an error -->
	<h1 style="color: red;">Error</h1>
{/if}

<style>
</style>
