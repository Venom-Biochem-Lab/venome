<script lang="ts">
	import { Button } from "flowbite-svelte";
	import { UndoOutline } from "flowbite-svelte-icons";
	import { Backend } from "./backend";
	import {
		alphafoldColorscheme,
		alphafoldThresholds,
		pLDDTToAlphaFoldResidueColors,
		type ChainColors,
	} from "./venomeMolstarUtils";

	export let proteinName: string;
	export let chainColors: ChainColors = {};
</script>

<div class="mt-2 flex gap-2 items-center">
	{#if Object.keys(chainColors).length > 0}
		<Button
			outline
			color="light"
			size="xs"
			on:click={() => {
				chainColors = {};
			}}><UndoOutline size="xs" /></Button
		>
	{/if}
	<Button
		color="light"
		size="xs"
		outline
		on:click={async () => {
			if (!proteinName) return;
			const pLDDTPerChain =
				await Backend.getPLddtGivenProtein(proteinName);
			for (const [chainId, pLDDTPerResidue] of Object.entries(
				pLDDTPerChain
			)) {
				chainColors[chainId] =
					pLDDTToAlphaFoldResidueColors(pLDDTPerResidue);
			}
		}}
	>
		Color by pLDDT
	</Button>
	{#if Object.keys(chainColors).length > 0}
		{#each alphafoldThresholds as at, i}
			<div
				class="legend-chip"
				style="--color: {alphafoldColorscheme[i]};"
			>
				{at}
			</div>
		{/each}
	{/if}
</div>

<style>
	.legend-chip {
		--color: black;
		color: white;
		background-color: var(--color);
		border-radius: 3px;
		font-size: 12px;

		padding-left: 5px;
		padding-right: 5px;
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>
