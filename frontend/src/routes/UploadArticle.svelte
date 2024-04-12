<script lang="ts">
	import { Label, Input, Button } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { Backend, setToken } from "../lib/backend";
	let title: string = "";
</script>

<section class="p-5">
	<Label for="article-title" class="block mb-2">Title *</Label>
	<Input
		bind:value={title}
		style="width: 300px"
		id="article-title"
		placeholder="Enter a unique title..."
	/>
	<div class="mt-5">
		<Button
			on:click={async () => {
				try {
					setToken();
					await Backend.uploadArticle({ title });
					navigate(`/article/${title}`);
				} catch (e) {
					console.error(e);
				}
			}}
			disabled={title === ""}>Create Article Template</Button
		>
	</div>
</section>
