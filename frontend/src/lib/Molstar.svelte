<script lang="ts">
	import { onDestroy, createEventDispatcher } from "svelte";
	import { PDBeMolstarPlugin } from "../../venome-molstar/lib";
	import { loseWebGLContext } from "./venomeMolstarUtils";

	const dispatch = createEventDispatcher<{ render: PDBeMolstarPlugin }>();

	export let url = "";
	export let format = "pdb";
	export let bgColor = { r: 255, g: 255, b: 255 }; // white
	export let binary = false;
	export let width = 500;
	export let height = 500;
	export let hideControls = true;
	export let hideCanvasControls:
		| (
				| "animation"
				| "selection"
				| "expand"
				| "controlToggle"
				| "controlInfo"
		  )[]
		| undefined = ["animation"];
	let m: PDBeMolstarPlugin;

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
			alphafoldView: true,
			reactive: true,
			sequencePanel: true,
			hideControls,
			hideCanvasControls,
		});
		dispatch("render", m);
	}

	onDestroy(() => {
		loseWebGLContext(divEl.querySelector("canvas")!);
		m.plugin.dispose();
	});

	$: {
		if (url && divEl) {
			render();
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
