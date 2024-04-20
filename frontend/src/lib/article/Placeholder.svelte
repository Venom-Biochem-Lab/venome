<script lang="ts">
	export let name = "";
	export let color = "var(--primary-700)";
</script>

<div
	style="--color: {color};"
	class="placeholder flex items-center justify-center"
>
	{name} placeholder
</div>

<style>
	.placeholder {
		--color: red;
		outline: var(--color) solid 1px;
		color: var(--color);
		border-radius: 5px;
		width: 800px;
		height: 100px;
		font-size: 25px;
		font-weight: 200;
		text-transform: uppercase;
	}
</style>
