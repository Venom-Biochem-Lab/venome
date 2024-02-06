<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";

	let textSearch = "";
	let proteinEntries: ProteinEntry[];
	let totalFound = 0;
	let species: string[] | null = [];
	let selectedSpecie: string | undefined;
	onMount(async () => {
		await search();
		species = await Backend.searchSpecies();
	});

	async function search() {
		const result = await Backend.searchProteins({
			query: textSearch,
			speciesFilter: selectedSpecie,
		});
		proteinEntries = result.proteinEntries;
		totalFound = result.totalFound;
	}
	async function resetFilter() {
		selectedSpecie = undefined;
		await search();
	}
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<section>
	<div id="sidebar">
		Filter By

		<div>
			{#if species}
				{#each species as s}
					<div
						on:click={async () => {
							selectedSpecie = s;
							await search();
						}}
					>
						{s}
					</div>
				{/each}
			{/if}
		</div>
		<div on:click={resetFilter}>Reset</div>
	</div>
	<div id="view">
		<form id="search-bar" on:submit={search}>
			<Search
				size="lg"
				type="text"
				class="flex gap-2 items-center"
				placeholder="Enter search..."
				bind:value={textSearch}
			/>
			<Button type="submit" size="sm">Search</Button>
		</form>
		{#if totalFound > 0}
			<div id="found">
				{totalFound} proteins found
			</div>
		{/if}
		{#if proteinEntries === undefined || proteinEntries.length === 0}
			No proteins Found
		{:else}
			<ListProteins allEntries={proteinEntries} />
		{/if}
	</div>
</section>

<style>
	section {
		display: flex;
		position: relative;
	}
	#sidebar {
		width: 400px;
		height: calc(100vh - 60px);
		border-right: 1px solid #00000010;
		background: #00000005;
		position: fixed;
		top: 60px;
	}
	#view {
		margin-left: 400px;
		padding: 5px;
	}

	#search-bar {
		display: flex;
		width: 500px;
		gap: 5px;
		padding: 10px;
	}

	#found {
		position: absolute;
		top: 25px;
		right: 25px;
		color: var(--darkblue);
	}
</style>
