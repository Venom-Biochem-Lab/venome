<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";
	import { Search, Button } from "flowbite-svelte";
	import { page } from "$app/stores";

	let searchBy = "";

	let allEntries: ProteinEntry[] | null = null;
	onMount(async () => {
		// if user provided a name like /search?name=abc, parse it
		const name = $page.url.searchParams.get("name");
		if (name) {
			searchBy = name;
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
			} else {
				allEntries = await Backend.getAllEntries();
			}
			$page.url.searchParams.set("name", searchBy); // update url
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
