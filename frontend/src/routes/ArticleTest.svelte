<script lang="ts">
	import Markdown from "../lib/Markdown.svelte";
	import ProteinEntryComponent from "../lib/article/ProteinEntryComponent.svelte";

	const dummyText =
		"akshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjh   ";

	/* Put stuff here */
	let components = [
		{
			order: 1,
			type: "markdown",
			data: {
				content:
					"# Article Test\nThis is a test article." +
					dummyText +
					dummyText,
			},
		},
		{
			order: 2,
			type: "protein",
			data: {
				name: "Gh_comp244_c0_seq1",
			},
		},
		{
			order: 3,
			type: "markdown",
			data: {
				content: "This is a test article. **what**???" + dummyText,
			},
		},
		{
			order: 4,
			type: "protein",
			data: {
				name: "Gh_comp244_c0_seq1",
				alignName: "Lh14_comp1630_c0_seq5",
			},
		},
		{
			order: 5,
			type: "markdown",
			data: {
				content: "lots more text. with links [here]() " + dummyText,
			},
		},
		{
			order: 6,
			type: "image",
			data: {
				src: "/favicon.png",
				size: {
					width: 200,
				},
			},
		},
		{
			order: 7,
			type: "markdown",
			data: {
				content: "## new section\n" + dummyText,
			},
		},
		{
			order: 8,
			type: "protein",
			data: {
				name: "Gh_comp1786_c0_seq1",
				alignName: "Gh_comp2027_c0_seq6",
				hideControls: false,
				width: 1000,
				height: 800,
			},
		},
		{
			order: 9,
			type: "markdown",
			data: {
				content: "## new section\n" + dummyText,
			},
		},
	];
</script>

<div class="flex flex-col gap-5 mt-5 p-5">
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
</div>

<style>
	.component {
	}
</style>
