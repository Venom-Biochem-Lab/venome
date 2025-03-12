<script lang="ts">
	import {
		screenshotMolstar,
		defaultInitParams,
	} from "../lib/venomeMolstarUtils";
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

	interface PDBFile {
		type: 'af2' | 'af3' | 'experimental';
		file: File | undefined;
	}

	let pdbFiles: PDBFile[] = [
		{ type: 'af2', file: undefined },
		{ type: 'af3', file: undefined },
		{ type: 'experimental', file: undefined }
	];

	let name: string = "";
	let description: string = "";
	let content: string = "";
	let comment: string = "";
	let requestStatus: string = "Pending";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	let refs = "";
	$: file = files ? files[0] : undefined; // we're just concerned with one file

	async function onUpload(userId: number) {
		if (file === undefined || name === "") return; // no file selected

		// Check if AF2 file exists
		const af2File = pdbFiles.find(p => p.type === 'af2')?.file;
			if (!af2File) {
				uploadError = UploadError.AF2_REQUIRED;
				return;
			}

		const pdbFileStr = await fileToString(file);
		try {
			setToken();
			const err = await Backend.uploadProteinEntry({
				name,
				description,
				pdbFileStr,
				content,
				refs,
				speciesName: selectedSpecies,
				userId,
			});
			if (err) {
				uploadError = err;
				console.log(uploadError);
			} else {
				// success, we can also upload the png thumbnail
				const dbProteinNameFormat = formatProteinName(name);
				const b64 = await screenshotMolstar(
					defaultInitParams(dbProteinNameFormat)
				);
				await Backend.uploadProteinPng({
					base64Encoding: b64,
					proteinName: dbProteinNameFormat,
				});

				// then go to its new protein page
				navigate(`/protein/${dbProteinNameFormat}`);
			}
		} catch (e) {
			console.log(e);
			uploadError = UploadError.WRITE_ERROR;
		}
	}

	async function onRequest(userId: number) {
		if (file === undefined || name === "") return; // no file selected

		const pdbFileStr = await fileToString(file);
		try {
			setToken();
			const err = await Backend.requestProteinEntry({
				userId,
				comment,
				status: requestStatus,
				protein: {
					name,
					description,
					pdbFileStr,
					content,
					refs,
					speciesName: selectedSpecies,
				},
			});
			if (err) {
				uploadError = err;
				console.log(uploadError);
			} else {
				// success, we can also upload the png thumbnail
				const dbProteinNameFormat = formatProteinName(name);
				const b64 = await screenshotMolstar(
					defaultInitParams(dbProteinNameFormat)
				);
				await Backend.uploadProteinPng({
					base64Encoding: b64,
					proteinName: dbProteinNameFormat,
				});

				// then go to its new protein page
				navigate(`/protein/${dbProteinNameFormat}`);
			}
		} catch (e) {
			console.log(e);
		}
	}
</script>

<svelte:head>
	{#if $user.admin}
		<title>Venome Upload</title>
	{:else}
		<title>Venome Request</title>
	{/if}
</svelte:head>

<section class="p-5">
	<div class="w-500 flex flex-col gap-5">
		<div>
			<Label
				color={uploadError ? "red" : undefined}
				for="protein-name"
				class="block mb-2"
			>
				Protein Name *
			</Label>
			<Input
				bind:value={name}
				color={uploadError ? "red" : "base"}
				style="width: 300px"
				id="protein-name"
				placeholder="Name"
			/>
			{#if uploadError && uploadError === UploadError.NAME_NOT_UNIQUE}
				<Helper class="mt-2" color="red">
					This name already exists, please create a unique name and resubmit
				</Helper>
			{/if}
		</div>

		<div>
			<Label for="protein-desc" class="block mb-2">Protein Description</Label>
			<Input
				bind:value={description}
				style="width: 600px"
				id="protein-desc"
				placeholder="Description"
			/>
		</div>

		<div class="flex gap-5 mb-2">
			<div>
				<Label for="species-select" class="mb-2">Select a Species</Label>
				{#if species}
					<Select
						id="species-select"
						items={species.map(s => ({ name: s, value: s }))}
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

		{#if !$user.admin}
			<div>
				<Label for="comment" class="block mb-2">Comment</Label>
				<Input
					bind:value={comment}
					style="width: 600px"
					id="comment"
					placeholder="Comment"
				/>
			</div>
		{/if}

		<div>
			{#each pdbFiles as pdbFile}
				<div class="mb-4">
					<Label for={`file-upload-${pdbFile.type}`} class="mb-2">
						Upload {pdbFile.type.toUpperCase()} PDB File {pdbFile.type === 'af2' ? '*' : '(optional)'}
					</Label>
					<Fileupload
						id={`file-upload-${pdbFile.type}`}
						class="w-100"
						on:change={(e) => {
							const files = e.target.files;
							pdbFile.file = files?.[0];
						}}
					/>
				</div>
			{/each}
		</div>

		{#if uploadError}
			<Helper color="red">
				{#if uploadError === UploadError.NAME_NOT_UNIQUE}
					This name already exists, please create a unique name and resubmit
				{:else if uploadError === UploadError.AF2_REQUIRED}
					An AF2 file is required for upload
				{:else if uploadError === UploadError.PARSE_ERROR}
					Failed to parse the uploaded file
				{:else if uploadError === UploadError.WRITE_ERROR}
					Failed to save the protein data
				{:else}
					{uploadError}
				{/if}
			</Helper>
		{/if}

		{#if !$user.admin}
			<div>
				<Button
					on:click={() => onRequest($user.id)}
					disabled={name === "" || !pdbFiles.some(p => p.type === 'af2' && p.file)}
				>
					Request Protein
				</Button>
			</div>
		{:else}
			<div>
				<Button
					on:click={() => onUpload($user.id)}
					disabled={name === "" || !pdbFiles.some(p => p.type === 'af2' && p.file)}
				>
					Upload and Publish Protein
				</Button>
			</div>
		{/if}
	</div>
</section>
