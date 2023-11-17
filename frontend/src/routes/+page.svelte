<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Backend } from "$lib/backend";
	import type { ProteinEntry } from "$lib/backend";
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { Tabs, TabItem } from "flowbite-svelte";

	// at some point, this should be change to request from the backend
	let allEntries: ProteinEntry[] | null = null;
	onMount(async () => {
		// calls get_all_entries() from backend
		// to generate this Backend object run `./run.sh gen_api` for newly created server functions
		allEntries = await Backend.getAllEntries();
		console.log(allEntries);
	});
</script>

<!-- akin to <head /> in html -->
<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<Tabs style="underline" contentClass="bg-none p-5">
		<TabItem open title="Table">
			<Table>
				<TableHead>
					<TableHeadCell>Protein name</TableHeadCell>
					<TableHeadCell>Amino Acids</TableHeadCell>
					<TableHeadCell>Mass (Da)</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#if allEntries}
						{#each allEntries as entry}
							<TableBodyRow
								class="cursor-pointer hover:bg-gray-100"
								on:click={() => {
									goto(`/protein/${entry.name}`);
								}}
							>
								<TableBodyCell>{entry.name.replaceAll("_", " ")}</TableBodyCell>
								<TableBodyCell>{entry.length}</TableBodyCell>
								<TableBodyCell>{entry.mass}</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</TabItem>
		<TabItem title="Gallery">
			<div class="entries">
				{#if allEntries}
					{#each allEntries as entry}
						<div
							class="entry"
							title="Click to see {entry.name}"
							on:click={() => goto(`/protein/${entry.name}`)}
							role="link"
						>
							<div class="name">
								{entry.name}
							</div>
							<div class="description">
								Seq Len: {entry.length}, Mass: {entry.mass}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</TabItem>
	</Tabs>
</section>

<style>
	.entries {
		display: flex;
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
