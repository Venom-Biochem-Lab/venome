<script lang="ts">
	import { Label, Input, Button, Helper, Textarea } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { Backend, setToken, type Article } from "../lib/backend";
	import { onMount } from "svelte";
	export let articleTitle: string;

	let title: string = "";
	let description: string = "";
	let refs: string = "";

	let articlesExists = true;
	let error = false;
	let article: Article;
	onMount(async () => {
		try {
			article = await Backend.getArticle(articleTitle);
		} catch (e) {
			console.error(e);
			articlesExists = false;
		}

		title = article.title;
		description = article.description ?? "";
		refs = article.refs ?? "";
	});

	function wasEdited(title: string, description: string, refs: string) {
		if (!article) return false;

		let descriptionEdited = false;
		const descriptionNullInDB =
			article.description === null || article.description === undefined;
		if (descriptionNullInDB) {
			// then I reassigned description to be ""
			descriptionEdited = description !== ""; // so anything other than "" would be edited
		} else {
			// if there is something, it was edited if diff
			descriptionEdited = description !== article.description;
		}

		let refsEdited = false;
		const refsNullInDB =
			article.refs === null || article.refs === undefined;
		if (refsNullInDB) {
			// then I reassigned description to be ""
			refsEdited = refs !== ""; // so anything other than "" would be edited
		} else {
			// if there is something, it was edited if diff
			refsEdited = refs !== article.refs;
		}
		return (
			(refsEdited || descriptionEdited || title !== article.title) &&
			title !== ""
		);
	}
</script>

<section class="p-5">
	{#if articlesExists}
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
						>This title already exists, please create a unique title
						and resubmit</Helper
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
			<div>
				<Label for="desc" class="block mb-2">References (BibTeX)</Label>
				<Textarea
					bind:value={refs}
					rows={20}
					placeholder="Enter BibTeX..."
				/>
			</div>
		</div>
		<div class="mt-5">
			<Button
				on:click={async () => {
					try {
						setToken();
						await Backend.editArticleMetadata({
							articleTitle: article.title,
							newArticleTitle:
								title !== article.title ? title : undefined,
							newDescription:
								description.length > 0 ? description : null,
							newRefs: refs.length > 0 ? refs : null,
						});
						navigate(`/article/edit/${title}`);
					} catch (e) {
						error = true;
						console.error(e);
					}
				}}
				disabled={!wasEdited(title, description, refs)}
				>Edit Article</Button
			>
			<Button
				outline
				on:click={() => {
					navigate(`/article/edit/${title}`);
				}}>Cancel</Button
			>
		</div>
		<div class="mt-2">
			<Button
				color="red"
				on:click={async () => {
					try {
						setToken();
						await Backend.deleteArticle(article.title);
						navigate(`/articles`);
					} catch (e) {
						console.error(e);
					}
				}}>Delete Article</Button
			>
		</div>
	{:else}
		Article with the title '{articleTitle}' does not exist. So cannot be
		edited.
	{/if}
</section>
