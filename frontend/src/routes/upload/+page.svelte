<script lang="ts">
	import { Backend, UploadError } from "$lib/backend";
	import {
		Fileupload,
		Button,
		Input,
		Label,
		Helper,
		Select,
	} from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { fileToString } from "$lib/format";
	import ArticleEditor from "$lib/ArticleEditor.svelte";
	import { onMount } from "svelte";

	// format the <Select /> Component Expects {name, value}[]
	let species: string[] | null;
	let selectedSpecies: string = "unknown";
	onMount(async () => {
		species = await Backend.getAllSpecies();
	});

	let name: string = "";
	let content: string = "";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	let refs = "";
	$: file = files ? files[0] : undefined; // we're just concerned with one file
</script>

<section>
	<div class="w-500 flex flex-col gap-5">
		<div>
			<Label
				color={uploadError ? "red" : undefined}
				for="protein-name"
				class="block mb-2">Protein Name *</Label
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

		<!-- Species dropdown (hardcoded, not hooked up to backend for now) -->
		<div class="flex gap-5 mb-2">
			<div>
				<Label for="species-select" class="mb-2">Select a Species</Label>
				{#if species}
					<Select
						id="species-select"
						items={species.map((s) => ({ name: s, value: s }))}
						bind:value={selectedSpecies}
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
			<Label for="file-upload" class="mb-2">Upload a PDB File *</Label>
			<Fileupload id="file-upload" class="w-100" bind:files />
		</div>
		<div>
			<Button
				on:click={async () => {
					if (file === undefined || name === "") return; // no file selected

					const pdbFileStr = await fileToString(file);
					try {
						const err = await Backend.uploadProteinEntry({
							name,
							pdbFileStr,
							content,
							refs,
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
				}}
				disabled={file === undefined || name === ""}
				>Upload and Publish Protein</Button
			>
		</div>
	</div>
</section>
