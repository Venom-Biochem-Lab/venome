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

<div class="prot-grid">
	{#if allEntries}
		{#each allEntries as entry}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="prot-container"
				on:click={() => goto(`/protein/${entry.name}`)}
				title={`Name:${entry.name}\nDescription:${dummyDesc}`}
			>
				<div class="prot-thumb mr-2">
					<img class="prot-thumb" src={dummy} alt="dummy" />
				</div>
				<div class="prot-info">
					<div class="prot-name">
						{entry.name}
					</div>
					<div class="prot-desc">
						{dummyDesc}
					</div>
					<div>
						<div><b>Organism</b>: {entry.speciesName}</div>
						<div><b>Method</b>: AlphaFold2</div>
						<div><b>Length:</b> <code>{entry.length}</code></div>
						<div>
							<b>Mass</b>: <code>{numberWithCommas(entry.mass)}</code>
						</div>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.prot-container {
		display: flex;
		outline: hsla(var(--darkblue-hsl), 0.3) 1px solid;
		border-radius: 5px;
		width: 500px;
		padding-left: 15px;
		padding-bottom: 15px;
		padding-top: 15px;
		box-sizing: border-box;
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
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.prot-desc {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 300;
	}
	b {
		font-weight: 500;
	}
	.prot-grid {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		overflow-y: scroll;
		padding: 10px;
		margin-left: 10px;
		height: calc(100vh - 100px);
	}
	.prot-info {
		width: 300px;
	}
</style>
