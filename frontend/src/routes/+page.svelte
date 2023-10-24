<script lang="ts">
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";

	onMount(async () => {
		const hello = await Backend.helloWorld();
		console.log("test hello world", hello);

		const { data } = await Backend.randomNormal({
			numValues: 512,
			mean: 0,
			stdVar: 1,
		});
		console.log("random values", data);
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1 class="massive">Hello World!</h1>
</section>

<style>
	.massive {
		font-size: 100px;
	}
</style>
