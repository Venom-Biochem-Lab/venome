<script lang="ts">
	import { PDBeMolstarPlugin } from "../../venome-molstar";
	import { onMount } from "svelte";
	import type { InitParams } from "../../venome-molstar/lib/spec";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let urlId: string;
	let divEl: HTMLDivElement;
	let b64: string = "";
	const m = new PDBeMolstarPlugin();
	const options: Partial<InitParams> = {
		customData: {
			url: `http://localhost:8000/protein/pdb/${urlId}`,
			format: "pdb",
			binary: false,
		},
		subscribeEvents: false,
		bgColor: {
			r: 255,
			g: 255,
			b: 255,
		},
		selectInteraction: false,
		alphafoldView: true,
		reactive: false,
		sequencePanel: false,
		hideControls: true,
		hideCanvasControls: [
			"animation",
			"expand",
			"selection",
			"controlToggle",
			"controlInfo",
		],
	};

	async function screenshot() {
		await m.render(divEl, options);
		const p = new Promise((resolve, reject) => {
			m.events.loadComplete.subscribe(() => resolve(m.screenshotData()));
		});
		return (await p) as Promise<string>;
	}

	onMount(async () => {
		b64 = await screenshot();
		dispatch("pngload", b64);
	});
</script>

<div
	bind:this={divEl}
	style="width: 150px; height: 150px; float: left; position: relative; visibility: hidden;"
></div>
