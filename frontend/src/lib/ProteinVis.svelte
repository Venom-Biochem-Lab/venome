<script lang="ts">
	import { onMount } from "svelte";

	export let url =
		"http://localhost:8000/data/pdbAlphaFold/Gh_comp271_c0_seq1.pdb";
	export let format = "pdb";
	export let width = 500;
	export let height = 500;

	onMount(async () => {
		//Create plugin instance
		// @ts-ignore
		var viewerInstance = new PDBeMolstarPlugin(); // loaded through app.html

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
			reactive: true,
			sequencePanel: true,
			hideControls: true,
			hideCanvasControls: ["animation"],
		};

		//Get element from HTML/Template to place the viewer
		var viewerContainer = document.getElementById("myViewer");

		//Call render method to display the 3D view
		viewerInstance.render(viewerContainer, options);
	});
</script>

<div id="myViewer" style="width: {width}px; height: {height}px;" />

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
