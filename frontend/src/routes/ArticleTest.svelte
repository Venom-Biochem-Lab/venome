<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		TabItem,
		Tabs,
		Textarea,
		Card,
	} from "flowbite-svelte";
	import ArticleRenderer from "../lib/article/ArticleRenderer.svelte";
	import CreateComponent from "../lib/article/CreateComponent.svelte";

	const dummyText =
		"akshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjhakshdkj ashdkjashdkjashd kjashd kjashdash djsadkj ashdhhdhdhsah djashd kajshdkjashdkjashdkashdkjasdhaksjhdaskjhdaskjhd akjsdhaksjhdakjshdaskjhdaskjhds jahskjdakjdahsk dhasdashdjasdkjashdkjashdkjashdkjh   ";

	/* Put stuff here */
	// let components = [
	// 	{
	// 		order: 1,
	// 		type: "markdown",
	// 		data: {
	// 			content:
	// 				"# Article Test\nThis is a test article." +
	// 				dummyText +
	// 				dummyText,
	// 		},
	// 	},
	// 	{
	// 		order: 2,
	// 		type: "protein",
	// 		data: {
	// 			name: "Gh_comp244_c0_seq1",
	// 		},
	// 	},
	// 	{
	// 		order: 3,
	// 		type: "markdown",
	// 		data: {
	// 			content: "This is a test article. **what**???" + dummyText,
	// 		},
	// 	},
	// 	{
	// 		order: 4,
	// 		type: "protein",
	// 		data: {
	// 			name: "Gh_comp244_c0_seq1",
	// 			alignName: "Lh14_comp1630_c0_seq5",
	// 		},
	// 	},
	// 	{
	// 		order: 5,
	// 		type: "markdown",
	// 		data: {
	// 			content: "lots more text. with links [here]() " + dummyText,
	// 		},
	// 	},
	// 	{
	// 		order: 6,
	// 		type: "image",
	// 		data: {
	// 			src: "/favicon.png",
	// 			size: {
	// 				width: 200,
	// 			},
	// 		},
	// 	},
	// 	{
	// 		order: 7,
	// 		type: "markdown",
	// 		data: {
	// 			content: "## new section\n" + dummyText,
	// 		},
	// 	},
	// 	{
	// 		order: 8,
	// 		type: "protein",
	// 		data: {
	// 			name: "Gh_comp1786_c0_seq1",
	// 			alignName: "Gh_comp2027_c0_seq6",
	// 			hideControls: false,
	// 			width: 1000,
	// 			height: 600,
	// 			spin: true,
	// 		},
	// 	},
	// 	{
	// 		order: 9,
	// 		type: "markdown",
	// 		data: {
	// 			content: "## new section\n" + dummyText,
	// 		},
	// 	},
	// ];

	// 1. add markdown component
	let create: any[] = [];
	let dropdownOpen = false;
</script>

<div class="flex flex-col gap-5 p-5">
	<div>
		{#each create as c}
			<div
				style="width: 800px; border: 1px solid var(--primary-700); border-radius: 5px; padding: 15px; background-color: var(--primary-100);"
			>
				{#if c.type === "markdown"}
					<div>
						<div>Text/Markdown Component</div>
						<Textarea rows={12} value={c.data.content} />
						<Button
							on:click={() => {
								// make req to backend with new data
								console.log(c);
							}}>Save</Button
						>
						<Button>Delete</Button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div>
		<Button on:click={() => (dropdownOpen = true)}>+ Add Component</Button>
		<Dropdown open={dropdownOpen}>
			<DropdownItem
				on:click={() => {
					// make req to backend with new data component
					// then request all data again
					dropdownOpen = false;
				}}>Text/Markdown Component</DropdownItem
			>
			<DropdownItem>Protein Component</DropdownItem>
		</Dropdown>
	</div>
</div>
