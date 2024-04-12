<script lang="ts">
	import { Button, Textarea, Popover } from "flowbite-svelte";
	import Markdown from "../Markdown.svelte";
	import { Backend } from "../backend";
	import { createEventDispatcher } from "svelte";
	import {
		CheckOutline,
		CloseOutline,
		EditOutline,
		TrashBinOutline,
	} from "flowbite-svelte-icons";
	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let articleTitle: string;
	export let id: number;
	export let markdown: string;
	let editedMarkdown = markdown;
	let editMode = false;
	let revealEdit = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:mouseenter={() => {
		if (!editMode) {
			revealEdit = true;
		}
	}}
	on:mouseleave={() => (revealEdit = false)}
	class:editing={editMode}
	class="text-component"
>
	{#if editMode}
		<Textarea rows={10} bind:value={editedMarkdown} />
		<div class="flex justify-between p-1">
			<div>
				<Button outline size="xs" on:click={() => (editMode = false)}>
					<CloseOutline size="sm" class="mr-1" /> Cancel Edits</Button
				>
				<Button
					disabled={editedMarkdown === markdown}
					size="xs"
					on:click={async () => {
						try {
							await Backend.editArticleTextComponent({
								newMarkdown: editedMarkdown,
								textComponentId: id,
							});
						} catch (e) {
							console.error(e);
						}
						editMode = false;
						dispatch("change");
					}}
					><CheckOutline size="sm" class="mr-1" /> Save Edits</Button
				>
			</div>
			<Button
				size="xs"
				color="red"
				outline
				on:click={async () => {
					try {
						await Backend.deleteArticleTextComponent(id);
					} catch (e) {
						console.error(e);
					}
					editMode = false;
					dispatch("change");
				}}
				><TrashBinOutline size="sm" class="mr-1" /> Delete Forever</Button
			>
		</div>
	{:else}
		<Markdown text={String.raw`${markdown}`} />
	{/if}
	{#if revealEdit}
		<div style="position: absolute; left: -60px; top: 10px; width: 60px;">
			<Button
				size="xs"
				color="light"
				on:click={() => {
					editMode = true;
					revealEdit = false;
				}}><EditOutline size="xs" /> Edit</Button
			>
		</div>
	{/if}
</div>

<style>
	.text-component {
		padding: 5px;
		position: relative;
	}
	.editing {
		outline: 1px solid var(--primary-500);
		border-radius: 3px;
		background-color: var(--primary-100);
	}
</style>
