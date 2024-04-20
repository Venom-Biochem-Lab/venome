<script lang="ts">
	import { Fileupload, Label, FloatingLabelInput } from "flowbite-svelte";
	import EditMode from "./EditMode.svelte";
	import { fileToBase64String } from "../format";
	import { Backend, setToken } from "../backend";
	import { createEventDispatcher } from "svelte";
	import Placeholder from "./Placeholder.svelte";

	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let articleId: number;
	export let id: number;
	export let src: string;
	export let width: number;
	export let height: number;
	export let editMode = false;

	const AUTO_SIZE = null;
	const NO_FILE_INPUT = undefined;

	let files: FileList | undefined; // bind:files on the Fileupload
	let editedWidth: number | string = width;
	let editedHeight: number | string = height;

	$: file = files ? files[0] : undefined; // we're just concerned with one file
	$: disabledSave =
		file === undefined && editedWidth === width && editedHeight === height;

	function hasNoInput(edited: string | number | null) {
		return edited === "" || edited === null;
	}
</script>

<EditMode
	{articleId}
	componentId={id}
	forceHideEdit={!editMode}
	{disabledSave}
	on:save={async () => {
		try {
			setToken();
			await Backend.editArticleImageComponent({
				componentId: id,
				newSrc: file ? await fileToBase64String(file) : NO_FILE_INPUT,
				newHeight: hasNoInput(editedHeight) ? AUTO_SIZE : +editedHeight,
				newWidth: hasNoInput(editedWidth) ? AUTO_SIZE : +editedWidth,
			});
			dispatch("change");
		} catch (e) {
			console.error(e);
		}
	}}
	on:delete={async () => {
		dispatch("change");
	}}
	on:movedown={async () => {}}
	on:moveup={async () => {}}
>
	<slot>
		{#if src !== ""}
			<img {src} alt="" {width} {height} />
		{:else}
			<Placeholder name="image component" color="lightcoral" />
		{/if}
	</slot>
	<slot slot="edit">
		<div class="flex flex-col gap-2 p-5" style="width: 500px;">
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
