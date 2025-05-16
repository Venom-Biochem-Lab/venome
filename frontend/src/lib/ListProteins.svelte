<script lang="ts">
	import { navigate } from "svelte-routing";
	import type { ProteinEntry } from "./backend";
	import {
		formatProteinName,
		numberWithCommas,
		undoFormatProteinName,
	} from "./format";

	export let allEntries: ProteinEntry[] | null = null;
</script>

<div class="prot-grid">
	{#if allEntries}
		{#each allEntries as entry}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="prot-container"
				on:click={() => navigate(`/protein/${entry.name}`)}
				title={`Name:${entry.name}\nDescription:${entry.description}`}
			>
				<div class="prot-thumb mr-2">
					<img
						loading="lazy"
						class="prot-thumb"
						src={entry.thumbnail ?? ""}
						alt="thumbnail"
					/>
				</div>
				<div class="prot-info">
					<div class="prot-name">
						{undoFormatProteinName(entry.name)}
					</div>
					<div class="prot-desc">
						{#if entry.description}
							{entry.description}
						{/if}
					</div>
					<div>
						<div><b>Organism</b>: {entry.speciesName}</div>
						<div><b>Method</b>: AlphaFold2</div>
						<div><b>Length:</b> <code>{entry.length}</code></div>
						<div>
							<b>Mass</b>:
							<code>{numberWithCommas(entry.mass)}</code>
						</div>
						<div>
							<b>Atoms</b>:
							<code>{numberWithCommas(entry.atoms)}</code>
						</div>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.prot-container {
		--border-opacity: 0.2;
		display: flex;
		outline: hsla(0, 0%, 0%, var(--border-opacity)) 1px solid;
		border-radius: 5px;
		width: 500px;
		padding-left: 15px;
		padding-bottom: 15px;
		padding-top: 15px;
		box-sizing: border-box;
		transition: all 0.2s ease-in-out;
		align-self: start;
	}
	.prot-container:hover {
		transform: scale(1.02);
		--border-opacity: 0.3;
		box-shadow: 0 1px 2px 2px #00000010;
		cursor: pointer;
	}
	.prot-thumb {
		width: 150px;
		height: 150px;
	}
	.prot-name {
		font-size: 1.5em;
		color: var(--primary-700);
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
		align-content: flex-start;
		flex-wrap: wrap;
		padding: 10px;
		margin-left: 10px;
	}
	.prot-info {
		width: 300px;
	}
</style>
