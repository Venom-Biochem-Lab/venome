<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { AllEntries } from "$lib/backend";

	// at some point, this should be change to request from the backend
	let all: AllEntries;
	onMount(async () => {
		// calls get_all_entries() from backend
		// to generate this Backend object run `make api` for newly created server functions
		all = await Backend.getAllEntries();
	});
</script>

<!-- akin to <head /> in html -->
<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>All Protein Entries</h1>

	<!-- TODO: Organize this into a better looking table  -->
	<div class="entries">
		{#if all}
			{#each all.proteinEntries as entry}
				<div class="entry">
					<!-- routes to the protein entry itself (new page) -->
					<a href="/protein/{entry.name}">{entry.name}</a>
				</div>
			{/each}
		{/if}
	</div>
</section>

<style>
	.entries {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
