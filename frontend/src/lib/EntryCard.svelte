<script lang="ts">
	import { Card } from "flowbite-svelte";
	export let title = "";
	export let style = "";
</script>

<Card
	class="max-w-full mt-5"
	style="padding-top: 15px; color: var(--color-text); {style}"
>
	<h2 class="text-primary-900 mb-2">{title}</h2>
	<slot />
</Card>
