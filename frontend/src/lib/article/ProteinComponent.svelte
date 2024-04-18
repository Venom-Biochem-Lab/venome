<script lang="ts">
	import Molstar from "../Molstar.svelte";
	import {
		BACKEND_URL,
		Backend,
		setToken,
		type ProteinEntry,
	} from "../backend";
	import ProteinLinkCard from "../ProteinLinkCard.svelte";
	import EditMode from "./EditMode.svelte";
	import * as d3 from "d3";
	import { createEventDispatcher } from "svelte";
	import { FloatingLabelInput } from "flowbite-svelte";

	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let id: number;
	export let name: string;
	export let alignedWithName: string | undefined = undefined;
	export let width: number = 500;
	export let height: number = 350;

	let editedName: string = name;
	let editedAlignedWithName: string | undefined = alignedWithName;
	let disabledSave = false;

	$: {
		disabledSave =
			editedName === name && editedAlignedWithName === alignedWithName;
	}

	const config = {
		hideControls: true,
		spin: false,
	};

	let entry: ProteinEntry | null;
	let alignEntry: ProteinEntry | null;

	async function fetchInfoCards(name: string, alignedWithName?: string) {
		entry = await Backend.getProteinEntry(name);
		if (alignedWithName) {
			alignEntry = await Backend.getProteinEntry(alignedWithName);
		}
	}

	$: fetchInfoCards(name, alignedWithName);
</script>

<EditMode
	bind:disabledSave
	on:save={async () => {
		setToken();
		await Backend.editArticleProteinComponent({
			componentId: id,
			newName: editedName ?? undefined,
			newAlignedWithName: editedAlignedWithName ?? undefined,
		});
		dispatch("change");
	}}
	on:cancel={() => {
		editedName = name;
		editedAlignedWithName = alignedWithName;
	}}
	on:delete={async () => {
		setToken();
		await Backend.deleteArticleComponent(id);
		dispatch("change");
	}}
	on:movedown={async () => {}}
	on:moveup={async () => {}}
>
	<slot>
		<div class="flex gap-3">
			<div class="flex gap-2 flex-col">
				{#if entry}
					<div>
						<ProteinLinkCard {entry} color={d3.schemeDark2[0]} />
					</div>
				{/if}
				{#if alignEntry}
					<div>
						<ProteinLinkCard
							entry={alignEntry}
							color={d3.schemeDark2[1]}
						/>
					</div>
				{/if}
			</div>
			<div>
				<Molstar
					url={`${BACKEND_URL}/protein/pdb/${name}${alignedWithName ? "/" + alignedWithName : ""}`}
					{width}
					{height}
					zIndex={1}
					hideControls={config.hideControls ?? true}
					spin={config.spin ?? false}
				/>
			</div>
		</div>
	</slot>
	<slot slot="edit"
		><div style="width: 500px;" class="p-5">
			<div style="width: 300px;" class="flex gap-5 flex-col">
				<FloatingLabelInput style="filled" bind:value={editedName}
					>Name</FloatingLabelInput
				>
				<FloatingLabelInput
					style="filled"
					bind:value={editedAlignedWithName}
					>Aligned With Name</FloatingLabelInput
				>
			</div>
		</div></slot
	>
</EditMode>
