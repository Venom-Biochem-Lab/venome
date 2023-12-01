<script lang="ts">
	import { Backend, UploadError } from "$lib/backend";
	import {
		Fileupload,
		Button,
		Input,
		Label,
		Helper,
		Textarea,
		Dropdown,
		DropdownItem,
	} from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { formatProteinName } from "$lib/format";
	import { ChevronDownSolid } from 'flowbite-svelte-icons';

	let name: string = "";
	let content: string = "";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	$: file = files ? files[0] : undefined; // we're just concerned with one file
	$: console.log(content);

	function fileToBase64(f: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(f);
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = reject;
		});
	}
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
			<Button>Species... <ChevronDownSolid/></Button>
			<Dropdown>
				<DropdownItem>Ganaspis hookeri</DropdownItem>
				<DropdownItem>Leptopilina boulardi</DropdownItem>
				<DropdownItem>Leptopilina heterotoma</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</Dropdown>
		</div>

		<div>
			<Label for="content" class="block mb-2">Protein Article</Label>
			<Textarea
				id="content"
				placeholder="Enter markdown..."
				rows={10}
				bind:value={content}
			/>
		</div>
		<div>
			<Fileupload class="w-100" bind:files />
		</div>
		<div>
			<Button
				on:click={async () => {
					if (file === undefined || name === "") return; // no file selected

					const base64Encoding = await fileToBase64(file);
					try {
						const err = await Backend.uploadProteinEntry({
							name,
							pdbFileBase64: base64Encoding,
							content,
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
