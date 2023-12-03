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
	import { Heading, Span } from "flowbite-svelte";
	import { numberWithCommas } from "$lib/format";
	import { goto } from "$app/navigation";
	import References from "$lib/References.svelte";
	import { ChevronDownSolid, PenOutline } from "flowbite-svelte-icons";

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
			<Heading tag="h1">
				<Span
					underline
					decorationClass="decoration-8 decoration-primary-400 dark:decoration-primary-600"
					>{entry.name}</Span
				>
			</Heading>

			<Card title="Info" class="max-w-full mt-5">
				<Heading tag="h4">Information</Heading>

				<div class="grid grid-cols-2">
					<div>Source Organism</div>
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
			</Card>

			<!-- Article / Wiki entry -->
			{#if entry.content}
				<Card title="Info" class="max-w-full mt-5">
					<Heading tag="h4">Article</Heading>
					<Markdown text={entry.content} />
				</Card>
			{/if}

			<!-- References -->
			{#if entry.refs}
				<Card title="References" class="max-w-full mt-5 overflow-wrap">
					<Heading tag="h4">References</Heading>
					<References bibtex={entry.refs} />
				</Card>
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
</style>
