<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Article } from "../lib/backend";
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import ArticleRenderer from "../lib/article/ArticleRenderer.svelte";

	export let articleTitle: string;

	let dropdownOpen = false;

	let article: Article;
	onMount(async () => {
		try {
			article = await Backend.getArticle(articleTitle);
		} catch (e) {
			console.error(e);
		}
	});
</script>

<section class="p-5">
	{#if article}
		<div id="title">{article.title}</div>
		<div>
			{#each article.textComponents as a}
				<div>{a.componentOrder} {a.markdown}</div>
			{/each}
		</div>
		<div class="mt-5">
			<Button outline color="light" on:click={() => (dropdownOpen = true)}
				>+ Add Component</Button
			>
			<Dropdown open={dropdownOpen}>
				<DropdownItem
					on:click={async () => {
						try {
							await Backend.uploadArticleTextComponent({
								forArticleTitle: articleTitle,
								componentOrder:
									article.textComponents.length + 1,
								markdown: "## header",
							});
							try {
								article =
									await Backend.getArticle(articleTitle);
							} catch (e) {
								console.error(e);
							}
						} catch (e) {
							console.error(e);
						}
						dropdownOpen = false;
					}}>Text/Markdown Component</DropdownItem
				>
				<DropdownItem>Protein Component</DropdownItem>
			</Dropdown>
		</div>
	{:else}
		Error, no article with name '{articleTitle}'
	{/if}
</section>

<style>
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--primary-700);
	}
</style>
