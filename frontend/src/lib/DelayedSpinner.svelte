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
	<div class="flex gap-2 items-center">
		{#if textRight}
			<Spinner {...spinnerProps} />
			<p>{text}</p>
		{:else}
			<p>{text}</p>
			<Spinner {...spinnerProps} />
		{/if}
	</div>
{/if}
