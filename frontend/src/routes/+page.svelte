<script lang="ts">
	let fakeData = [
		{
			name: "Donny",
			age: 21,
		},
		{
			name: "Donny2",
			age: 22,
		},
		{
			name: "Donny3",
			age: 23,
		},
	];
</script>

{#each fakeData as d}
	<div>{d.name}</div>
{/each}

<style>
	.massive {
		font-size: 100px;
	}
</style>
