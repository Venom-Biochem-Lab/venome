<script lang="ts">
	import { onMount } from "svelte";
	import {
		Backend,
		type Article,
		type ArticleTextComponent,
		type ArticleProteinComponent,
	} from "../lib/backend";
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import TextComponent from "../lib/article/TextComponent.svelte";
	import ProteinComponent from "../lib/article/ProteinComponent.svelte";

	export let articleTitle: string;

	const textWidth = "800px";
	let dropdownOpen = false;
	let article: Article;
	onMount(async () => {
		await refreshArticle();
	});
	let combined: (ArticleTextComponent | ArticleProteinComponent)[] = [];
	$: if (article) {
		combined = combineAndOrderComponents(article);
	}

	function combineAndOrderComponents(
		article: Article
	): (ArticleTextComponent | ArticleProteinComponent)[] {
		return [
			...article.textComponents,
			...article.proteinComponents,
		].toSorted((a, b) => a.componentOrder - b.componentOrder);
	}

	async function refreshArticle() {
		try {
			article = await Backend.getArticle(articleTitle);
		} catch (e) {
			console.error(e);
		}
	}
</script>

<section class="p-5">
	{#if article && combined}
		<div>
			<div class="flex gap-2 flex-col items-center">
				<div id="title" style="width: {textWidth};">
					{article.title}
				</div>
				{#each combined as c (`${c.componentType}-${c.id}`)}
					{#if c.componentType === "text"}
						<div style="width: {textWidth};">
							<TextComponent
								{articleTitle}
								markdown={c.markdown}
								id={c.id}
								on:change={async () => {
									await refreshArticle();
								}}
							/>
						</div>
					{:else if c.componentType === "protein"}
						<ProteinComponent
							id={c.id}
							name={c.name}
							alignedWithName={c.alignedWithName}
							on:change={async () => {
								await refreshArticle();
							}}
						/>
					{/if}
				{/each}
				<div class="mt-5" style="width: {textWidth};">
					<Button
						outline
						color="light"
						on:click={() => (dropdownOpen = true)}
						>+ Add New Component</Button
					>
					<Dropdown open={dropdownOpen}>
						<DropdownItem
							on:click={async () => {
								try {
									await Backend.uploadArticleTextComponent({
										forArticleTitle: articleTitle,
										componentOrder:
											combined.reduce(
												(prev, cur) =>
													cur.componentOrder > prev
														? cur.componentOrder
														: prev,
												0
											) + 1,
										markdown:
											"## Placeholder Text\nHover over this section and click **Edit** to edit.",
									});
									await refreshArticle();
								} catch (e) {
									console.error(e);
								}
								dropdownOpen = false;
							}}>Text/Markdown Component</DropdownItem
						>
						<DropdownItem
							on:click={async () => {
								if (!combined) return;
								try {
									await Backend.uploadArticleProteinComponent(
										{
											forArticleTitle: articleTitle,
											componentOrder:
												combined.reduce(
													(prev, cur) =>
														cur.componentOrder >
														prev
															? cur.componentOrder
															: prev,
													0
												) + 1,
											name: "b",
											alignedWithName: undefined,
										}
									);
									await refreshArticle();
								} catch (e) {
									console.error(e);
								}
								dropdownOpen = false;
							}}>Protein Component</DropdownItem
						>
					</Dropdown>
				</div>
			</div>
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
