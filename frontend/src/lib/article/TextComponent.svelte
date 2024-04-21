<script lang="ts">
	import { Textarea } from "flowbite-svelte";
	import Markdown from "../Markdown.svelte";
	import { Backend, setToken } from "../backend";
	import { createEventDispatcher } from "svelte";
	import EditMode from "./EditMode.svelte";
	import Placeholder from "./Placeholder.svelte";
	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let articleId: number;
	export let id: number;
	export let markdown: string;
	export let editMode = false;
	let disabledSave = false;

	let editedMarkdown = markdown;
</script>

<EditMode
	{articleId}
	componentId={id}
	forceHideEdit={!editMode}
	bind:disabledSave
	on:save={async () => {
		try {
			setToken();
			await Backend.editArticleTextComponent({
				newMarkdown: editedMarkdown,
				componentId: id,
			});
		} catch (e) {
			console.error(e);
		}
		dispatch("change");
	}}
	on:change={() => {
		dispatch("change");
	}}
>
	<slot>
		{#if markdown.length > 0}
			<Markdown text={String.raw`${markdown}`} />
		{:else}
			<Placeholder name="text component" color="slateblue" />
		{/if}
	</slot>
	<slot slot="edit">
		<Textarea rows={10} bind:value={editedMarkdown} />
	</slot>
</EditMode>
