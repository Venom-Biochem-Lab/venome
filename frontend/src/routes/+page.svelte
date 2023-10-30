<script lang="ts">
	import Counter from "$lib/Counter.svelte";
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";

	onMount(async () => {
		const helloWorld = await Backend.helloWorld();
		console.log(helloWorld);
		const dist = await Backend.genNormDist({
			stdDev: 2,
			mean: 0,
			length: 100_000,
		});
		console.log(dist);
	});
</script>

<div class="massive">Hello World</div>

<Counter count={400} increment={5} />

<style>
	.massive {
		font-size: 100px;
	}
</style>
