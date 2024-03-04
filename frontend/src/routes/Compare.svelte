<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, BACKEND_URL, type ProteinEntry } from "../lib/backend";
	import ProteinVis from "../lib/ProteinVis.svelte";
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import Markdown from "../lib/Markdown.svelte";
	import { numberWithCommas, undoFormatProteinName } from "../lib/format";
	import { navigate } from "svelte-routing";
	import References from "../lib/References.svelte";
	import { ChevronDownSolid, PenOutline } from "flowbite-svelte-icons";
	import EntryCard from "../lib/EntryCard.svelte";
	import SimilarProteins from "../lib/SimilarProteins.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import { user } from "../lib/stores/user";

	const fileDownloadDropdown = ["pdb", "fasta"];

    export let proteinA: string;
    export let proteinB: string;
    let urlId="Gh_comp1045_c0_seq1"
	let entry: ProteinEntry | null = null;
	let error = false;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", proteinA, "and", proteinB, "info from backend");

		entry = await Backend.getProteinEntry(urlId);
		// if we could not find the entry, the id is garbo
		if (entry == null) error = true;
	});
</script>

<svelte:head>
	<title>Venome Protein {entry ? entry.name : ""}</title>
</svelte:head>

<section class="flex gap-10 p-5">
	{#if entry}
		<div id="left-side">
			<!-- TITLE AND DESCRIPTION -->
			<h1 id="title">
				Comparing Proteins
			</h1>

			<div id="description">
				{proteinA} and {proteinB}
			</div>
		</div>
		<div id="right-side" class="flex flex-col">
			<EntryCard title="Provided Information">
				<ProteinVis
					format="pdb"
					proteinName={entry.name}
					width={400}
					height={350}
					on:mount={async ({ detail: { screenshot } }) => {
						// upload the protein thumbnail if it doesn't exist
						if (entry !== null && entry.thumbnail === null) {
							const b64 = await screenshot();
							const res = await Backend.uploadProteinPng({
								proteinName: entry.name,
								base64Encoding: b64,
							});
						}
					}}
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
		<h1><DelayedSpinner text="Loading Protein Entry" /></h1>
	{:else if error}
		<!-- if we error out, tell the user the id is shiza -->
		<h1>Error</h1>
		<p>Could not find a protein with the id <code>{urlId}</code></p>
	{/if}
</section>

<style>
	#left-side {
		width: 100%;
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
