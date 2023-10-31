<script lang="ts">
	// at some point, this should be change to request from the backend
	const allProteinEntries = [
		{
			name: "Protein A",
		},
		{
			name: "Protein B",
		},
		{
			name: "Protein C",
		},
	];
</script>

<!-- akin to <head /> in html -->
<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>All Protein Entries</h1>

	<!-- TODO: Organize this into a better looking table  -->
	<div class="entries">
		{#each allProteinEntries as entry}
			<div class="entry">
				<!-- routes to the protein entry itself (new page) -->
				<a href="/protein/{entry.name}">{entry.name}</a>
			</div>
		{/each}
	</div>
</section>

<style>
	.entries {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
