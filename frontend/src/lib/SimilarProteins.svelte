<script lang="ts">
	import { link } from "svelte-routing";
	import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
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
			<th> Alignment </th>
			<th> 3D Superimpose TMAlign</th>
		</tr>
		{#each similarProteins as protein}
			<tr class="pdb-row">
				<td style="align-text: end;">
					<!-- TODO: figure out how to make this a simple route instead of reloading the entire page -->
					<a href="/protein/{protein.name}">
						{undoFormatProteinName(protein.name)}
						<ArrowUpRightFromSquareOutline size="sm" />
					</a>
				</td>
				<td>{protein.prob}</td>
				<td>{protein.evalue.toExponential()}</td>
				<td>blah blah</td>
				<td>
					<a
						use:link
						href="/compare/{queryProteinName}/{protein.name}"
						>Compare <ArrowUpRightFromSquareOutline size="sm" /></a
					>
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
		background-color: hsl(var(--darkblue-hsl), 0.04);
	}
	.pdb-desc {
		width: 5px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	a {
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
