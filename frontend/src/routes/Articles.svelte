<script lang="ts">
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { Backend, type Article } from "../lib/backend";
	import { dbDateToMonthDayYear } from "../lib/format";

	let articles: Article[] = [];
	onMount(async () => {
		try {
			articles = await Backend.getAllArticlesMetadata();
		} catch (e) {
			console.error(e);
		}
	});
</script>

<div class="p-5">
	<div id="article-header">Articles</div>
	<div class="articles-container">
		{#each articles as a}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="article"
				on:click={() => {
					navigate(`/article/${a.id}`);
				}}
			>
				{#if a.datePublished}
					<div class="article-date">
						{dbDateToMonthDayYear(a.datePublished)}
					</div>
				{/if}
				<div class="article-title">{a.title}</div>
				{#if a.description}
					<div class="article-desc">
						{a.description}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.articles-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		gap: 10px;
	}
	.article {
		--border-opacity: 0.2;
		display: flex;
		flex-direction: column;
		outline: hsla(0, 0%, 0%, var(--border-opacity)) 1px solid;
		border-radius: 5px;
		width: 300px;
		padding-left: 15px;
		padding-bottom: 15px;
		padding-top: 15px;
		box-sizing: border-box;
		transition: all 0.2s ease-in-out;
		align-self: start;
	}
	.article:hover {
		transform: scale(1.02);
		--border-opacity: 0.3;
		box-shadow: 0 1px 2px 2px #00000010;
		cursor: pointer;
	}

	.article-title {
		font-size: 1.2em;
		color: var(--primary-700);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.article-desc {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 300;

		@supports (-webkit-line-clamp: 3) {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: initial;

			display: -webkit-box;

			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
	.article-date {
		font-size: smaller;
		opacity: 0.4;
	}

	#article-header {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--primary-700);
	}
</style>
