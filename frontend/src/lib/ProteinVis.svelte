<script lang="ts">
	import { onMount } from "svelte";
	import { PDBeMolstarPlugin } from "../../venome-molstar";
	import type { InitParams } from "../../venome-molstar/lib/spec";
	import { Backend } from "./backend";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{
		mount: { screenshot: typeof screenshot };
	}>();

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
	onMount(async () => {
		await m.render(divEl, options);
		dispatch("mount", { screenshot });
	});

	async function screenshot(delayMs = 200) {
		async function onLoad(funcToExec: () => void) {
			return new Promise((resolve) => {
				m.events.loadComplete.subscribe(() => {
					funcToExec();
					resolve(true);
				});
			});
		}
		async function delay(ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		let p = "";
		await onLoad(() => {
			console.log("protein loaded");
		});
		await delay(delayMs); // why the fuck do I need this for the next line to work?
		p = m.plugin.helpers.viewportScreenshot
			?.getPreview()!
			.canvas.toDataURL()!;
		return p;
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
		z-index: 997;
	}
</style>
