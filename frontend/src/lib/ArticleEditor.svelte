<script lang="ts">
	import {
		Card,
		Tabs,
		TabItem,
		Heading,
		Label,
		Textarea,
	} from "flowbite-svelte";
	import Markdown from "$lib/Markdown.svelte";
	import References from "$lib/References.svelte";
	export let refs = "";
	export let content = "";
</script>

<Card
	class="max-w-full"
	style="height: 600px; overflow-y: scroll; padding: 0; padding-top: 4px; padding-left: 4px;"
>
	<Tabs contentClass="bg-none p-5" style="underline">
		<TabItem title="article content" open>
			<div>
				<Label for="content" class="block mb-2"
					>Protein Article (Markdown)</Label
				>
				<Textarea
					id="content"
					placeholder="Enter markdown..."
					rows={12}
					bind:value={content}
				/>
			</div>

			<div class="mt-3">
				<Label for="refs" class="block mb-2">References (BibTeX)</Label>
				<Textarea
					id="refs"
					placeholder="Enter bibtex with atleast an id, title, and author (optionally url and year)"
					rows={4}
					bind:value={refs}
				/>
			</div>
		</TabItem>
		<TabItem title="preview">
			{#if content.length > 0 || refs.length > 0}
				<Card class="max-w-full">
					<Heading tag="h4">Article</Heading>
					<Markdown text={content} />
				</Card>

				<Card class="max-w-full mt-5">
					<Heading tag="h4">References</Heading>
					<References bibtex={String.raw`${refs}`} />
				</Card>
			{:else}
				No content to render/preview
			{/if}
		</TabItem>
	</Tabs>
</Card>
