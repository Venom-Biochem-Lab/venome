<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "../lib/backend";
	import { PDBeMolstarPlugin } from "../../venome-molstar/lib";

	let divEl: HTMLDivElement;
	let m: PDBeMolstarPlugin;
	let mounted = false;
	let proteinsNeedingPng: ProteinEntry[] = [];
	let uploaded = 0;
	let preview = "";
	onMount(async () => {
		const allProteins = await Backend.searchProteins({ query: "" });
		// proteinsNeedingPng = allProteins.proteinEntries.filter((protein) => {
		// 	return protein.thumbnail === null;
		// });
		proteinsNeedingPng = allProteins.proteinEntries;
		mounted = true;
	});

	$: if (mounted) {
		getImageDataForAllProteins(proteinsNeedingPng);
	}

	async function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function base64ToBytes(base64: string) {
		const binString = atob(base64);
		console.log(binString);
		//@ts-ignore
		return Uint32Array.from(binString, (m) => m.codePointAt(0));
	}

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
			preview = b64;
			await Backend.uploadProteinPng({
				base64Encoding: b64,
				proteinName: protein.name,
			});
			await m.clear();
			uploaded++;
		}
	}
</script>

<div
	bind:this={divEl}
	style="width: 400px; height: 350px; float: left; position: relative;"
></div>

<div>
	Uploading {uploaded} of {proteinsNeedingPng.length}
</div>
<div>
	preview
	<img src={preview} />
</div>
