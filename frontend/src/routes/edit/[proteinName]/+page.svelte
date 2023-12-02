<script lang="ts">
	import { Backend, UploadError, type ProteinEntry } from "$lib/backend";
	import { Button, Input, Label, Helper, Select } from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import ArticleEditor from "$lib/ArticleEditor.svelte";

	// key difference, here we get the information, then populate it in the upload form that can be edited
	// and reuploaded/edited
	export let data;

	// store original too so we can see if the user changed/edited the content
	let name: string;
	let ogName: string;
	let ogContent: string;
	let content: string;
	let ogRefs: string;
	let refs: string;
	let ogSpecies: string;
	let species: string;

	let uploadError: UploadError | undefined;
	let entry: ProteinEntry | null = null;
	let error = false;
	let allSpecies: string[] | null;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		// Request the protein from backend given ID
		console.log("Requesting", data.proteinName, "info from backend");

		entry = await Backend.getProteinEntry(data.proteinName);
		// if we could not find the entry, the id is garbo
		if (entry == null) {
			error = true;
		} else {
			name = entry.name;
			ogName = name;

			content = entry.content ?? "";
			ogContent = content; // log original content

			refs = entry.refs ?? "";
			ogRefs = refs; // log original refs

			species = entry.speciesName;
			ogSpecies = species;
		}

		allSpecies = await Backend.getAllSpecies();
	});
	$: changed =
		name !== ogName ||
		content !== ogContent ||
		refs !== ogRefs ||
		species !== ogSpecies;
</script>

<section>
	{#if entry}
		<div class="w-500 flex flex-col gap-5">
			<div>
				<Label
					color={uploadError ? "red" : undefined}
					for="protein-name"
					class="block mb-2">Protein Name</Label
				>
				<Input
					bind:value={name}
					color={uploadError ? "red" : "base"}
					style="width: 300px"
					id="protein-name"
					placeholder="Name"
				/>
				{#if uploadError && uploadError === UploadError.NAME_NOT_UNIQUE}
					<Helper class="mt-2" color="red"
						>This name already exists, please create a unique name and resubmit</Helper
					>
				{/if}
			</div>

			<div class="flex gap-5 mb-2">
				<div>
					<Label for="species-select" class="mb-2">Select a Species</Label>
					{#if allSpecies}
						<Select
							id="species-select"
							items={allSpecies.map((s) => ({ name: s, value: s }))}
							bind:value={species}
						/>
					{:else}
						<Helper color="red">Error loading species</Helper>
					{/if}
				</div>
			</div>

			<div>
				<ArticleEditor bind:content bind:refs />
			</div>
			<div>
				<Button
					on:click={async () => {
						if (entry) {
							try {
								const err = await Backend.editProteinEntry({
									newName: name,
									oldName: entry.name,
									newSpeciesName: species,
									oldSpeciesName: ogSpecies,
									newContent: content !== ogContent ? content : undefined,
									newRefs: refs !== ogRefs ? refs : undefined,
								});
								if (err) {
									uploadError = err;
									console.log(uploadError);
								} else {
									// success, so we can go back!
									goto(`/protein/${name}`);
								}
							} catch (e) {
								console.log(e);
							}
						}
					}}
					disabled={!changed || name.length === 0}>Edit Protein</Button
				>

				<Button outline on:click={() => goto(`/protein/${name}`)}>Cancel</Button
				>
			</div>
			<div>
				<Button
					color="red"
					on:click={async () => {
						await Backend.deleteProteinEntry(data.proteinName);
						goto("/");
					}}>Delete Protein Entry</Button
				>
			</div>
		</div>
	{/if}
</section>
