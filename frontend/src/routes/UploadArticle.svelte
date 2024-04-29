<script lang="ts">
	import { Label, Input, Button, Helper } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { Backend, setToken } from "../lib/backend";
    import { onMount } from "svelte";
    import { user } from "../lib/stores/user";
	let title: string = "";
	let description: string = "";
	let error = false;
    onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}
    })
</script>

<section class="p-5">
	<div class="flex flex-col gap-5">
		<div>
			<Label for="article-title" class="block mb-2">Title *</Label>
			<Input
				color={error ? "red" : "base"}
				bind:value={title}
				style="width: 300px"
				id="article-title"
				placeholder="Enter a unique title..."
			/>
			{#if error}
				<Helper class="mt-2" color="red"
					>This title already exists, please create a unique title and
					resubmit</Helper
				>
			{/if}
		</div>
		<div>
			<Label for="desc" class="block mb-2">Description</Label>
			<Input
				bind:value={description}
				style="width: 600px"
				id="desc"
				placeholder="Enter a unique description... (optional)"
			/>
		</div>
	</div>
	<div class="mt-5">
		<Button
			on:click={async () => {
				try {
					setToken();
					await Backend.uploadArticle({
						title,
						description:
							description.length > 0 ? description : null,
					});
					navigate(`/article/${title}`);
				} catch (e) {
					error = true;
					console.error(e);
				}
			}}
			disabled={title === ""}>Create Article</Button
		>
	</div>
</section>
