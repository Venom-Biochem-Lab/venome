<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";

	export let tutorialTitle: string;

	let tutorial: Tutorial;
	onMount(async () => {
		tutorial = await Backend.getTutorial(tutorialTitle);
	});
</script>

{#if tutorial}
	<div>Tutorial: {tutorialTitle}</div>
	<div>{tutorial.description}</div>
{/if}
