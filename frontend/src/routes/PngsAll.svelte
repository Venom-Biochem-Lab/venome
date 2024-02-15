<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "../lib/backend";
	import { PDBeMolstarPlugin } from "../../venome-molstar";

	let divEl: HTMLDivElement;
	let m: PDBeMolstarPlugin;
	let mounted = false;
	let proteinsNeedingPng: ProteinEntry[] = [];
	let uploaded = 0;
	onMount(async () => {
		const allProteins = await Backend.searchProteins({ query: "" });
		proteinsNeedingPng = allProteins.proteinEntries.filter((protein) => {
			return protein.thumbnail === null;
		});
		mounted = true;
	});

	$: if (mounted) {
		getImageDataForAllProteins(proteinsNeedingPng);
	}

	async function getImageDataForAllProteins(proteins: ProteinEntry[]) {
		for (let i = 0; i < proteins.length; i++) {
			const protein = proteins[i];
			// remove the canvas within the div
			m = new PDBeMolstarPlugin();
			await m.render(divEl, {
				customData: {
					url: `http://localhost:8000/protein/pdb/${protein.name}`,
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
			});
			const b64 = await screenshot();
			await Backend.uploadProteinPng({
				base64Encoding: b64,
				proteinName: protein.name,
			});
			await m.clear();
			uploaded++;
		}
	}

	async function screenshot() {
		const p = new Promise((resolve, reject) => {
			m.events.loadComplete.subscribe(() => resolve(m.screenshotData()));
		});
		return (await p) as Promise<string>;
	}
</script>

<div
	bind:this={divEl}
	style="width: 400px; height: 350px; float: left; position: relative;"
></div>

<div>
	Uploading {uploaded} of {proteinsNeedingPng.length}
</div>
