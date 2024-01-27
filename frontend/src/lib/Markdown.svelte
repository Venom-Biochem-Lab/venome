<script lang="ts">
	// https://marked.js.org/
	import { marked } from "marked";

	export let text = ``;
	// they recommend also sanitizing input text https://github.com/cure53/DOMPurify

	$: mdToHTML = marked(replaceCite(text));

	/**
	 * @todo this is a hacky way to do this, but it works for now
	 * Instead use the builtin extensions https://marked.js.org/using_pro#extensions
	 */
	function replaceCite(str: string) {
		// replace \cite{} with <a href="#ref-1">[1]</a>
		const newStr = str.replaceAll(/\\cite{(.+?)}/g, (match, p1) => {
			console.log(match, p1);
			return `[<a href="#${p1}">${p1}</a>]`;
		});
		return newStr;
	}
</script>

<div class="text-stone-700">
	{@html mdToHTML}
</div>
