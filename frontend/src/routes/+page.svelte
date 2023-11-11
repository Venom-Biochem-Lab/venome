<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Backend } from "$lib/backend";
	import type { AllEntries } from "$lib/backend";

	// at some point, this should be change to request from the backend
	let all: AllEntries;
	onMount(async () => {
		// calls get_all_entries() from backend
		// to generate this Backend object run `./run.sh api` for newly created server functions
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
				<div
					class="entry"
					title="Click to see {entry.name}"
					on:click={() => goto(`/protein/${entry.name}`)}
					role="link"
				>
					<!-- routes to the protein entry itself (new page) -->
					<div class="name">
						{entry.name}
					</div>
					<div class="description">
						{entry.description}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</section>

<style>
	section {
		padding-left: 50px;
	}
	.entries {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.entry {
		border: 1px solid var(--color-theme-1);
		border-radius: 3px;
		width: 400px;
		padding: 10px;
		cursor: pointer;
	}
	.entry:hover {
		box-shadow: 0px 2px 3px 3px rgba(0, 0, 0, 0.09);
	}
	.name {
		font-size: 1.5em;
		color: var(--color-theme-1);
	}
</style>
