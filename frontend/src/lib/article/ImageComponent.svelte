<script lang="ts">
	import { Fileupload, Label, FloatingLabelInput } from "flowbite-svelte";
	import EditMode from "./EditMode.svelte";
	import { fileToBase64String, fileToString } from "../format";
	import { Backend } from "../backend";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let articleTitle: string;
	export let id: number;
	export let src: string;
	export let width: number;
	export let height: number;
	let files: FileList | undefined; // bind:files on the Fileupload
	$: file = files ? files[0] : undefined; // we're just concerned with one file
	$: disabledSave =
		file === undefined && editedWidth === width && editedHeight === height;
	let editedWidth: number | string = width;
	let editedHeight: number | string = height;
</script>

<EditMode
	{disabledSave}
	on:save={async () => {
		await Backend.editArticleImageComponent({
			imageComponentId: id,
			newSrc: file ? await fileToBase64String(file) : null,
			newHeight:
				editedHeight === "" || editedHeight === null
					? null
					: Number(editedHeight),
			newWidth:
				editedWidth === "" || editedWidth === null
					? null
					: Number(editedWidth),
		});
		dispatch("change");
	}}
	on:delete={async () => {
		await Backend.deleteArticleImageComponent(id);
		dispatch("change");
	}}
	on:movedown={async () => {}}
	on:moveup={async () => {}}
>
	<slot>
		{#if src === ""}
			<p>No image selected</p>
		{:else}
			<img {src} alt="" {width} {height} />
		{/if}
	</slot>
	<slot slot="edit">
		<div class="flex flex-col gap-2 p-5">
			<div>
				<Label for="image-upload" class="block mb-2"
					>Upload New Image</Label
				>
				<Fileupload id="image-upload" class="w-100" bind:files />
			</div>
			<div style="width: 200px;">
				<FloatingLabelInput
					style="filled"
					type="number"
					bind:value={editedWidth}>width</FloatingLabelInput
				>
			</div>
			<div style="width: 200px;">
				<FloatingLabelInput
					style="filled"
					type="number"
					bind:value={editedHeight}>height</FloatingLabelInput
				>
			</div>
		</div>
	</slot>
</EditMode>

<style>
	/*  put stuff here */
</style>
