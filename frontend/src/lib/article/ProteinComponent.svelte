<script lang="ts">
	import { onMount } from "svelte";
	import Molstar from "../Molstar.svelte";
	import { BACKEND_URL, Backend, type ProteinEntry } from "../backend";
	import ProteinLinkCard from "../ProteinLinkCard.svelte";
	import * as d3 from "d3";

	export let name: string;
	export let alignedWithName: string | undefined = undefined;
	export let width: number = 500;
	export let height: number = 350;

	const config = {
		hideControls: true,
		spin: false,
	};

	let entry: ProteinEntry | null;
	let alignEntry: ProteinEntry | null;
	onMount(async () => {
		entry = await Backend.getProteinEntry(name);
		if (alignedWithName) {
			alignEntry = await Backend.getProteinEntry(alignedWithName);
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
			url={`${BACKEND_URL}/protein/pdb/${name}${alignedWithName ? "/" + alignedWithName : ""}`}
			{width}
			{height}
			zIndex={1}
			hideControls={config.hideControls ?? true}
			spin={config.spin ?? false}
		/>
	</div>
</div>
