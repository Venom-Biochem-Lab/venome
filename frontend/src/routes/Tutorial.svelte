<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";
	import EntryCard from "../lib/EntryCard.svelte";
	import References from "../lib/References.svelte";
	import Markdown from "../lib/Markdown.svelte";
	import { Button } from "flowbite-svelte";
	import { navigate } from "svelte-routing";
	import { PenOutline } from "flowbite-svelte-icons";
	import { user } from "../lib/stores/user";

	export let tutorialTitle: string;

	let tutorial: Tutorial;
	onMount(async () => {
		tutorial = await Backend.getTutorial(tutorialTitle);
	});
</script>

<section class="p-5">
	{#if tutorial}
		<h1 id="title">
			{tutorial.title}

			{#if $user.loggedIn}
				<Button
					outline
					size="xs"
					on:click={() => navigate(`/tutorial/edit/${tutorialTitle}`)}
					><PenOutline class="mr-2" size="sm" />Edit Tutorial
				</Button>
			{/if}
		</h1>
		<div id="description">
			{#if tutorial.description}
				{tutorial.description}
			{/if}
		</div>
		{#if tutorial.content}
			{#if tutorial.content}
				<EntryCard title="Article">
					<Markdown text={tutorial.content} />
				</EntryCard>
			{/if}
			{#if tutorial.refs}
				<EntryCard title="References">
					<References bibtex={String.raw`${tutorial.refs}`} />
				</EntryCard>
			{/if}
		{/if}
	{/if}
</section>

<style>
	#title {
		font-size: 2.45rem;
		font-weight: 500;
		color: var(--primary-700);
	}
</style>
