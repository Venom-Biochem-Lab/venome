<script lang="ts">
	import { Backend, UploadError, setToken } from "../lib/backend";
	import {
		Fileupload,
		Button,
		Input,
		Label,
		Helper,
		Select,
	} from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { fileToString, formatProteinName } from "../lib/format";
	import ArticleEditor from "../lib/ArticleEditor.svelte";
	import { onMount } from "svelte";
	import Cookies from "js-cookie";
	import { user } from "../lib/stores/user";

	let species: string[] | null;
	let selectedSpecies: string = "unknown";

	const authToken = Cookies.get("auth");
	onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}
		species = await Backend.searchSpecies();
	});

	let name: string = "";
	let description: string = "";
	let content: string = "";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	let refs = "";
	$: file = files ? files[0] : undefined; // we're just concerned with one file
</script>

<svelte:head>
	<title>Venome Upload</title>
</svelte:head>

<section class="p-5">
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
					>This name already exists, please create a unique name and
					resubmit</Helper
				>
			{/if}
		</div>

		<div>
			<Label for="protein-desc" class="block mb-2"
				>Protein Description</Label
			>
			<Input
				bind:value={description}
				style="width: 600px"
				id="protein-desc"
				placeholder="Description"
			/>
		</div>

		<div class="flex gap-5 mb-2">
			<div>
				<Label for="species-select" class="mb-2">Select a Species</Label
				>
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
						setToken()
						const err = await Backend.uploadProteinEntry({
							name,
							description,
							pdbFileStr,
							content,
							refs,
							speciesName: selectedSpecies,
						});
						if (err) {
							uploadError = err;
							console.log(uploadError);
						} else {
							// success, so we can go back!
							// TODO: make the name processing only in the backend and we just send back in the err object above
							navigate(`/protein/${formatProteinName(name)}`);
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
