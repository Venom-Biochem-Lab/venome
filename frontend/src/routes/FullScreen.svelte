<script lang="ts">
	import ProteinLinkCard from "../lib/ProteinLinkCard.svelte";
	import { onMount } from "svelte";
	import { Backend, backendUrl, type ProteinEntry } from "../lib/backend";
	import Molstar from "../lib/Molstar.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import { DownloadOutline } from "flowbite-svelte-icons";
	import { Button } from "flowbite-svelte";
	import { colorScheme, type ChainColors } from "../lib/venomeMolstarUtils";
	import LegendpLddt from "../lib/LegendpLDDT.svelte";
	import { navigate } from "svelte-routing";

	export let proteinName: string;
	let entry: ProteinEntry | null = null;
	let error = false;
	const dark2green = colorScheme[0];
	let chainColors: ChainColors = {};

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		entry = await Backend.getProteinEntry(proteinName);
		// if we could not find the entry, the id is garbo
		if (entry == null) error = true;
	});
</script>

<svelte:head>
	<title>Venome Protein {entry ? entry.name : ""}</title>
</svelte:head>

<section class="p-5">
	<div class="flex gap-10">
		{#if entry}
			<div class="flex gap-2 flex-col" style="width: 400px;">
				<div>
					<h1 id="title">Full Screen</h1>
					<p>
						Showing the protein in a larger view. Click on the name
						in green to go back.
					</p>
				</div>
				<ProteinLinkCard {entry} color={dark2green} />

				<div style="width: 300px;" class="mt-3">
					<Button
						color="light"
						outline
						size="xs"
						href={backendUrl(`protein/pdb/${entry?.name}`)}
						>Download .pdb file<DownloadOutline
							size="sm"
							class="ml-2"
						/></Button
					>
				</div>
			</div>
			<div class="z-999 flex flex-col">
				<Molstar
					format="pdb"
					url={backendUrl(`protein/pdb/${entry.name}`)}
					{chainColors}
					width={1000}
					height={900}
				/>
				<LegendpLddt bind:chainColors proteinName={entry.name} />
			</div>
		{:else if !error}
			<!-- Otherwise, tell user we tell the user we are loading -->
			<h1><DelayedSpinner text="Loading Protein Entry" /></h1>
		{:else if error}
			<!-- if we error out, tell the user the id is shiza -->
			<h1>Error</h1>
		{/if}
	</div>
</section>

<style>
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
