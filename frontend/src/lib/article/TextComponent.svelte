<script lang="ts">
	import { Button, Textarea } from "flowbite-svelte";
	import Markdown from "../Markdown.svelte";
	import { Backend } from "../backend";
	import { createEventDispatcher } from "svelte";
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
	on:mouseenter={() => (revealEdit = true)}
	on:mouseleave={() => (revealEdit = false)}
	class:editing={editMode}
	class="text-component"
>
	{#if editMode}
		<Textarea rows={10} bind:value={editedMarkdown} />
		<div class="flex justify-between">
			<div>
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
					}}>Save Edits</Button
				>
				<Button outline size="xs" on:click={() => (editMode = false)}
					>Cancel</Button
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
				}}>Delete Forever</Button
			>
		</div>
	{:else}
		<Markdown text={String.raw`${markdown}`} />
	{/if}
	{#if revealEdit && !editMode}
		<Button on:click={() => (editMode = true)}>Edit</Button>
	{/if}
</div>

<style>
	.text-component {
		padding: 5px;
	}
	.editing {
		outline: 1px solid var(--primary-500);
		border-radius: 3px;
		background-color: var(--primary-100);
	}
</style>
