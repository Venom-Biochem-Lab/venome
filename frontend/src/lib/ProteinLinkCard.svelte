<script lang="ts">
	import { Card } from "flowbite-svelte";
	import { numberWithCommas, undoFormatProteinName } from "./format";
	import type { ProteinEntry } from "./backend";
	import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
	import { link } from "svelte-routing";

	export let entry: ProteinEntry;
	export let color: string;
</script>

<Card style="border: 1px solid {color}; width: 400px;">
	<div>
		<h3 class="hide-ellipses">
			<a
				use:link
				href="/protein/{entry.name}"
				style="color: {color}"
				class="flex gap-1 items-center"
			>
				{undoFormatProteinName(entry.name)}
				<ArrowUpRightFromSquareOutline size="sm" />
			</a>
		</h3>
	</div>
	<div class="hide-ellipses light">
		{entry.description}
	</div>
	<div class="light">
		<b>Organism</b>: {entry.speciesName}
	</div>
	<div class="light">
		<b>Length</b>: <code>{entry.length}</code> residues
	</div>
	<div class="light">
		<b>Mass</b>: <code>{numberWithCommas(entry.mass, 0)}</code> Da
	</div>
</Card>

<style>
	.hide-ellipses {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.light {
		font-weight: 300;
	}
</style>
