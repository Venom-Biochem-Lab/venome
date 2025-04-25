<script lang="ts">
	import { link } from "svelte-routing";
	import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { Backend, type SimilarProtein } from "./backend";
	import { undoFormatProteinPDB } from "./format";
	import AlignBlock from "./AlignBlock.svelte";
	import Dot from "./Dot.svelte";
	import DelayedSpinner from "./DelayedSpinner.svelte";

	export let queryProteinName: string;
	export let length: number;

	let similarProteins: SimilarProtein[];
	let errorEncountered = false;
	let maxEvalue: number;

	// For PDB Alignment. Currently not working

	// let venomeLink: string;
	// let uuid: string;
	// async function createLink(venomeProtein, pdbProtein){
	// 	try{
	// 		venomeLink = " https://venome.cqls.oregonstate.edu/backend/protein/pdb/" + venomeProtein;
	// 		uuid = await Backend.getPDBLink(venomeLink, pdbProtein);
	// 		window.
	// 	} catch(e){
	// 		console.error(e);
	// 		errorEncountered = true;
	// 	}
	// }

	onMount(async () => {
		try {
			console.log("mounted");
			similarProteins =
				await Backend.searchPDBSimilar(queryProteinName);
			maxEvalue = similarProteins
				? Math.max(...similarProteins.map((p) => p.evalue))
				: 0;
		} catch (e) {
			console.error(e);
			console.error(
				"NEED TO DOWNLOAD FOLDSEEK IN THE SERVER. SEE THE SERVER ERROR MESSAGE."
			);
			errorEncountered = true;
		}
	});
</script>

{#if similarProteins === undefined && !errorEncountered}
	<DelayedSpinner
		text="Computing Foldseek on the entire PDB100 Database..."
		textRight
		msDelay={0}
	/>
{:else if similarProteins !== undefined}
	<div style="max-height: 300px; overflow-y: scroll; overflow-x: hidden;">
		<table>
			<tr>
				<th class="name-cell"> Name </th>
				<th class="evalue-cell"> E-Value </th>
				<th class="prob-cell"> Prob. Match</th>
				<th class="region-cell"> Region of Similarity </th>
			</tr>
			{#each similarProteins as protein, i}
				<tr class="pdb-row">
					<td>
						<div class="name-cell">
							<!-- TODO: figure out how to make this a simple route instead of reloading the entire page -->
							<a
								href="https://www.rcsb.org/structure/{protein.name.substring(0,4)}"
								class="flex gap-1 items-center"
							>
							{undoFormatProteinPDB(protein.name)}
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
						<div class="region-cell">
							<AlignBlock
								width={260}
								height={20}
								ogLength={length}
								qstart={protein.qstart}
								qend={protein.qend}
							/>
						</div>
					</td>
				</tr>
			{/each}
		</table>
	</div>
{:else}
	Error in the in the backend. Please contact admins.
{/if}

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
		position: sticky;
		top: 0;
		background-color: white;
		color: var(--primary-700);
	}
	.pdb-row {
		background-color: hsl(0, 0%, 0%, 0.02);
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
		region-items: center;
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

	.name-cell {
		width: 250px;
	}
	.evalue-cell {
		width: 150px;
	}
	.prob-cell {
		width: 120px;
	}
	.region-cell {
		width: 290px;
		padding-left: 10px;
		padding-right: 30px;
	}
	.align-cell {
		width: 100px;
	}
</style>
