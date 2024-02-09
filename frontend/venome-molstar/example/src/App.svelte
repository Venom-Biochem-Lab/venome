<script lang="ts">
	import { onMount } from "svelte";
	import { PDBeMolstarPlugin } from "../../lib";

	export let url =
		"https://alphafold.ebi.ac.uk/files/AF-A0A2K5XT84-F1-model_v4.cif";
	export let format = "cif";
	export let width = 500;
	export let height = 500;
	let d;

	let viewerInstance: PDBeMolstarPlugin;
	onMount(async () => {
		//Create plugin instance
		viewerInstance = new PDBeMolstarPlugin();

		//Set options (Checkout available options list in the documentation)
		var options = {
			customData: {
				url,
				format,
			},
			subscribeEvents: false,
			bgColor: {
				r: 255,
				g: 255,
				b: 255,
			},
			selectInteraction: true,
			alphafoldView: true,
			reactive: false,
			sequencePanel: true,
			hideControls: true,
			hideCanvasControls: ["animation"],
		};

		//Get element from HTML/Template to place the viewer
		var viewerContainer = document.getElementById("myViewer")!;

		//Call render method to display the 3D view
		// @ts-ignore
		await viewerInstance.render(viewerContainer, options);
	});
</script>

<div id="myViewer" style="width: {width}px; height: {height}px;" />

<button
	on:click={() => {
		viewerInstance.screenshotData()?.then((d) => console.log(d));
	}}>hit</button
>

<!-- {#if d}
	<div>
		here
		<img src={d} />
	</div>
{/if} -->

<style>
	#myViewer {
		float: left;
		position: relative;
	}
	img {
		outline: 1px solid black;
	}
</style>
