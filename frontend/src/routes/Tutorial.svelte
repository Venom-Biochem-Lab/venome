<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";
	import Markdown from "../lib/Markdown.svelte";

	export let tutorialTitle: string;

	let tutorial: Tutorial;
	onMount(async () => {
		tutorial = await Backend.getTutorial(tutorialTitle);
	});
</script>

{#if tutorial}
	<div>Tutorial: {tutorialTitle}</div>
	<div>{tutorial.description}</div>
	{#if tutorial.content}
		<div>
			<Markdown text={tutorial.content}></Markdown>
		</div>
	{/if}
{/if}
