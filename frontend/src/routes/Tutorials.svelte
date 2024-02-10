<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";

	let tutorials: Tutorial[] = [];
	onMount(async () => {
		tutorials = await Backend.getAllTutorials();
	});
</script>

<div>
	{#each tutorials as tutorial}
		<div>
			<h2>{tutorial.title}</h2>
		</div>
	{/each}
</div>

<style>
	/*  put stuff here */
</style>
