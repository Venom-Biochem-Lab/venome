<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, BACKEND_URL, type ProteinEntry } from "$lib/backend";
	import ProteinVis from "$lib/ProteinVis.svelte";
	import {
		Button,
		Card,
		Dropdown,
		DropdownItem,
		Spinner,
	} from "flowbite-svelte";
	import Markdown from "$lib/Markdown.svelte";
	import { numberWithCommas } from "$lib/format";
	import { goto } from "$app/navigation";
	import References from "$lib/References.svelte";
	import { ChevronDownSolid, PenOutline } from "flowbite-svelte-icons";
	import EntryCard from "$lib/EntryCard.svelte";

	const fileDownloadDropdown = ["pdb", "fasta"];

	export let data; // linked to +page.ts return (aka the id)
	let entry: ProteinEntry | null = null;
	let error = false;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinName, "info from backend");

		entry = await Backend.getProteinEntry(data.proteinName);
		// if we could not find the entry, the id is garbo
		if (entry == null) error = true;

		console.log("Received", entry);
	});
</script>

<section class="flex flex-wrap gap-10">
	{#if entry}
		<div id="left-side">
			<!-- TITLE AND DESCRIPTION -->
			<h1 id="title">
				{entry.name}
			</h1>

			<div id="description">
				DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription
				Description Description Description Description
			</div>

			<EntryCard title="Provided Info">
				<div class="grid grid-cols-2">
					<div>Organism</div>
					<div>
						{entry.speciesName}
					</div>

					<div>Method</div>
					<div>AlphaFold 2</div>
				</div>
			</EntryCard>

			<EntryCard title="Computed Insights">
				<div class="grid grid-cols-2">
					<div>Organism</div>
					<div>
						{entry.speciesName}
					</div>

					<div>Method</div>
					<div>AlphaFold 2</div>

					<div>Length</div>
					<div><code>{entry.length}</code></div>

					<div>Mass (Da)</div>
					<div><code>{numberWithCommas(entry.mass)}</code></div>
				</div>
			</EntryCard>

			<!-- Article / Wiki entry -->
			{#if entry.content}
				<EntryCard title="Article">
					<Markdown text={entry.content} />
				</EntryCard>
			{/if}

			<!-- References -->
			{#if entry.refs}
				<EntryCard title="References">
					<References bibtex={entry.refs} />
				</EntryCard>
			{/if}
		</div>
		<div id="right-side">
			<div class="flex gap-2">
				<Button>Download <ChevronDownSolid size="xs" class="ml-2" /></Button>
				<Dropdown>
					{#each fileDownloadDropdown as fileType}
						<DropdownItem href="{BACKEND_URL}/{fileType}/{entry.name}"
							>{fileType.toUpperCase()}</DropdownItem
						>
					{/each}
				</Dropdown>
				<Button
					on:click={async () => {
						goto(`/edit/${entry?.name}`);
					}}><PenOutline class="mr-2" size="sm" />Edit Entry</Button
				>
			</div>

			<div class="mt-2">
				<ProteinVis
					format="pdb"
					url="http://localhost:8000/pdb/{entry.name}"
					width={750}
				/>
			</div>
		</div>
	{:else if !error}
		<!-- Otherwise, tell user we tell the user we are loading -->
		<h1>Loading Protein Entry <Spinner /></h1>
	{:else if error}
		<!-- if we error out, tell the user the id is shiza -->
		<h1>Error</h1>
		<p>Could not find a protein with the id <code>{data.proteinName}</code></p>
	{/if}
</section>

<style>
	#left-side {
		width: 825px;
	}
	#right-side {
	}
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--darkblue);
	}
	h2 {
		color: var(--darkblue);
	}
</style>
