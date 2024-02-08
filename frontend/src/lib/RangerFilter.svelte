<script lang="ts">
	import { Button, Input, Label } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	export let min: number;
	export let max: number;
	export let selectedMin: number = min;
	export let selectedMax: number = max;

	const dispatch = createEventDispatcher();
</script>

<div class="flex gap-2 items-center">
	<div style="width: 100px;">
		<Label for="min">Min</Label>
		<Input
			id="min"
			type="number"
			{min}
			{max}
			bind:value={selectedMin}
			on:change={() => {
				dispatch("change", { min: selectedMin, max: selectedMax });
			}}
		/>
	</div>

	<div style="width: 100px;">
		<Label for="max">Max</Label>
		<Input
			id="max"
			type="number"
			{min}
			{max}
			bind:value={selectedMax}
			on:change={() => {
				dispatch("change", { min: selectedMin, max: selectedMax });
			}}
		/>
	</div>
</div>
