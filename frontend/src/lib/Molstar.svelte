<script lang="ts">
	import { onDestroy } from "svelte";
	import { PDBeMolstarPlugin } from "../../venome-molstar/lib";
	import {
		loseWebGLContext,
		colorResidues,
		type ChainColors,
	} from "./venomeMolstarUtils";
	import type { QueryParam } from "../../venome-molstar/lib/helpers";

	export let url = "";
	export let format = "pdb";
	export let bgColor = { r: 255, g: 255, b: 255 }; // white
	export let binary = false;
	export let width = 500;
	export let height = 500;
	export let hideControls = true;
	export let chainColors: ChainColors = {};
	let m: PDBeMolstarPlugin;
	let subscribe: ReturnType<typeof colorByChain>;

	let divEl: HTMLDivElement;
	async function render() {
		m = new PDBeMolstarPlugin();
		// some bs for the whole thing to rerender. TODO: fix this.
		divEl.innerHTML = "";
		const div = document.createElement("div");
		divEl.appendChild(div);
		await m.render(div, {
			customData: {
				url,
				format,
				binary,
			},
			bgColor,
			subscribeEvents: false,
			selectInteraction: true,
			alphafoldView: false,
			reactive: true,
			sequencePanel: true,
			hideControls,
			hideCanvasControls: ["animation"],
		});
	}

	function colorByChain(chainColors: ChainColors) {
		let allColors: QueryParam[] = [];
		for (const [chainId, rgbPerResidue] of Object.entries(chainColors)) {
			const colors = colorResidues({
				struct_asym_id: chainId,
				colors: rgbPerResidue,
			});
			// add to all colors
			allColors = [...allColors, ...colors];
		}
		return m.events.loadComplete.subscribe(() => {
			m.visual.select({ data: allColors });
			console.log("color");
		});
	}

	onDestroy(() => {
		loseWebGLContext(divEl.querySelector("canvas")!);
		m.plugin.dispose();
		subscribe.unsubscribe();
	});

	$: {
		if (url && divEl) {
			render();
			if (chainColors) {
				subscribe = colorByChain(chainColors);
			}
		}
	}
</script>

<div
	bind:this={divEl}
	id="myViewer"
	style="width: {width}px; height: {height}px;"
/>

<style>
	/* https://embed.plnkr.co/plunk/WlRx73uuGA9EJbpn */
	.msp-plugin ::-webkit-scrollbar-thumb {
		background-color: #474748 !important;
	}
	#myViewer {
		float: left;
		position: relative;
		z-index: 999;
	}
</style>
