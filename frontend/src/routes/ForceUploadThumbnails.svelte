<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type ProteinEntry } from "../lib/backend";
	import {
		screenshotMolstar,
		defaultInitParams,
	} from "../lib/venomeMolstarUtils";
	let proteinsNeedingPng: ProteinEntry[] = [];
	let uploaded = 0;
	let preview = "";
	onMount(async () => {
		const allProteins = await Backend.searchProteins({ query: "" });
		proteinsNeedingPng = allProteins.proteinEntries.filter((protein) => {
			return protein.thumbnail === null;
		});
		let i = 0;
		for (const protein of proteinsNeedingPng) {
			const b64 = await screenshotMolstar(
				defaultInitParams(protein.name)
			);
			preview = b64;
			await Backend.uploadProteinPng({
				base64Encoding: b64,
				proteinName: protein.name,
			});
			uploaded++;
		}
	});
</script>

<div>
	Uploading {uploaded} of {proteinsNeedingPng.length}
</div>
<div>
	{proteinsNeedingPng[uploaded]?.name}
</div>
<div>
	<img src={preview} />
</div>
