<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "../lib/backend";
	import type { ProteinEntry } from "../lib/backend";
	import ListProteins from "../lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";
	import RangerFilter from "../lib/RangerFilter.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";

	let query = "";
	let proteinEntries: ProteinEntry[];
	let totalFound = 0;
	let species: string[] | null = [];
	let speciesFilter: string | undefined;
	let lengthFilter: { min: number; max: number } | undefined;
	let lengthExtent: { min: number; max: number };
	let massFilter: { min: number; max: number } | undefined;
	let massExtent: { min: number; max: number };
	onMount(async () => {
		await search();
		species = await Backend.searchSpecies();
		lengthExtent = await Backend.searchRangeLength();
		massExtent = await Backend.searchRangeMass();
		massFilter = massExtent;
		lengthFilter = lengthExtent;
	});

	async function search() {
		const result = await Backend.searchProteins({
			query,
			speciesFilter,
			lengthFilter,
			massFilter,
		});
		proteinEntries = result.proteinEntries;
		totalFound = result.totalFound;
	}
	async function resetFilter() {
		speciesFilter = undefined;
		lengthFilter = lengthExtent;
		massFilter = massExtent;
		query = "";
		await search();
	}
</script>

<svelte:head>
	<title>Venome Search</title>
</svelte:head>

<section>
	<div id="sidebar">
		<h2 class="text-primary-900 mb-2">Filter By</h2>
		{#if lengthExtent && massExtent && species}
			<div>
				{#if species && species.length > 0}
					<div>
						<h3>Species</h3>
					</div>
					<div class="flex gap-2 flex-wrap">
						{#each species as s}
							<Button
								outline
								on:click={async () => {
									speciesFilter = s;
									await search();
								}}
							>
								{s}
							</Button>
						{/each}
					</div>
				{/if}
			</div>
			<div>
				<h3>Amino Acids Length</h3>
				{#if lengthExtent && lengthFilter}
					<RangerFilter
						min={lengthExtent.min}
						max={lengthExtent.max}
						on:change={async ({ detail }) => {
							lengthFilter = detail;
							await search();
						}}
					/>
				{/if}
			</div>

			<div>
				<h3>Mass (Da)</h3>
				{#if massExtent && massFilter}
					<RangerFilter
						min={massExtent.min}
						max={massExtent.max}
						on:change={async ({ detail }) => {
							massFilter = detail;
							await search();
						}}
					/>
				{/if}
			</div>

			<div class="mt-5">
				<Button on:click={resetFilter}>Reset All Filters</Button>
			</div>
		{:else}
			<DelayedSpinner text="Fetching Properties to Filter By" textRight />
		{/if}
	</div>

	<div id="view">
		<form id="search-bar" on:submit|preventDefault={search}>
			<Search
				size="lg"
				type="text"
				class="flex gap-2 items-center"
				placeholder="Enter search..."
				bind:value={query}
			/>
			<Button type="submit" size="sm">Search</Button>
		</form>
		{#if totalFound > 0}
			<div id="found">
				{totalFound} proteins found
			</div>
		{/if}
		{#if proteinEntries === undefined || proteinEntries.length === 0}
			<DelayedSpinner
				text="Fetching Proteins from the Venome DB..."
				textRight
			/>
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
		padding-top: 15px;
		padding-left: 15px;
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
	h3 {
		margin-bottom: 3px;
		margin-top: 10px;
	}
</style>
