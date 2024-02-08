<script>
	export let count = 0;
	export let increment = 1;
</script>

<div class="counter">
	Count is {count}
</div>

<button
	on:click={() => {
		count -= increment;
	}}>Decrement</button
>
<button
	on:click={() => {
		count += increment;
	}}>Increment</button
>

<style>
	.counter {
		font-size: 100px;
	}
</style>
