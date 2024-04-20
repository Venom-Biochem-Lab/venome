<script lang="ts">
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import {
		CheckOutline,
		CloseOutline,
		EditOutline,
		TrashBinOutline,
		CirclePlusSolid,
		PlusSolid,
		ArrowUpSolid,
	} from "flowbite-svelte-icons";
	import { Backend, InsertComponent, setToken } from "../backend";
	const dispatch = createEventDispatcher<{
		save: undefined;
		delete: undefined;
		edit: undefined;
		cancel: undefined;
		movedown: undefined;
		moveup: undefined;
		insertAbove: undefined;
	}>();

	export let articleId: number;
	export let componentId: number;
	export let disabledSave: boolean = true;
	export let forceHideEdit = false;

	let editMode = false;
	let revealEdit = false;
	let dropdownOpen = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
	on:mouseenter={() => {
		if (!editMode) {
			revealEdit = true;
		}
	}}
	on:mouseleave={() => {
		revealEdit = false;
		dropdownOpen = false;
	}}
	class:editing={editMode}
	class="edit-container"
	style={revealEdit && !forceHideEdit
		? "outline: 1px solid lightgrey; border-radius: 5px;"
		: ""}
>
	{#if editMode && !forceHideEdit}
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
					try {
						setToken();
						await Backend.deleteArticleComponent(
							articleId,
							componentId
						);
					} catch (e) {
						console.error(e);
					}
					dispatch("delete");
				}}
				><TrashBinOutline size="sm" class="mr-1" /> Delete Forever</Button
			>
		</div>
	{:else}
		<slot />
	{/if}
	{#if revealEdit && !forceHideEdit}
		<div
			style="position: absolute; left: -180px; top: -10px; width: 180px; z-index: 998; padding: 10px;"
			class="flex gap-2"
		>
			<Button
				size="xs"
				color="light"
				on:click={() => {
					dropdownOpen = true;
				}}
			>
				Insert
				<ArrowUpSolid size="sm" class="rotate-180" />
			</Button>
			<Dropdown open={dropdownOpen} placement="top">
				{#each Object.entries(InsertComponent.componentType) as [name, t]}
					<DropdownItem
						on:click={async () => {
							try {
								await Backend.insertComponentAbove({
									articleId,
									componentId,
									componentType: t,
								});
								dropdownOpen = false;
								revealEdit = false;
								dispatch("save");
							} catch (e) {
								console.error(e);
							}
						}}>{name} Component</DropdownItem
					>
				{/each}
			</Dropdown>
			<Button
				size="xs"
				color="light"
				on:click={() => {
					editMode = true;
					revealEdit = false;
					dispatch("edit");
				}}><EditOutline size="sm" /> Edit</Button
			>
		</div>
	{/if}
</div>

<style>
	.edit-container {
		position: relative;
	}
	.editing {
		outline: 1px solid var(--primary-500);
		border-radius: 3px;
		background-color: var(--primary-100);
	}
	.add-up {
		position: absolute;
		top: -5px;
		left: 0;
		height: 10px;
		width: 100%;
		transition: all 0.2s ease-in-out;
	}
	.add-up:hover {
		background-color: var(--primary-200);
		cursor: pointer;
	}
</style>
