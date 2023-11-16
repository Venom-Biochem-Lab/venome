<script lang="ts">
	import { Backend } from "$lib/backend";
	import { Fileupload, Button } from "flowbite-svelte";

	let files: FileList | undefined; // bind:files on the Fileupload
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

<div>Upload Page</div>
<Fileupload bind:files />
<Button
	on:click={async () => {
		if (file === undefined) return; // no file selected

		const base64Encoding = await fileToBase64(file);
		try {
			await Backend.uploadProteinEntry({
				pdbFileBase64: base64Encoding,
				pdbFileName: file.name,
			});
		} catch (error) {
			console.log(error);
		}
	}}
	disabled={file === undefined}>Upload</Button
>

<style>
	/*  put stuff here */
</style>
