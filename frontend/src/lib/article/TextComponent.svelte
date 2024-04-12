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
>
	{#if editMode}
		<Textarea bind:value={editedMarkdown} />
		<Button
			on:click={async () => {
				try {
					await Backend.deleteArticleTextComponent(id);
				} catch (e) {
					console.error(e);
				}
				dispatch("change");
			}}>Delete</Button
		>
		<Button
			disabled={editedMarkdown === markdown}
			on:click={async () => {
				console.log("saved edit");
				// make a call where I put the new markdown
			}}>Save</Button
		>
		<Button on:click={() => (editMode = false)}>Cancel</Button>
	{:else}
		<Markdown text={String.raw`${markdown}`} />
	{/if}
	{#if revealEdit && !editMode}
		<Button on:click={() => (editMode = true)}>Edit</Button>
	{/if}
</div>

<style>
	/*  put stuff here */
</style>
