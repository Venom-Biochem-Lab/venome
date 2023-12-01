<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";
	import { page } from "$app/stores";
	import { writableUrlParams } from "$lib/format";

	const nameSearch = writableUrlParams($page.url.searchParams, "name");
	let searchBy = $nameSearch;

	let allEntries: ProteinEntry[] | null = null;
	onMount(async () => {
		// if user provided a name like /search?name=abc, parse it
		if (searchBy) {
			allEntries = await Backend.searchEntries(searchBy);
		} else {
			allEntries = await Backend.getAllEntries();
		}
	});
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<section>
	<form
		class="flex gap-2"
		style="width: 500px;"
		on:submit={async () => {
			if (searchBy) {
				allEntries = await Backend.searchEntries(searchBy);
				$nameSearch = searchBy; // update url param
			} else {
				allEntries = await Backend.getAllEntries();
			}
		}}
	>
		<Search
			size="md"
			type="text"
			class="flex gap-2 items-center"
			placeholder="Enter protein name..."
			bind:value={searchBy}
		/>
		<Button type="submit">Search</Button>
	</form>
	<ListProteins {allEntries} />
</section>
