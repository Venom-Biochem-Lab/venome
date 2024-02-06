<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";

	let textSearch = "";

	let proteins: ProteinEntry[] | null = null;
	onMount(async () => {
		// if user provided a name like /search?name=abc, parse it
		if (textSearch) {
			proteins = await Backend.searchEntries(textSearch);
		} else {
			proteins = await Backend.getAllEntries();
		}
	});
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<section>
	<div id="sidebar">Filter By</div>
	<div id="view">
		{#if proteins === null || proteins.length === 0}
			No proteins Found
		{:else}
			<form
				id="search-bar"
				on:submit={async () => {
					if (textSearch) {
						proteins = await Backend.searchEntries(textSearch);
					} else {
						proteins = await Backend.getAllEntries();
					}
				}}
			>
				<Search
					size="lg"
					type="text"
					class="flex gap-2 items-center"
					placeholder="Enter search..."
					bind:value={textSearch}
				/>
				<Button type="submit" size="sm">Search</Button>
			</form>
			<ListProteins allEntries={proteins} />
		{/if}
	</div>
</section>

<style>
	section {
		display: flex;
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
</style>
