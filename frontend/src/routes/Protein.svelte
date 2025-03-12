<script lang="ts">
	import { onMount } from "svelte";
	import {
		Backend,
		backendUrl,
		RequestStatus,
		type ProteinEntry,
	} from "../lib/backend";
	import Molstar from "../lib/Molstar.svelte";
	import { Button } from "flowbite-svelte";
	import Markdown from "../lib/Markdown.svelte";
	import {
		numberWithCommas,
		undoFormatProteinName,
		dbDateToMonthDayYear,
	} from "../lib/format";
	import { navigate } from "svelte-routing";
	import References from "../lib/References.svelte";
	import {
		EditOutline,
		DownloadOutline,
		ExpandOutline,
	} from "flowbite-svelte-icons";
	import EntryCard from "../lib/EntryCard.svelte";
	import SimilarProteins from "../lib/SimilarProteins.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import { user } from "../lib/stores/user";
	import { AccordionItem, Accordion } from "flowbite-svelte";
	import type { ChainColors } from "../lib/venomeMolstarUtils";
	import LegendpLddt from "../lib/LegendpLDDT.svelte";

	export let urlId: string;
	let urlId2: string;
	let entry: ProteinEntry | null = null;
	let contributor = "";
	let status: RequestStatus = RequestStatus.PENDING;
	let entry2: ProteinEntry | null = null;
	let error = false;
	let chainColors: ChainColors = {};
	let searchOpen = false;
	let currentEntry: ProteinEntry | null = null;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", urlId, "info from backend");
		urlId2 = 'Gh_comp10207_c0_seq2';
		console.log("urlid2", urlId2)

		entry = await Backend.getProteinEntry(urlId);
		// if we could not find the entry, the id is garbo
		currentEntry = entry;

		console.log(entry)

		//making a copy for testing the toggle
		//entry2 = { ...entry };
		entry2 = await Backend.getProteinEntry(urlId2);
		console.log(entry2)
		if (entry == null || entry2 == null) error = true;

		contributor = (await Backend.getProteinEntryUser(urlId)).username;

		status = await Backend.getProteinStatus(urlId);

		console.log("Error:", error)
	});

	//to switch the visualization between alphafold2 and alphafold3
	function toggleProtein() {
		currentEntry = currentEntry === entry ? entry2 : entry;
	}

</script>

<svelte:head>
	<title>Venome Protein {entry ? entry.name : ""}</title>
</svelte:head>

<section class="flex gap-10 p-5">
	{#if currentEntry}
		<div id="left-side">
			<!-- TITLE AND DESCRIPTION -->
			<h1 id="title">
				{undoFormatProteinName(entry.name)}
				{#if $user.loggedIn}
					<Button
						color="light"
						outline
						size="xs"
						on:click={async () => {
							navigate(`/protein/edit/${entry?.name}`);
						}}
					>
						<EditOutline class="mr-1" size="sm" />Edit Protein Entry
					</Button>
				{/if}
			</h1>

			<div id="description">
				{#if entry.description}
					{entry.description}
				{/if}
			</div>

			<EntryCard title="Computed Insights">
				<div class="grid grid-cols-2">
					<b>Length</b>
					<div><code>{currentEntry.length}</code></div>

					<b>Mass (Da)</b>
					<div><code>{numberWithCommas(currentEntry.mass)}</code></div>

					<b>Atoms</b>
					<div><code>{numberWithCommas(currentEntry.atoms)}</code></div>
				</div>
				<div class="mt-3">
					<Accordion>
						<AccordionItem bind:open={searchOpen}>
							<span slot="header" style="font-size: 18px;">
								3D Similar Proteins <span
									style="font-weight: 300; font-size: 15px;"
								>
									(click to compute with Foldseek)
								</span>
							</span>
							{#if searchOpen}
								<SimilarProteins
									queryProteinName={currentEntry.name}
									length={currentEntry.length}
								/>
							{/if}
						</AccordionItem>
					</Accordion>
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
			<div style="position: sticky; top: 55px; right: 0; z-index: 999;">
				<EntryCard title="Information">
					<div
						id="info-grid"
						class="grid grid-cols-2 mb-2"
						style="width: 220px; gap: 10px;"
					>
						<b>Organism</b>
						<div>
							{entry.speciesName}
						</div>
						<b>Contributor</b>
						<div>
							{contributor}
						</div>
						<b>Status</b>
						<div>
							{status}
						</div>
						<b>Method</b>
						<div>
							{currentEntry === entry ? "AlphaFold 2" : "AlphaFold 3"}
						</div>
						<b>Date Published</b>
						<div>
							<code
								>{currentEntry.datePublished
									? dbDateToMonthDayYear(currentEntry.datePublished)
									: "n/a"}</code
							>
						</div>
					</div>
					<div style="width: 100%;" class="mb-2 flex justify-between">
						<Button
							size="xs"
							color="light"
							outline
							on:click={() => navigate(`/fullscreen/${currentEntry?.name}`)}
						>
							Fullscreen <ExpandOutline class="ml-1" size="sm" />
						</Button>
						<Button
							outline
							size="xs"
							color="light"
							href={backendUrl(`protein/pdb/${currentEntry?.name}`)}
						>
							Download .pdb file<DownloadOutline size="sm" class="ml-1" />
						</Button>
					</div>
					<Molstar
						format="pdb"
						url={backendUrl(`protein/pdb/${currentEntry.name}`)}
						width={400}
						height={350}
						{chainColors}
						hideCanvasControls={[
							"animation",
							"controlInfo",
							"expand",
							"selection",
							"controlToggle",
						]}
					/>

					<LegendpLddt bind:chainColors proteinName={currentEntry.name} />
				</EntryCard>
			</div>
		</div>
	{:else if !error}
		<!-- Otherwise, tell user we tell the user we are loading -->
		<h1><DelayedSpinner text="Loading Protein Entry" /></h1>
	{:else if error}
		<!-- if we error out, tell the user the id is shiza -->
		<h1>Error</h1>
		<p>
			Could not find a protein with the id <code>{urlId}</code>
		</p>
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
		color: var(--primary-700);
	}
	.legend-chip {
		--color: black;
		color: white;
		background-color: var(--color);
		border-radius: 3px;
		font-size: 12px;

		padding-left: 5px;
		padding-right: 5px;
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>
