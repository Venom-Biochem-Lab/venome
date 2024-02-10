<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "../lib/backend";
	import { PDBeMolstarPlugin } from "../../venome-molstar";
	import type { InitParams } from "../../venome-molstar/lib/spec";

	let divEl: HTMLDivElement;
	let b64: string = "";

	const m = new PDBeMolstarPlugin();

	let mounted = false;
	let proteinsNeedingPng: ProteinEntry[] = [];
	onMount(async () => {
		const allProteins = await Backend.searchProteins({ query: "" });
		proteinsNeedingPng = allProteins.proteinEntries.filter((protein) => {
			return protein.thumbnail === null;
		});
		mounted = true;
	});

	$: if (mounted) {
		uploadPngsForAllProteins(proteinsNeedingPng);
	}

	async function uploadPngsForAllProteins(proteins: ProteinEntry[]) {
		const b64s = await getImageDataForAllProteins(proteins);
		proteins.forEach((protein, i) =>
			Backend.uploadProteinPng({
				base64Encoding: b64s[i],
				proteinName: protein.name,
			})
		);
	}

	async function getImageDataForAllProteins(proteins: ProteinEntry[]) {
		let d = [];
		for (let i = 0; i < proteins.length; i++) {
			const protein = proteins[i];
			const b64 = await screenshot({
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
			d.push(b64);
		}
		return d;
	}

	async function screenshot(options: Partial<InitParams>) {
		await m.render(divEl, options);
		const p = new Promise((resolve, reject) => {
			m.events.loadComplete.subscribe(() => resolve(m.screenshotData()));
		});
		return (await p) as Promise<string>;
	}
</script>

<div
	bind:this={divEl}
	style="width: 150px; height: 150px; float: left; position: relative;"
></div>
