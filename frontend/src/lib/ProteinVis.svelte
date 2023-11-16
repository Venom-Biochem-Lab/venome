<script lang="ts">
	import { onMount } from "svelte";

	export let url =
		"http://localhost:8000/data/pdbAlphaFold/Gh_comp271_c0_seq1.pdb";
	export let format = "pdb";

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

<div id="myViewer" />

<style>
	/* https://embed.plnkr.co/plunk/WlRx73uuGA9EJbpn */
	.msp-plugin ::-webkit-scrollbar-thumb {
		background-color: #474748 !important;
	}
	#myViewer {
		float: left;
		width: 500px;
		height: 500px;
		position: relative;
	}
</style>
