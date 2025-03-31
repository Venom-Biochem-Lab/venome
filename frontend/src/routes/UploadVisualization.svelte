<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, UploadError, setToken } from "../lib/backend";
	import { Fileupload, Button, Input, Label, Helper } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { fileToString } from "../lib/format";
	import { user } from "../lib/stores/user";
	import { debounce } from "lodash";

	let proteinName = "";
	let af3File: File | undefined;
	let uploadError: UploadError | undefined;
	let proteinSuggestions: string[] = [];

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
		if (!$user.admin) {
			alert("You are not authorized to access this page.");
			navigate("/");
		}
        console.log("UploadVisualization component mounted");
	});

	async function onUploadVisualization() {
		if (!proteinName || !af3File) {
            uploadError = !proteinName ? UploadError.NAME_NOT_UNIQUE : UploadError.AF2_REQUIRED;
            console.log("Validation failed:", uploadError);
            return;
        }

		try {
			const af3FileStr = await fileToString(af3File);
			setToken();
			const err = await Backend.uploadAf3File(proteinName, af3FileStr);
			if (err) {
				uploadError = err;
			} else {
				alert("Visualization uploaded successfully!");
				navigate("/");
			}
		} catch (e) {
			console.log(e);
			uploadError = UploadError.WRITE_ERROR;
		}
	}
</script>

<section class="p-5">
	<div class="w-500 flex flex-col gap-5">
		<div>
			<Label for="protein-name" class="block mb-2">Protein Name *</Label>
			<Input
				bind:value={proteinName}
				id="protein-name"
				placeholder="Enter protein name"
				/>
			{#if proteinSuggestions.length > 0}
				<ul class="bg-white border border-gray-300 rounded mt-2">
					{#each proteinSuggestions as suggestion}
						<li
							class="p-2 hover:bg-gray-100 cursor-pointer"
							on:click={() => (proteinName = suggestion)}
						>
							{suggestion}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div>
			<Label for="af3-file" class="block mb-2">Upload AF3 File *</Label>
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
					Protein name not found or already has a visualization.
				{:else if uploadError === UploadError.WRITE_ERROR}
					Failed to save the visualization file.
				{:else}
					{uploadError}
				{/if}
			</Helper>
		{/if}

		<div>
			<Button on:click={onUploadVisualization} disabled={!proteinName || !af3File}>
				Upload Visualization
			</Button>
		</div>
	</div>
</section>
