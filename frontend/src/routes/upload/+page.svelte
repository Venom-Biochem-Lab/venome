<script lang="ts">
	import { Backend, UploadError } from "$lib/backend";
	import {
		Fileupload,
		Button,
		Input,
		Label,
		Helper,
		Dropdown,
		DropdownItem,
	} from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { formatProteinName, fileToString } from "$lib/format";
	import { ChevronDownSolid } from "flowbite-svelte-icons";
	import ArticleEditor from "$lib/ArticleEditor.svelte";

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

		<!--Species dropdown (hardcoded, not hooked up to backend for now)-->
		<div>
			<Label for="organism-name" class="blcok mb-2">Organism</Label>
			<Button>Species... <ChevronDownSolid size="xs" class="ml-2" /></Button>
			<Dropdown>
				<DropdownItem>Ganaspis hookeri</DropdownItem>
				<DropdownItem>Leptopilina boulardi</DropdownItem>
				<DropdownItem>Leptopilina heterotoma</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</Dropdown>
		</div>

		<div>
			<ArticleEditor bind:content bind:refs />
		</div>

		<div>
			<Fileupload class="w-100" bind:files />
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
							goto(`/protein/${formatProteinName(name)}`);
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
