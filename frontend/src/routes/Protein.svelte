<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, backendUrl, type ProteinEntry } from "../lib/backend";
	import Molstar from "../lib/Molstar.svelte";
	import { Button } from "flowbite-svelte";
	import Markdown from "../lib/Markdown.svelte";
	import {
		numberWithCommas,
		undoFormatProteinName,
		dbDateToMonthDayYear,
	} from "../lib/format";
	import { navigate } from "svelte-routing";  // Correct import
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
	import LegendpLddt from "../lib/LegendpLddt.svelte";

	export let urlId; //  Receive protein name as a prop
	let entry: ProteinEntry | null = null;
	let error = false;
	let chainColors: ChainColors = {};
	let searchOpen = false;

	onMount(async () => {
		if (urlId) { // Important: Only fetch if urlId is defined
			try {
				entry = await Backend.getProteinEntry(urlId);
				if (!entry) {
					error = true; // Set error state if no protein found
				}
			} catch (err) {
				error = true;
				console.error("Error fetching protein:", err); // Log the error
			}
		}
	});
</script>

<svelte:head>
	<title>Venome Protein {entry ? entry.name : ""}</title>
</svelte:head>

<section class="flex gap-10 p-5">
	{#if entry}
		<div id="left-side">
			<h1 id="title">
				{undoFormatProteinName(entry.name)}
				{#if $user.loggedIn}
					<Button
						color="light"
						outline
						size="xs"
						on:click={() => {
							navigate(`/protein/edit/${entry?.name}`);
						}}
						><EditOutline class="mr-1" size="sm" />Edit Protein
						Entry</Button
					>
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
					<div><code>{entry.length}</code></div>

					<b>Mass (Da)</b>
					<div><code>{numberWithCommas(entry.mass)}</code></div>
				</div>
				<div class="mt-3">
					<Accordion>
						<AccordionItem bind:open={searchOpen}>
							<span slot="header" style="font-size: 18px;"
								>3D Similar Proteins <span
									style="font-weight: 300; font-size: 15px;"
									>(click to compute with Foldseek)</span
								></span
							>
							{#if searchOpen}
								<SimilarProteins
									queryProteinName={entry.name}
									length={entry.length}
								/>
							{/if}
						</AccordionItem>
					</Accordion>
				</div>
			</EntryCard>

			{#if entry.content}
				<EntryCard title="Article">
					<Markdown text={entry.content} />
				</EntryCard>
			{/if}

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
						style="width: 400px;"
					>
						<b>Organism</b>
						<div>
							{entry.speciesName}
						</div>
						<b>Method</b>
						<div>AlphaFold 2</div>
						<b>Date Published</b>
						<div>
							<code
								>{entry.datePublished
									? dbDateToMonthDayYear(entry.datePublished)
									: "n/a"}</code
							>
						</div>
					</div>
					<div style="width: 100%;" class="mb-2 flex justify-between">
						<Button
							size="xs"
							color="light"
							outline
							on:click={() =>
								navigate(`/fullscreen/${entry?.name}`)}
							>Fullscreen <ExpandOutline
								class="ml-1"
								size="sm"
							/></Button
						>
						<Button
							outline
							size="xs"
							color="light"
							href={backendUrl(`protein/pdb/${entry?.name}`)}
							>Download .pdb file<DownloadOutline
								size="sm"
								class="ml-1"
							/></Button
						>
					</div>
					<Molstar
						format="pdb"
						url={backendUrl(`protein/pdb/${entry.name}`)}
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

					<LegendpLddt bind:chainColors proteinName={entry.name} />
				</EntryCard>
			</div>
		</div>
	{:else if !error}
		<h1><DelayedSpinner text="Loading Protein Entry" /></h1>
	{:else}
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