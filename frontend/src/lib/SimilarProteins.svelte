<script lang="ts">
	import { link } from "svelte-routing";
	import { LinkOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { Backend, type SimilarProtein } from "../lib/backend";
	import { undoFormatProteinName } from "./format";

	export let queryProteinName: string;

	let similarProteins: SimilarProtein[] = [];
	onMount(async () => {
		try {
			similarProteins =
				await Backend.searchVenomeSimilar(queryProteinName);
		} catch (e) {
			console.error(e);
			console.error(
				"NEED TO DOWNLOAD FOLDSEEK IN THE SERVER. SEE THE SERVER ERROR MESSAGE."
			);
		}
	});
</script>

<div style="max-height: 300px; overflow-y: scroll;">
	<table>
		<tr>
			<th> Name </th>
			<th> Probability Match</th>
			<th> E-Value </th>
			<th> Description </th>
			<th> Compare </th>
		</tr>
		{#each similarProteins as protein}
			<tr class="pdb-row">
				<td>
					<!-- TODO: figure out how to make this a simple route instead of reloading the entire page -->
					<a href="/protein/{protein.name}"
						><LinkOutline size="sm" />
						{undoFormatProteinName(protein.name)}</a
					>
				</td>
				<td>{protein.prob}</td>
				<td>{protein.evalue}</td>
				<td class="pdb-desc">{protein.description}</td>
				<td>
					<a href="/compare/{queryProteinName}/{protein.name}"><LinkOutline size="sm" />Compare</a>
				</td>
			</tr>
		{/each}
	</table>
</div>

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
		width: 5px;
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
	/* width */
	::-webkit-scrollbar {
		width: 3px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
