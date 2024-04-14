<script lang="ts">
	import { Button } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import {
		CheckOutline,
		CloseOutline,
		EditOutline,
		TrashBinOutline,
	} from "flowbite-svelte-icons";
	const dispatch = createEventDispatcher<{
		save: undefined;
		delete: undefined;
		edit: undefined;
		cancel: undefined;
	}>();

	export let disabledSave: boolean = true;

	let editMode = false;
	let revealEdit = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:mouseenter={() => {
		if (!editMode) {
			revealEdit = true;
		}
	}}
	on:mouseleave={() => (revealEdit = false)}
	class:editing={editMode}
	class="text-component"
>
	{#if editMode}
		<slot name="edit" />
		<div class="flex justify-between p-1">
			<div>
				<Button
					outline
					size="xs"
					on:click={() => {
						editMode = false;
						dispatch("cancel");
					}}
				>
					<CloseOutline size="sm" class="mr-1" /> Cancel Edits</Button
				>
				<Button
					disabled={disabledSave}
					size="xs"
					on:click={async () => {
						editMode = false;
						dispatch("save");
					}}><CheckOutline size="sm" class="mr-1" />Save Edits</Button
				>
			</div>
			<Button
				size="xs"
				color="red"
				outline
				on:click={async () => {
					editMode = false;
					dispatch("delete");
				}}
				><TrashBinOutline size="sm" class="mr-1" /> Delete Forever</Button
			>
		</div>
	{:else}
		<slot />
	{/if}
	{#if revealEdit}
		<div style="position: absolute; left: -60px; top: 10px; width: 60px;">
			<Button
				size="xs"
				color="light"
				on:click={() => {
					editMode = true;
					revealEdit = false;
					dispatch("edit");
				}}><EditOutline size="xs" /> Edit</Button
			>
		</div>
	{/if}
</div>

<style>
	.text-component {
		padding: 5px;
		position: relative;
	}
	.editing {
		outline: 1px solid var(--primary-500);
		border-radius: 3px;
		background-color: var(--primary-100);
	}
</style>
