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
	import SimilarProteins from "$lib/SimilarProteins.svelte";

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

<section class="flex gap-10 p-5">
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

			<EntryCard title="Computed Insights">
				<div class="grid grid-cols-2">
					<b>Length</b>
					<div><code>{entry.length}</code></div>

					<b>Mass (Da)</b>
					<div><code>{numberWithCommas(entry.mass)}</code></div>
				</div>
				<div>
					<b>Structurally Similar Proteins</b>
					<SimilarProteins queryProteinName={entry.name} />
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
		<div id="right-side" class="flex flex-col">
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

			<EntryCard title="Provided Information">
				<ProteinVis
					format="pdb"
					url="http://localhost:8000/pdb/{entry.name}"
					width={400}
					height={350}
				/>
				<div id="info-grid" class="grid grid-cols-2 mt-5">
					<b>Organism</b>
					<div>
						{entry.speciesName}
					</div>
					<b>Method</b>
					<div>AlphaFold 2</div>
					<b>Date Published</b>
					<div><code>11/11/1111</code></div>
				</div>
			</EntryCard>
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
		/* width: 1200px; */
	}
	#right-side {
		width: 450px;
	}
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--darkblue);
	}
</style>
