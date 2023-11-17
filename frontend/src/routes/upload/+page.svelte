<script lang="ts">
	import { Backend, UploadError } from "$lib/backend";
	import { Fileupload, Button, Input, Label } from "flowbite-svelte";

	let name: string = "";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	$: file = files ? files[0] : undefined; // we're just concerned with one file

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
			<Label for="protein-name" class="block mb-2">Protein Name</Label>
			<Input
				bind:value={name}
				style="width: 300px"
				id="protein-name"
				placeholder="Name"
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
						});
						if (err) {
							uploadError = err;
							console.log(uploadError);
						} else {
							console.log("Successfully uploaded!");
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
