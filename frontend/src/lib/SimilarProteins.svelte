<script lang="ts">
	import { LinkOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { Backend } from "$lib/backend";
	import type { SimilarProtein } from "$lib/backend";
	import { Spinner } from "flowbite-svelte";

	export let queryProteinName: string;
	let showing = 5;

	let similarProteins: SimilarProtein[] = [];
	onMount(async () => {
		similarProteins = await Backend.getSimilarPdb(queryProteinName);
	});
</script>

<table>
	{#if similarProteins.length > 0}
		<tr>
			<th> Source </th>
			<th> Desc. </th>
			<th> Prob. </th>
		</tr>
		{#each { length: Math.min(showing, similarProteins.length) } as _, i}
			{@const protein = similarProteins[i]}
			{@const pdbId = protein.name.toUpperCase()}
			<tr class="pdb-row">
				<td>
					<a href="https://www.rcsb.org/structure/{pdbId}"
						><LinkOutline size="sm" />PDB:{pdbId}</a
					>
				</td>
				<td class="pdb-desc">DEscDEscDEscDEsc DEscDEsc DEsc DEsc </td>
				<td>{protein.prob}</td>
			</tr>
		{/each}
		{#if similarProteins.length > showing}
			<div class="text-gray-400 cursor-pointer" on:click={() => (showing += 5)}>
				... click to see more
			</div>
		{/if}
	{:else}
		Computing Similar PDB proteins w/ Foldseek <Spinner />
	{/if}
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
