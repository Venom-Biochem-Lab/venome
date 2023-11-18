<script lang="ts">
	// https://marked.js.org/
	import { marked } from "marked";

	export let text = ``;
	$: mdToHTML = marked(text);
</script>

{@html mdToHTML}
