<script lang="ts">
	import { link } from "svelte-routing";
	import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { Backend, type SimilarProtein } from "../lib/backend";
	import { undoFormatProteinName } from "./format";
	import AlignBlock from "./AlignBlock.svelte";
	import Dot from "./Dot.svelte";

	export let queryProteinName: string;
	export let length: number;

	let similarProteins: SimilarProtein[] = [];
	let maxEvalue: number;
	onMount(async () => {
		try {
			similarProteins =
				await Backend.searchVenomeSimilar(queryProteinName);
			maxEvalue = similarProteins
				? Math.max(...similarProteins.map((p) => p.evalue))
				: 0;
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
			<th> E-Value </th>
			<th> Prob. Match</th>
			<th> Alignment Region </th>
			<th> TMAlign Superimpose 3D</th>
		</tr>
		{#each similarProteins as protein, i}
			<tr class="pdb-row">
				<td>
					<div class="name-cell">
						<!-- TODO: figure out how to make this a simple route instead of reloading the entire page -->
						<a href="/protein/{protein.name}">
							{undoFormatProteinName(protein.name)}
							<ArrowUpRightFromSquareOutline size="sm" />
						</a>
					</div>
				</td>
				<td>
					<div class="evalue-cell flex gap-2 items-center">
						<Dot
							diameter={10}
							maxColor="var(--primary-700)"
							normalizedValue={protein.evalue / maxEvalue}
						/>
						<code>{protein.evalue.toExponential()}</code>
					</div>
				</td>
				<td
					><div class="prob-cell flex gap-2 items-center">
						<Dot
							diameter={10}
							maxColor="var(--primary-700)"
							normalizedValue={protein.prob}
						/>
						<code>{protein.prob}</code>
					</div></td
				>
				<td>
					<div class="align-cell">
						<AlignBlock
							width={200}
							height={20}
							ogLength={length}
							qstart={protein.qstart}
							qend={protein.qend}
						/>
					</div>
				</td>
				<td>
					<div class="compare-cell">
						<a
							use:link
							href="/compare/{queryProteinName}/{protein.name}"
							>Compare <ArrowUpRightFromSquareOutline
								size="sm"
							/></a
						>
					</div>
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
