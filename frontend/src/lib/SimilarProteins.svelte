<script lang="ts">
	import { LinkOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";

	export let queryProteinName: string;

	let similarProteins: any[] = [];
	onMount(async () => {
		similarProteins = await similarPDBProteins(queryProteinName);
	});

	async function similarPDBProteins(queryProteinName: string) {
		// TODO: QUERY TO BACKEND WITH ACTUAL CALL INSTEAD OF MOCK DATA
		const similarExternalProteins = [
			{
				source: "pdb",
				link: "https://www.rcsb.org/structure/1A0S",
				name: "1A0S",
				prob: 0.99,
			},
			{
				source: "pdb",
				link: "https://www.rcsb.org/structure/1A0S",
				name: "1A0S",
				prob: 0.99,
			},
			{
				source: "pdb",
				link: "https://www.rcsb.org/structure/1A0S",
				name: "1A0S",
				prob: 0.99,
			},
		];

		return similarExternalProteins;
	}
</script>

<table>
	<tr>
		<th> Source </th>
		<th> Name </th>
		<th> Desc. </th>
		<th> Prob. </th>
	</tr>
	{#each similarProteins as protein}
		<tr class="pdb-row">
			<td>
				<a href={protein.link}
					><LinkOutline size="sm" /> {protein.source.toUpperCase()}</a
				>
			</td>
			<td>{protein.name}</td>
			<td class="pdb-desc">DEscDEscDEscDEsc DEscDEsc DEsc DEsc </td>
			<td>{protein.prob}</td>
		</tr>
	{/each}
	<span class="text-gray-400 cursor-pointer">... click to see more</span>
</table>

<style>
	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: separate; /* Add this line */
		border-spacing: 0 5px; /* Adjust as needed */
	}
	th {
		font-weight: 500;
		text-align: left;
	}
	.pdb-row {
		background-color: hsl(var(--lightorange-hsl), 0.11);
	}
	.pdb-desc {
		min-width: 70px;
		max-width: 70px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	a {
		color: var(--lightorange);
		display: flex;
		gap: 1px;
		align-items: center;
	}
</style>
