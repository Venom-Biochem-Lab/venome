<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "../lib/backend";
	import type { ProteinEntry } from "../lib/backend";
	import ListProteins from "../lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";
	import RangerFilter from "../lib/RangerFilter.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import InfiniteLoading from "svelte-infinite-loading";
	import type { InfiniteEvent } from "svelte-infinite-loading";

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
	let searchTop: HTMLFormElement;
	let proteinsPerPage = 20; // The number of proteins to show per page
	let page = 0;

	let sortBy = "lengthAsc"; // default sort

	onMount(async () => {
		await search();
		species = await Backend.searchSpecies();
		lengthExtent = await Backend.searchRangeLength();
		massExtent = await Backend.searchRangeMass();
		massFilter = massExtent;
		lengthFilter = lengthExtent;
		console.log(page);
	});

	function infiniteProteinScroll({
		detail: { loaded, complete },
	}: InfiniteEvent) {
		page++;
		Backend.searchProteins({
			query,
			speciesFilter,
			lengthFilter,
			massFilter,
			proteinsPerPage,
			page,
			sortBy,
		}).then((d) => {
			totalFound = d.totalFound;
			if (totalFound === 0) {
				complete();
			} else {
				proteinEntries = proteinEntries.concat(d.proteinEntries); // add on top instead of replacing as we load more
				loaded();
			}
		});
	}

	async function search() {
		const result = await Backend.searchProteins({
			query,
			speciesFilter,
			lengthFilter,
			massFilter,
			proteinsPerPage,
			page,
			sortBy,
		});
		proteinEntries = result.proteinEntries;
		totalFound = result.totalFound;
	}
	async function searchAndResetPage() {
		scrollTop();
		page = 0;
		await search();
	}
	async function resetFilter() {
		scrollTop();
		speciesFilter = undefined;
		lengthFilter = lengthExtent;
		massFilter = massExtent;
		query = "";
		page = 0;
		filterResetCounter++; // Incrementing this so relevant components can be destroyed and re-created
		await search();
	}
	async function resetSort() {
		sortBy = "";
		page = 0;
		await search();
	}

	function scrollTop() {
		searchTop.scrollIntoView({ block: "end" });
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
				<Button
					on:click={async () => {
						await resetFilter();
					}}
					outline
					size="xs"
					color="light">Reset All Filters</Button
				>
			</div>
		{:else}
			<DelayedSpinner text="Fetching Properties to Filter By" textRight />
		{/if}
		
		<br><br>
		<h2 class="text-primary-900 mb-2">Sort by</h2>
		<div>
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="lengthAsc"
					on:change={searchAndResetPage}
				/>
				<span>Length Ascending</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="lengthDesc"
					on:change={searchAndResetPage}
				/>
				<span>Length Descending</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="massAsc"
					on:change={searchAndResetPage}
				/>
				<span>Mass Ascending</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="massDesc"
					on:change={searchAndResetPage}
				/>
				<span>Mass Descending</span>
			</label>
		</div>

		<div class="mt-3">
			<Button
				outline
				size="xs"
				color="light"
				on:click={resetSort}
				>Reset Sort
			</Button>
		</div>
	</div>

	<div id="view">
		<form
			id="search-bar"
			on:submit|preventDefault={searchAndResetPage}
			bind:this={searchTop}
		>
			<div style="width: 500px;">
				<Search
					size="lg"
					type="text"
					class="flex gap-2 items-center"
					bind:value={query}
				></Search>
			</div>
			<div>
				<Button type="submit">Search Proteins</Button>
			</div>
		</form>
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
			{#if totalFound !== 0}
				<InfiniteLoading on:infinite={infiniteProteinScroll} />
			{/if}
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
		gap: 5px;
		padding: 10px;
		align-items: center;
	}

	#found {
		position: absolute;
		top: 25px;
		right: 25px;
		color: var(--primary-700);
	}
	h3 {
		margin-bottom: 3px;
		margin-top: 10px;
	}
</style>
