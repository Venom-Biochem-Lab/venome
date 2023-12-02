<script lang="ts">
	import { goto } from "$app/navigation";
	import type { ProteinEntry } from "$lib/backend";
	import { numberWithCommas } from "$lib/format";
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { Tabs, TabItem } from "flowbite-svelte";
	import { Card } from "flowbite-svelte";

	export let allEntries: ProteinEntry[] | null = null;
</script>

<Tabs style="underline" contentClass="bg-none p-5">
	<TabItem open title="Table">
		<Table>
			<TableHead>
				<TableHeadCell>Protein name</TableHeadCell>
				<TableHeadCell>Organism</TableHeadCell>
				<TableHeadCell>Length</TableHeadCell>
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
							<TableBodyCell
								><span class="text-primary-700">{entry.name}</span
								></TableBodyCell
							>
							<TableBodyCell>{entry.speciesName}</TableBodyCell>
							<TableBodyCell>{entry.length}</TableBodyCell>
							<TableBodyCell>{numberWithCommas(entry.mass)}</TableBodyCell>
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
					<Card
						class="hover:shadow-lg cursor-pointer"
						title="Click to see {entry.name}"
						on:click={() => goto(`/protein/${entry.name}`)}
					>
						<div class="name text-primary-700">
							{entry.name}
						</div>
						<div class="description">
							Length: {entry.length}, Mass (Da): {numberWithCommas(entry.mass)}
						</div>
					</Card>
				{/each}
			{/if}
		</div>
	</TabItem>
</Tabs>

<style>
	.entries {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.name {
		font-size: 1.5em;
	}
</style>
