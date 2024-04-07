<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";
	import EntryCard from "../lib/EntryCard.svelte";
	import References from "../lib/References.svelte";
	import Markdown from "../lib/Markdown.svelte";

	export let tutorialTitle: string;

	let tutorial: Tutorial;
	onMount(async () => {
		tutorial = await Backend.getTutorial(tutorialTitle);
	});
</script>

<section class="p-5">
	{#if tutorial}
		<div>Tutorial: {tutorialTitle}</div>
		<div>{tutorial.description}</div>
		{#if tutorial.content}
			{#if tutorial.content}
				<EntryCard title="Article">
					<Markdown text={tutorial.content} />
				</EntryCard>
			{/if}
			{#if tutorial.refs}
				<EntryCard title="References">
					<References bibtex={String.raw`${tutorial.refs}`} />
				</EntryCard>
			{/if}
		{/if}
	{/if}
</section>
