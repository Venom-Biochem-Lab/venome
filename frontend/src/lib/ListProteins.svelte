<script lang="ts">
	import { goto } from "$app/navigation";
	import type { ProteinEntry } from "$lib/backend";
	import { numberWithCommas } from "$lib/format";
	import { Tabs, TabItem } from "flowbite-svelte";
	import dummy from "$lib/images/dummy.png";

	export let allEntries: ProteinEntry[] | null = null;
	const dummyDesc =
		"scriptionDescriptionDescription DescriptionDescription Description Description";
</script>

<Tabs style="full" contentClass="bg-none p-5">
	<TabItem open title="Proteins">
		{#if allEntries}
			{#each allEntries as entry}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="prot-container"
					on:click={() => goto(`/protein/${entry.name}`)}
				>
					<div class="prot-thumb">
						<img class="prot-thumb" src={dummy} alt="dummy" />
					</div>
					<div>
						<div class="prot-name">
							{entry.name}
						</div>
						<div class="prot-desc">
							{dummyDesc}
						</div>
						<div class="mt-2">
							<div>
								<b>Organism</b>: {entry.speciesName},
								<b>Method</b>: AlphaFold2
							</div>
							<div>
								<b>Length</b>: <code>{entry.length}</code>,
								<b>Mass</b>: <code>{numberWithCommas(entry.mass)}</code>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</TabItem>
	<TabItem title="Scatter Plot">not yet implemented</TabItem>
</Tabs>

<style>
	.prot-container {
		display: flex;
		outline: hsla(var(--darkblue-hsl), 0.3) 1px solid;
		border-radius: 5px;
		width: 500px;
		padding-left: 15px;
		padding-bottom: 15px;
		padding-top: 15px;
	}
	.prot-container:hover {
		transform: scale(1.02);
		transition: all 0.2s ease-in-out;
		outline: var(--darkblue) 1px dashed;
		cursor: pointer;
	}
	.prot-thumb {
		width: 150px;
		height: 150px;
	}
	.prot-name {
		font-size: 1.5em;
		color: var(--darkblue);
	}
	.prot-desc {
		overflow-wrap: break-word;
		width: 300px;
		font-weight: 300;
	}
	b {
		font-weight: 500;
	}
</style>
