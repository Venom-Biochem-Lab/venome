<script lang="ts">
	import { Spinner } from "flowbite-svelte";
	import { onMount } from "svelte";
	export let msDelay = 500;
	export let spinnerProps = {};
	export let text = "";
	export let textRight = false;

	let showSpinner = false;

	onMount(() => {
		setTimeout(() => {
			showSpinner = true;
		}, msDelay);
	});
</script>

{#if showSpinner}
	{#if textRight}
		<Spinner {...spinnerProps} /> {text}
	{:else}
		{text} <Spinner {...spinnerProps} />
	{/if}
{/if}
