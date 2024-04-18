<script lang="ts">
	import Article from "../../routes/Article.svelte";
	import Markdown from "../Markdown.svelte";
	import ProteinEntryComponent from "./ProteinEntryComponent.svelte";

	export let article: Article;
</script>

{JSON.stringify(article, null, 4)}

<!-- <div class="flex flex-col gap-5 mt-5 p-5">
	{#each components.toSorted((a, b) => a.order - b.order) as component, i}
		<div class="component flex justify-center">
			{#if component.type === "markdown"}
				<div style="width: 800px;">
					<Markdown text={String.raw`${component.data.content}`} />
				</div>
			{:else if component.type === "protein"}
				<ProteinEntryComponent data={component.data} />
			{:else if component.type === "image"}
				<img {...component.data.size} src={component.data.src} />
			{/if}
		</div>
	{/each}
</div> -->

<style>
	.component {
	}
</style>
