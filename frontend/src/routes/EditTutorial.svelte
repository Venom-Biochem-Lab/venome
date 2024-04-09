<script lang="ts">
	import { Backend, UploadError, setToken } from "../lib/backend";
	import { Button, Input, Label, Helper } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import ArticleEditor from "../lib/ArticleEditor.svelte";
	import { onMount } from "svelte";
	import { user } from "../lib/stores/user";

	export let tutorialTitle: string;

	let titleOriginal: string = "";
	let descriptionOriginal: string = "";
	let refsOriginal: string = "";
	let contentOriginal: string = "";

	let titleEdited: string = "";
	let descriptionEdited: string = "";
	let refsEdited: string = "";
	let contentEdited: string = "";

	let uploadError: boolean = false;

	onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}

		try {
			const tutorial = await Backend.getTutorial(tutorialTitle);
			titleOriginal = tutorial.title;
			titleEdited = titleOriginal;

			descriptionOriginal = tutorial.description ?? "";
			descriptionEdited = descriptionOriginal;

			refsOriginal = tutorial.refs ?? "";
			refsEdited = refsOriginal;

			contentOriginal = tutorial.content ?? "";
			contentEdited = contentOriginal;
		} catch (e) {
			console.log("error!");
		}
	});

	function returnIfEditedElseNone(oldString: string, newString: string) {
		if (oldString === newString) {
			return undefined;
		} else {
			return newString;
		}
	}

	$: wasEdited =
		titleEdited !== titleOriginal ||
		descriptionEdited !== descriptionOriginal ||
		refsEdited !== refsOriginal ||
		contentEdited !== contentOriginal;
</script>

<svelte:head>
	<title>Tutorial Upload</title>
</svelte:head>

<section class="p-5">
	<div class="w-500 flex flex-col gap-5">
		<div>
			<Label
				color={uploadError ? "red" : undefined}
				for="tutorial-title"
				class="block mb-2"
			>
				Title *</Label
			>
			<Input
				bind:value={titleEdited}
				color={uploadError ? "red" : "base"}
				style="width: 300px"
				id="tutorial-title"
				placeholder="Enter a unique title..."
			/>
			{#if uploadError}
				<Helper class="mt-2" color="red"
					>This name already exists, please create a unique name and
					resubmit</Helper
				>
			{/if}
		</div>

		<div>
			<Label for="tutorial-desc" class="block mb-2">Description</Label>
			<Input
				bind:value={descriptionEdited}
				style="width: 600px"
				id="tutorial-desc"
				placeholder="Enter a description (optional)..."
			/>
		</div>

		<div>
			<ArticleEditor
				bind:content={contentEdited}
				bind:refs={refsEdited}
			/>
		</div>

		<div>
			<Button
				on:click={async () => {
					try {
						setToken();
						await Backend.editTutorial({
							title: titleOriginal, // how to id the tutorial
							// changes (put as undefined if not changed)
							newTitle: returnIfEditedElseNone(
								titleOriginal,
								titleEdited
							),
							newDescription: returnIfEditedElseNone(
								descriptionOriginal,
								descriptionEdited
							),
							newContent: returnIfEditedElseNone(
								contentOriginal,
								contentEdited
							),
							newRefs: returnIfEditedElseNone(
								refsOriginal,
								refsEdited
							),
						});
						navigate(`/tutorial/${titleEdited}`);
					} catch (e) {
						uploadError = true;
					}
				}}
				disabled={!wasEdited}>Edit Tutorial</Button
			>
			<Button
				outline
				on:click={() => navigate(`/tutorial/${tutorialTitle}`)}
				>Cancel</Button
			>
		</div>
	</div>
</section>
