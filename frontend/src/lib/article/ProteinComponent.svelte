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
	import Placeholder from "./Placeholder.svelte";

	const dispatch = createEventDispatcher<{ change: undefined }>();

	export let articleId: number;
	export let id: number;
	export let name: string;
	export let alignedWithName: string | undefined = undefined;
	export let width: number = 500;
	export let height: number = 350;
	export let editMode = false;

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

	let entry: ProteinEntry | null = null;
	let alignEntry: ProteinEntry | null = null;

	$: if (name !== "") {
		Backend.getProteinEntry(name).then((result) => (entry = result));
	} else {
		entry = null;
	}
	$: if (alignedWithName !== undefined && alignedWithName !== "") {
		Backend.getProteinEntry(alignedWithName).then(
			(result) => (alignEntry = result)
		);
	} else {
		alignEntry = null;
	}
</script>

<EditMode
	{articleId}
	componentId={id}
	forceHideEdit={!editMode}
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
	on:change={() => {
		dispatch("change");
	}}
>
	<slot>
		{#if entry !== null}
			<div class="flex gap-3">
				<div class="flex gap-2 flex-col">
					{#if entry}
						<div>
							<ProteinLinkCard
								{entry}
								color={d3.schemeDark2[0]}
							/>
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
		{:else}
			<Placeholder name="protein component" color="steelblue" />
		{/if}
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
