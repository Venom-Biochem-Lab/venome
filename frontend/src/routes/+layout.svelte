<script lang="ts">
	import "../app.postcss";
	import Header from "./Header.svelte";
	import "./styles.css";
</script>

<div class="app">
	<Header />

	<main class="p-10">
		<slot />
	</main>
</div>
