<script lang="ts">
	import { onMount } from "svelte";
	import { PDBeMolstarPlugin } from "../../venome-molstar";
	import type { InitParams } from "../../venome-molstar/lib/spec";
	import { Backend } from "./backend";

	export let proteinName = "Gh_comp271_c0_seq1";
	export let format = "pdb";
	export let width = 500;
	export let height = 500;

	const url = `http://localhost:8000/protein/pdb/${proteinName}`;
	const m = new PDBeMolstarPlugin(); // loaded through app.html
	let divEl: HTMLDivElement;
	const options: Partial<InitParams> = {
		customData: {
			url,
			format,
			binary: false,
		},
		subscribeEvents: false,
		bgColor: {
			r: 255,
			g: 255,
			b: 255,
		},
		selectInteraction: true,
		alphafoldView: true,
		reactive: true,
		sequencePanel: true,
		hideControls: true,
		hideCanvasControls: ["animation"],
	};

	/**
	 * @todo: don't upload the protein thumbnail everytime, just do once!
	 */
	let mounted = false;
	onMount(async () => {
		await m.render(divEl, options);
		mounted = true;
		screenshot().then((d) =>
			Backend.uploadProteinPng({
				proteinName,
				base64Encoding: d,
			})
		);
	});

	async function screenshot() {
		const p = new Promise((resolve, reject) => {
			m.events.loadComplete.subscribe(() => resolve(m.screenshotData()));
		});
		return (await p) as Promise<string>;
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
