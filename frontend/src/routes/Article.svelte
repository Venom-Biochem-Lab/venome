<script lang="ts">
	import { onMount, setContext } from "svelte";
	import {
		Backend,
		type Article,
		setToken,
		InsertBlankComponentEnd,
	} from "../lib/backend";
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import {
		ArrowLeftOutline,
		CirclePlusSolid,
		EditOutline,
	} from "flowbite-svelte-icons";
	import TextComponent from "../lib/article/TextComponent.svelte";
	import ProteinComponent from "../lib/article/ProteinComponent.svelte";
	import ImageComponent from "../lib/article/ImageComponent.svelte";
	import { user } from "../lib/stores/user";
	import { navigate } from "svelte-routing";
	import { dbDateToMonthDayYear } from "../lib/format";
	import { componentTypes } from "../lib/article/articleUtils";

	export let articleTitle: string;
	export let editMode = false;

	const textWidth = "800px";
	let dropdownOpen = false;
	let article: Article;
	let notFound = false;
	onMount(async () => {
		await refreshArticle();
	});

	async function refreshArticle() {
		try {
			article = await Backend.getArticle(articleTitle);
		} catch (e) {
			console.error(e);
			notFound = true;
		}
	}
</script>

<section class="p-5">
	{#if article}
		<div>
			<div class="flex gap-2 flex-col items-center">
				<div id="header" style="width: {textWidth};">
					{#if editMode && $user.loggedIn}
						<div class="flex gap-2 items-center">
							<Button
								color="light"
								outline
								size="xs"
								on:click={async () => {
									navigate(`/article/${articleTitle}`);
								}}
								><ArrowLeftOutline class="mr-1" size="sm" />Back
								to viewing
							</Button>
							Edit a component by hovering and click <b>Edit</b> or
							edit the metadata/header.
						</div>
					{/if}
					<div id="title">
						{article.title}
						{#if !editMode && $user.loggedIn}
							<Button
								color="light"
								outline
								size="xs"
								on:click={async () => {
									navigate(`/article/edit/${articleTitle}`);
								}}
								><EditOutline class="mr-1" size="sm" />Edit
								Article
							</Button>
						{:else if editMode && $user.loggedIn}
							<Button
								color="light"
								outline
								size="xs"
								on:click={async () => {
									navigate(
										`/article/meta/edit/${articleTitle}`
									);
								}}
								><EditOutline class="mr-1" size="sm" />Edit
								Article Metadata
							</Button>
						{/if}
					</div>
					{#if article.description}
						<div id="desc">
							{article.description}
						</div>
					{/if}
					{#if article.datePublished}
						<div id="date">
							Published: {dbDateToMonthDayYear(
								article.datePublished
							)}
						</div>
					{/if}
				</div>
				{#each article.orderedComponents as c (c.id)}
					<div style="position: relative;">
						{#if c.componentType === "text"}
							<div style="width: {textWidth};">
								<TextComponent
									articleId={article.id}
									{editMode}
									markdown={c.markdown}
									id={c.id}
									on:change={async () => {
										await refreshArticle();
									}}
								/>
							</div>
						{:else if c.componentType === "protein"}
							<ProteinComponent
								articleId={article.id}
								{editMode}
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
									articleId={article.id}
									{editMode}
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
					</div>
				{/each}
				{#if $user.loggedIn && editMode}
					<div class="mt-5" style="width: {textWidth};">
						<Button
							outline
							color="light"
							on:click={() => (dropdownOpen = true)}
							>+ Add New Component</Button
						>
						<Dropdown open={dropdownOpen}>
							{#each Object.entries(InsertBlankComponentEnd.componentType) as [name, t]}
								<DropdownItem
									on:click={async () => {
										try {
											setToken();
											await Backend.insertBlankComponentEnd(
												{
													articleId: article.id,
													componentType: t,
												}
											);
											await refreshArticle();
										} catch (e) {
											console.error(e);
										}
										dropdownOpen = false;
									}}>{name} Component</DropdownItem
								>
							{/each}
						</Dropdown>
					</div>
				{/if}
			</div>
		</div>
	{:else if notFound}
		{articleTitle} not found
	{/if}
</section>

<style>
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--primary-700);
	}
	#desc {
		color: var(--primary-700);
		opacity: 0.8;
	}
	#date {
		color: var(--primary-700);
		opacity: 0.4;
		font-size: smaller;
	}
</style>
