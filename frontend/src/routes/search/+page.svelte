<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import ListProteins from "$lib/ListProteins.svelte";
	import { page } from "$app/stores";
	import { searchBy } from "$lib/customStores";

	$searchBy = $page.url.searchParams.get("name") ?? "";

	let allEntries: ProteinEntry[] | null = null;
	onMount(async () => {
		// if user provided a name like /search?name=abc, parse it
		if ($searchBy) {
			allEntries = await Backend.searchEntries($searchBy);
		} else {
			allEntries = await Backend.getAllEntries();
		}
	});
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<section>
	<div id="sidebar">Filter By</div>
	<div id="view">
		<ListProteins {allEntries} />
	</div>
</section>

<style>
	section {
		display: flex;
	}
	#sidebar {
		width: 25%;
		border-right: 1px solid #00000010;
		background: #00000005;
	}
	#view {
		width: 75%;
		padding: 5px;
	}
</style>
