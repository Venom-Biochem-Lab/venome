<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";

	onMount(async () => {
		const output = await Backend.helloWorld();
		console.log(output);
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section />

<style>
</style>
