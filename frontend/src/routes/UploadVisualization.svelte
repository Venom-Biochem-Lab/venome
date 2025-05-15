<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, UploadError, setToken, backendUrl } from "../lib/backend";
	import { Fileupload, Button, Input, Label, Helper } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { fileToString } from "../lib/format";
	import { user } from "../lib/stores/user";
	import { debounce } from "lodash";
	import { OpenAPI } from "../lib/openapi";

	let proteinName = "";
	let af3File: File | undefined;
	let uploadError: UploadError | undefined;
	let proteinSuggestions: string[] = [];
	let isUploading = false;

	// Debounced function to fetch protein suggestions
	const fetchProteinSuggestions = debounce(async (query: string) => {
		if (query.length > 0) {
			proteinSuggestions = await Backend.searchProteinNames(query);
		} else {
			proteinSuggestions = [];
		}
	}, 300);

	// Trigger fetching suggestions when the input changes
	$: fetchProteinSuggestions(proteinName);

	onMount(() => {
		if (!$user.loggedIn || !$user.admin) {
			alert("You are not authorized to access this page.");
			navigate("/");
		}
		console.log("UploadVisualization component mounted");
	});

	async function onUploadVisualization() {
		if (!af3File || !proteinName) {
			uploadError = UploadError.PARSE_ERROR;
			return;
		}

		isUploading = true;
		uploadError = undefined;

		try {
			// Create form data
			const formData = new FormData();
			formData.append("protein_name", proteinName); //get protein name from search bar to make sure its correct
			formData.append("file", af3File);

			// Set auth token for the request
			setToken();

			// Send request to backend
			const response = await fetch(
				`${backendUrl("protein/upload/af3")}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${OpenAPI.TOKEN}`,
					},
					body: formData,
				},
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				//handels backend failures, and when protein name isnt found
				uploadError =
					typeof errorResponse === "string"
						? errorResponse
						: errorResponse.detail || UploadError.WRITE_ERROR;
			} else {
				//worked fine
				alert("Visualization uploaded successfully!");
				proteinName = "";
				af3File = undefined;
				proteinSuggestions = [];
			}
		} catch (error) {
			console.error("Upload error:", error);
			uploadError = UploadError.WRITE_ERROR;
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Venome Upload Visualization</title>
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
				bind:value={proteinName}
				color={uploadError ? "red" : "base"}
				style="width: 300px"
				id="protein-name"
				placeholder="Enter protein name"
			/>
			{#if proteinSuggestions.length > 0}
				<div class="relative">
					<ul
						class="absolute w-full bg-white border border-gray-300 rounded mt-2 max-h-60 overflow-y-auto z-10"
					>
						{#each proteinSuggestions as suggestion}
							<li
								class="p-2 hover:bg-gray-100 cursor-pointer"
								on:click={() => (proteinName = suggestion)}
							>
								{suggestion}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<div>
			<Label
				for="af3-file"
				class="block mb-2"
				color={uploadError && uploadError === UploadError.PARSE_ERROR
					? "red"
					: undefined}
			>
				Upload .cif AF3 File
			</Label>
			<Fileupload
				id="af3-file"
				class="w-100"
				on:change={(e) => {
					const files = e.target.files;
					af3File = files?.[0];
				}}
			/>
		</div>

		{#if uploadError}
			<Helper color="red">
				{#if uploadError === UploadError.NAME_NOT_UNIQUE}
					Protein name not found, please search and select using the
					dropdown. *Needs to have an AF2 .pdb upload before adding
					AF3 visualization.
				{:else if uploadError === UploadError.AF3_ALREADY_EXISTS}
					There is already another AF3 upload for this protein. To
					delete it, go to the protein page edit it as an admin.
				{:else if uploadError === UploadError.WRITE_ERROR}
					Failed to save the visualization file.
				{:else if uploadError === UploadError.PARSE_ERROR}
					Please select a valid protein name and AF3 file.
				{:else}
					{uploadError}
				{/if}
			</Helper>
		{/if}

		<div>
			<Button
				on:click={onUploadVisualization}
				disabled={!proteinName || !af3File || isUploading}
				color="blue"
			>
				{isUploading ? "Uploading..." : "Upload Visualization"}
			</Button>
		</div>
	</div>
</section>
