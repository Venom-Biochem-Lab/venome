<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";

	let allEntries: ProteinEntry[] | null = null;
	onMount(async () => {
		allEntries = await Backend.getAllEntries();
	});
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<section>
	<ListProteins {allEntries} />
</section>
