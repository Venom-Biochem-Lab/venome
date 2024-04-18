<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Article, setToken } from "../lib/backend";
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import TextComponent from "../lib/article/TextComponent.svelte";
	import ProteinComponent from "../lib/article/ProteinComponent.svelte";
	import ImageComponent from "../lib/article/ImageComponent.svelte";
	import { user } from "../lib/stores/user";

	export let articleTitle: string;

	const textWidth = "800px";
	let dropdownOpen = false;
	let article: Article;
	onMount(async () => {
		await refreshArticle();
	});

	async function refreshArticle() {
		try {
			article = await Backend.getArticle(articleTitle);
		} catch (e) {
			console.error(e);
		}
	}
</script>

<section class="p-5">
	{#if article}
		<div>
			<div class="flex gap-2 flex-col items-center">
				<div id="title" style="width: {textWidth};">
					{article.title}
				</div>
				{#each article.orderedComponents as c (c.id)}
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
							{articleTitle}
							id={c.id}
							name={c.name}
							alignedWithName={c.alignedWithName}
							on:change={async () => {
								await refreshArticle();
							}}
						/>
					{:else if c.componentType === "image"}
						<div
							style="width: {textWidth};"
							class="flex justify-center"
						>
							<ImageComponent
								{articleTitle}
								id={c.id}
								src={c.src}
								height={c.height}
								width={c.width}
								on:change={async () => {
									await refreshArticle();
								}}
							/>
						</div>
					{/if}
				{/each}
				{#if $user.loggedIn}
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
										setToken();
										await Backend.uploadArticleTextComponent(
											{
												articleId: article.id,
												markdown:
													"## Placeholder Text\nHover over this section and click **Edit** to edit.",
											}
										);
										await refreshArticle();
									} catch (e) {
										console.error(e);
									}
									dropdownOpen = false;
								}}>Text Component</DropdownItem
							>
							<DropdownItem
								on:click={async () => {
									try {
										setToken();
										await Backend.uploadArticleImageComponent(
											{
												articleId: article.id,
												src: "",
											}
										);
										await refreshArticle();
									} catch (e) {
										console.error(e);
									}
									dropdownOpen = false;
								}}>Image Component</DropdownItem
							><DropdownItem
								on:click={async () => {
									try {
										setToken();
										await Backend.uploadArticleProteinComponent(
											{
												articleId: article.id,
												name: "",
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
				{/if}
			</div>
		</div>
	{:else}
		Error, no article with name '{articleTitle}' found
	{/if}
</section>

<style>
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--primary-700);
	}
</style>
