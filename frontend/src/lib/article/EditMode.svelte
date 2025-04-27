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
	import {
		Backend,
		type InsertComponent,
		type MoveComponent,
		setToken,
	} from "../backend";

	const dispatch = createEventDispatcher<{
		save: undefined;
		delete: undefined;
		edit: undefined;
		cancel: undefined;
		change: undefined;
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
		? "background-color: var(--primary-100);"
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
					dispatch("change");
				}}
				><TrashBinOutline size="sm" class="mr-1" /> Delete Forever</Button
			>
		</div>
	{:else}
		<slot />
	{/if}
	{#if revealEdit && !forceHideEdit}
		<div
			style="position: absolute; left: -180px; top: 0; width: 180px; z-index: 998; padding: 10px; padding-top: 0;"
			class="flex gap-2"
		>
			<div class="flex gap-2 flex-wrap">
				<Button
					size="xs"
					color="light"
					on:click={async () => {
						try {
							setToken();
							await Backend.moveComponent({
								articleId,
								componentId,
								direction: MoveComponent.direction.UP,
							});
							revealEdit = false;
							dispatch("change");
						} catch (e) {
							console.error(e);
						}
					}}
				>
					Move <ArrowUpSolid size="sm" class="rotate-180" />
				</Button>

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
				<Dropdown open={dropdownOpen} placement="bottom-end">
					{#each Object.entries(InsertComponent.componentType) as [name, t]}
						<DropdownItem
							on:click={async () => {
								try {
									setToken();
									await Backend.insertComponentAbove({
										articleId,
										componentId,
										componentType: t,
									});
									dropdownOpen = false;
									revealEdit = false;
									dispatch("change");
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
					on:click={async () => {
						try {
							setToken();
							await Backend.moveComponent({
								articleId,
								componentId,
								direction: MoveComponent.direction.DOWN,
							});
							revealEdit = false;
							dispatch("change");
						} catch (e) {
							console.error(e);
						}
					}}
				>
					Move <ArrowUpSolid size="sm" /></Button
				>
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
