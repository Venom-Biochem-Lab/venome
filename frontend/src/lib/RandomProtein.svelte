<script lang="ts">
	import Molstar from "./Molstar.svelte";
	import { BACKEND_URL, Backend, type ProteinEntry } from "./backend";
	import { onMount } from "svelte";
	import { undoFormatProteinName, numberWithCommas } from "./format";
	import { Button, Card } from "flowbite-svelte";
	import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";

	export let randomProtein: ProteinEntry | undefined = undefined;
	onMount(async () => {
		randomProtein = await Backend.getRandomProtein();
	});
</script>

{#if randomProtein}
	<Card style="width: 400px;">
		<div>
			<h3 class="hide-ellipses">
				<a
					href="/protein/{randomProtein.name}"
					style="color: var(--darkblue)"
					class="flex gap-1 items-center"
				>
					{undoFormatProteinName(randomProtein.name)}
					<ArrowUpRightFromSquareOutline size="sm" />
				</a>
			</h3>
		</div>
		<div class="hide-ellipses light">
			{randomProtein.description}
		</div>
		<div class="light">
			<b>Organism</b>: {randomProtein.speciesName}
		</div>
		<div class="light">
			<b>Length</b>: <code>{randomProtein.length}</code> residues
		</div>
		<div class="light">
			<b>Mass</b>: <code>{numberWithCommas(randomProtein.mass, 0)}</code> Da
		</div>
		<Button
			size="xs"
			outline
			class="mt-3"
			on:click={async () =>
				(randomProtein = await Backend.getRandomProtein())}
			>Reroll random protein</Button
		>
	</Card>
	<Molstar
		url="{BACKEND_URL}/protein/pdb/{randomProtein.name}"
		width={300}
		height={300}
		hideCanvasControls={[
			"animation",
			"controlInfo",
			"controlToggle",
			"expand",
			"selection",
		]}
		on:render={({ detail: molstar }) => {
			molstar.visual.toggleSpin();
		}}
	/>
{/if}

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
