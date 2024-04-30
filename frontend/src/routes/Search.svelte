<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "../lib/backend";
	import type { ProteinEntry } from "../lib/backend";
	import ListProteins from "../lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";
	import RangerFilter from "../lib/RangerFilter.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import app from "../main";
	import { navigate } from "svelte-routing";

	let query = "";
	let proteinEntries: ProteinEntry[];
	let totalFound = 0;
	let species: string[] | null = [];
	let speciesFilter: string | undefined;
	let lengthFilter: { min: number; max: number } | undefined;
	let lengthExtent: { min: number; max: number };
	let massFilter: { min: number; max: number } | undefined;
	let massExtent: { min: number; max: number };
	let filterResetCounter = 0;

	let proteinsPerPage = 20; // The number of proteins to show per page
	let page = 0;
	onMount(async () => {
		await search();
		species = await Backend.searchSpecies();
		lengthExtent = await Backend.searchRangeLength();
		massExtent = await Backend.searchRangeMass();
		massFilter = massExtent;
		lengthFilter = lengthExtent;
		console.log(page);
	});

	async function search() {
		const result = await Backend.searchProteins({
			query,
			speciesFilter,
			lengthFilter,
			massFilter,
			proteinsPerPage,
			page,
		});
		proteinEntries = result.proteinEntries;
		totalFound = result.totalFound;
	}
	async function searchAndResetPage() {
		page = 0;
		await search();
	}
	async function resetFilter() {
		speciesFilter = undefined;
		lengthFilter = lengthExtent;
		massFilter = massExtent;
		query = "";
		page = 0;
		filterResetCounter++; // Incrementing this so relevant components can be destroyed and re-created
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
									await searchAndResetPage();
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
					{#key filterResetCounter}
						<RangerFilter
							min={lengthExtent.min}
							max={lengthExtent.max}
							on:change={async ({ detail }) => {
								lengthFilter = detail;
								await searchAndResetPage();
							}}
						/>
					{/key}
				{/if}
			</div>

			<div>
				<h3>Mass (Da)</h3>
				{#if massExtent && massFilter}
					{#key filterResetCounter}
						<RangerFilter
							min={massExtent.min}
							max={massExtent.max}
							on:change={async ({ detail }) => {
								massFilter = detail;
								await searchAndResetPage();
							}}
						/>
					{/key}
				{/if}
			</div>

			<div class="mt-5">
				<Button on:click={resetFilter} outline size="xs" color="light"
					>Reset All Filters</Button
				>
			</div>
		{:else}
			<DelayedSpinner text="Fetching Properties to Filter By" textRight />
		{/if}
	</div>

	<div id="view">
		<form id="search-bar" on:submit|preventDefault={searchAndResetPage}>
			<Search
				size="lg"
				type="text"
				class="flex gap-2 items-center"
				placeholder="Enter search..."
				bind:value={query}
			/>
			<Button type="submit" size="sm">Search</Button>
		</form>
		{#if totalFound > 0 || page > 0}
			<div id="found">
				{#if totalFound == 1}
					{totalFound} protein shown |
				{:else}
					{totalFound} proteins shown |
				{/if}
				<Button
					disabled={page <= 0}
					on:click={async () => {
						page--;
						await search();
					}}>Previous {proteinsPerPage}</Button
				> |
				<Button
					disabled={totalFound < proteinsPerPage}
					on:click={async () => {
						page++;
						await search();
					}}>Next {proteinsPerPage}</Button
				>
			</div>
		{/if}
		{#if proteinEntries === undefined}
			<DelayedSpinner
				text="Fetching Proteins from the Venome DB..."
				textRight
			/>
		{:else if proteinEntries.length === 0}
			{#if page > 0}
				No more proteins found
			{:else}
				No proteins found
			{/if}
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
		color: var(--primary-500);
	}
	h3 {
		margin-bottom: 3px;
		margin-top: 10px;
	}
</style>
