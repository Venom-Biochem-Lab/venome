<script lang="ts">
	import { Textarea } from "flowbite-svelte";
	import Markdown from "../Markdown.svelte";
	import { Backend, setToken } from "../backend";
	import { createEventDispatcher } from "svelte";
	import EditMode from "./EditMode.svelte";
	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let id: number;
	export let markdown: string;
	let disabledSave = false;

	let editedMarkdown = markdown;
</script>

<EditMode
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
	on:cancel={() => {}}
	on:delete={async () => {
		try {
			setToken();
			await Backend.deleteArticleComponent(id);
		} catch (e) {
			console.error(e);
		}
		dispatch("change");
	}}
	on:movedown={async () => {}}
	on:moveup={async () => {}}
>
	<slot>
		<Markdown text={String.raw`${markdown}`} />
	</slot>
	<slot slot="edit">
		<Textarea rows={10} bind:value={editedMarkdown} />
	</slot>
</EditMode>
