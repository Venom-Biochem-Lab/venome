<script lang="ts">
	import TMAlignEntry from "../lib/ProteinLinkCard.svelte";

	import { onMount } from "svelte";
	import { Backend, BACKEND_URL, type ProteinEntry } from "../lib/backend";
	import Molstar from "../lib/Molstar.svelte";
	import DelayedSpinner from "../lib/DelayedSpinner.svelte";
	import { DownloadOutline } from "flowbite-svelte-icons";
	import { Button } from "flowbite-svelte";
	import * as d3 from "d3";
	import { undoFormatProteinName } from "../lib/format";

	export let proteinA: string;
	export let proteinB: string;
	let combined = proteinA + "/" + proteinB;
	let entryA: ProteinEntry | null = null;
	let entryB: ProteinEntry | null = null;
	let error = false;

	const dark2green = d3.schemeDark2[0];
	const dark2orange = d3.schemeDark2[1];

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log(
			"Requesting",
			proteinA,
			"and",
			proteinB,
			"info from backend"
		);

		entryA = await Backend.getProteinEntry(proteinA);
		entryB = await Backend.getProteinEntry(proteinB);

		// if we could not find the entry, the id is garbo
		if (entryA == null || entryB == null) error = true;
		console.log(entryA, entryB);
	});
</script>

<svelte:head>
	<title>Venome Protein {entryA ? entryA.name : ""}</title>
</svelte:head>

<section class="p-5">
	<div class="flex gap-10">
		{#if entryA && entryB}
			<div class="flex gap-2 flex-col" style="width: 400px;">
				<div>
					<h1 id="title">Align</h1>
					<p>
						Aligned the following structures with <a
							href="https://zhanggroup.org/TM-align/">TMAlign</a
						>
					</p>
				</div>
				<TMAlignEntry entry={entryA} color={dark2green} />
				<TMAlignEntry entry={entryB} color={dark2orange} />
				<div style="width: 300px;" class="mt-3">
					<Button href="{BACKEND_URL}/protein/pdb/{combined}"
						>Download Aligned PDB File<DownloadOutline
							size="md"
							class="ml-2"
						/></Button
					>
				</div>
			</div>
			<div class="z-999">
				<Molstar
					format="pdb"
					url="{BACKEND_URL}/protein/pdb/{combined}"
					width={1000}
					height={900}
				/>
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
	.hide-ellipses {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
