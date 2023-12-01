<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// remove once we have a landing page
	onMount(() => {
		goto("/search");
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div>Landing Page</div>

<style>
	/*  put stuff here */
</style>
