<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "$lib/backend";
	import ProteinVis from "$lib/ProteinVis.svelte";
	import { Button, Card, Spinner } from "flowbite-svelte";
	import Markdown from "$lib/Markdown.svelte";
	import { Heading, P, Span } from "flowbite-svelte";

	export let data; // linked to +page.ts return (aka the id)
	let entry: ProteinEntry | null = null;
	let error = false;
	// todo: request this from the user
	let wikiEntry: string = `
# H1

## H2

### H3

#### H4

**Bolded** versus _italic_
and ~~strike through~~ and [links](/)

You can write stuff down here about the proteins.

Todo: add ways to cite papers here that automatically show up in references.`;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinName, "info from backend");

		entry = await Backend.getProteinEntry(data.proteinName);
		// if we could not find the entry, the id is garbo
		if (entry == null) error = true;

		console.log("Received", entry);
	});

	/**
	 * @todo there should be a better way to do this since we might change host and port when deployed
	 */
	function pdbFileURL(name: string) {
		return `http://localhost:8000/data/pdbAlphaFold/${name}.pdb`;
	}
</script>

<section class="flex flex-wrap gap-10">
	{#if entry}
		<div id="left-side">
			<!-- TITLE AND DESCRIPTION -->
			<Heading tag="h1">
				<Span
					underline
					decorationClass="decoration-8 decoration-primary-400 dark:decoration-primary-600"
					>{entry.name.replaceAll("_", " ")}</Span
				>
			</Heading>
			<P class="mt-4 text-lg">description of the protein here (optional)</P>

			<Card title="Info" class="max-w-full mt-5">
				<Heading tag="h4">Information</Heading>

				<div class="grid grid-cols-2">
					<div>Source Organism</div>
					<div>Unknown</div>

					<div>Biological Function</div>
					<div>Unknown</div>

					<div>Structure From</div>
					<div>AlphaFold</div>

					<div>Amino Acids Length</div>
					<div>{entry.length}</div>

					<div>Total Mass</div>
					<div>{entry.mass}</div>
				</div>
			</Card>

			<!-- Article / Wiki entry -->
			<Card title="Info" class="max-w-full mt-5">
				<Heading tag="h4">Article</Heading>
				<Markdown text={wikiEntry} />
			</Card>
		</div>
		<div id="right-side">
			<Button href={pdbFileURL(entry.name)}>Download .pdb file</Button>
			<div class="mt-2">
				<ProteinVis format="pdb" url={pdbFileURL(entry.name)} width={750} />
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
		min-width: 100ch;
	}
	#right-side {
	}
</style>
