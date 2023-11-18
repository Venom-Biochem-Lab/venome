<script lang="ts">
	// https://marked.js.org/
	import { marked } from "marked";

	export let text = ``;
	// they recommend also sanitizing input text https://github.com/cure53/DOMPurify
	$: mdToHTML = marked(text);
</script>

{@html mdToHTML}
