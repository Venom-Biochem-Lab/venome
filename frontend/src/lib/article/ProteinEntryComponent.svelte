<script lang="ts">
	import { onMount } from "svelte";
	import Molstar from "../Molstar.svelte";
	import { BACKEND_URL, Backend, type ProteinEntry } from "../backend";
	import ProteinLinkCard from "../ProteinLinkCard.svelte";
	export let data: {
		name: string;
		alignName?: string;
		width?: number;
		height?: number;
		hideControls?: boolean;
	};
	import * as d3 from "d3";

	let entry: ProteinEntry | null;
	let alignEntry: ProteinEntry | null;
	onMount(async () => {
		entry = await Backend.getProteinEntry(data.name);
		if (data.alignName) {
			alignEntry = await Backend.getProteinEntry(data.alignName);
		}
	});
</script>

<div class="flex gap-3">
	<div class="flex gap-2 flex-col">
		{#if entry}
			<div>
				<ProteinLinkCard {entry} color={d3.schemeDark2[0]} />
			</div>
		{/if}
		{#if alignEntry}
			<div>
				<ProteinLinkCard entry={alignEntry} color={d3.schemeDark2[1]} />
			</div>
		{/if}
	</div>
	<div>
		<Molstar
			url={`${BACKEND_URL}/protein/pdb/${data.name}${data.alignName ? "/" + data.alignName : ""}`}
			width={data.width ?? 500}
			height={data.height ?? 350}
			zIndex={1}
			hideControls={data.hideControls ?? true}
		/>
	</div>
</div>
