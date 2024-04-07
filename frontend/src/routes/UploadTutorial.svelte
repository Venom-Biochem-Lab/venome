<script lang="ts">
	import { Backend, UploadError, setToken } from "../lib/backend";
	import { Button, Input, Label, Helper } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import ArticleEditor from "../lib/ArticleEditor.svelte";
	import { onMount } from "svelte";
	import { user } from "../lib/stores/user";

	onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}
	});

	let title: string = "";
	let refs: string = "";
	let description: string = "";
	let content: string = "";
	let uploadError: boolean = false;
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
				bind:value={title}
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
				bind:value={description}
				style="width: 600px"
				id="tutorial-desc"
				placeholder="Enter a description (optional)..."
			/>
		</div>

		<div>
			<ArticleEditor bind:content bind:refs />
		</div>

		<div>
			<Button
				on:click={async () => {
					try {
						setToken();
						await Backend.uploadTutorial({
							title,
							description,
							content,
							refs,
						});
						navigate(`/tutorial/${title}`);
					} catch (e) {
						uploadError = true;
					}
				}}
				disabled={title === ""}>Upload and Publish Tutorial</Button
			>
		</div>
	</div>
</section>
