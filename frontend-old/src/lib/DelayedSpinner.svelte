<script lang="ts">
	import { Spinner } from "flowbite-svelte";
	import { onMount } from "svelte";
	export let msDelay = 500;
	export let spinnerProps = {};
	export let text = "";

	let showSpinner = false;

	onMount(() => {
		setTimeout(() => {
			showSpinner = true;
		}, msDelay);
	});
</script>

{#if showSpinner}
	{text} <Spinner {...spinnerProps} />
{/if}
