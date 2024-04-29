<script lang="ts">
	import { Backend, setToken, type ProteinEntry } from "../lib/backend";
	import {
		Button,
		Input,
		Label,
		Helper,
		Select,
		Popover,
	} from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { onMount } from "svelte";
	import ArticleEditor from "../lib/ArticleEditor.svelte";
	import { user } from "../lib/stores/user";
	import { undoFormatProteinName } from "../lib/format";

	// key difference, here we get the information, then populate it in the upload form that can be edited
	// and reuploaded/edited
	export let urlId: string;

	// store original too so we can see if the user changed/edited the content

	let name: string;
	let ogName: string;
	let description: string;
	let ogDescription: string;
	let ogContent: string;
	let content: string;
	let ogRefs: string;
	let refs: string;
	let ogSpecies: string;
	let species: string;

	let uploadError = "";
	let entry: ProteinEntry | null = null;
	let error = false;
	let allSpecies: string[] | null;

	// when this component mounts, request protein wikipedia entry from backend
	onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}

		// Request the protein from backend given ID
		console.log("Requesting", urlId, "info from backend");

		entry = await Backend.getProteinEntry(urlId);
		// if we could not find the entry, the id is garbo
		if (entry == null) {
			error = true;
		} else {
			// keep track of db value and the value we change (og denotes original / db)
			name = undoFormatProteinName(entry.name); // replaces _ with " "
			ogName = name;

			content = entry.content ?? "";
			ogContent = content;

			refs = entry.refs ?? "";
			ogRefs = refs;

			species = entry.speciesName;
			ogSpecies = species;

			description = entry.description ?? "";
			ogDescription = description;
		}

		allSpecies = await Backend.searchSpecies();
	});
	$: changed =
		name !== ogName ||
		content !== ogContent ||
		refs !== ogRefs ||
		species !== ogSpecies ||
		ogDescription !== description;
</script>

<svelte:head>
	<title>Venome Edit {entry ? entry.name : ""}</title>
</svelte:head>

<section class="p-5">
	{#if entry}
		<div class="w-500 flex flex-col gap-5">
			<div>
				<Label
					color={uploadError ? "red" : undefined}
					for="protein-name"
					class="block mb-2">Protein Name</Label
				>
				<Input
					bind:value={name}
					color={uploadError ? "red" : "base"}
					style="width: 300px"
					id="protein-name"
					placeholder="Name"
				/>
				{#if uploadError}
					<Helper class="mt-2" color="red"
						>This name already exists, please create a unique name
						and resubmit</Helper
					>
				{/if}
			</div>

			<div>
				<Label for="protein-desc" class="block mb-2"
					>Protein Description</Label
				>
				<Input
					bind:value={description}
					style="width: 600px"
					id="protein-desc"
					placeholder="Description"
				/>
			</div>

			<div class="flex gap-5 mb-2">
				<div>
					<Label for="species-select" class="mb-2"
						>Select a Species</Label
					>
					{#if allSpecies}
						<Select
							id="species-select"
							items={allSpecies.map((s) => ({
								name: s,
								value: s,
							}))}
							bind:value={species}
						/>
					{:else}
						<Helper color="red">Error loading species</Helper>
					{/if}
				</div>
			</div>

			<div>
				<ArticleEditor bind:content bind:refs />
			</div>
			<div>
				<Button
					on:click={async () => {
						if (entry) {
							try {
								setToken();
								const editSuccessful =
									await Backend.editProteinEntry({
										newName: name,
										oldName: entry.name,
										newSpeciesName: species,
										oldSpeciesName: ogSpecies,
										newContent:
											content !== ogContent
												? content
												: undefined,
										newRefs:
											refs !== ogRefs ? refs : undefined,
										newDescription:
											description !== ogDescription
												? description
												: undefined,
									});
								// success, so we can go back, but now with the new name stored in the db.
								navigate(
									`/protein/${editSuccessful.editedName}`
								);
								uploadError = ""; // no upload error to report
							} catch (e) {
								// in this case, there was some edit error so we should display it
								uploadError = String(e);
							}
						}
					}}
					disabled={!changed || name.length === 0}
					>Edit Protein</Button
				>

				<Button outline on:click={() => navigate(`/protein/${urlId}`)}
					>Cancel</Button
				>
			</div>
			<div>
				<Button id="del-prot" color="red">Delete Protein Entry</Button>
				<Popover
					arrow={false}
					placement="right-end"
					trigger="click"
					triggeredBy="#del-prot"
					title="Confirm"
				>
					<div>
						Are you sure you want to delete this protein?
						<br />
						The protein will be deleted forever.
					</div>
					<div class="mt-2">
						<Button
							color="red"
							size="sm"
							on:click={async () => {
								try {
									setToken();
									await Backend.deleteProteinEntry(urlId);
									navigate("/search");
								} catch (e) {
									console.error(e);
								}
							}}>Confirm Delete</Button
						>
					</div>
				</Popover>
			</div>
		</div>
	{/if}
</section>
