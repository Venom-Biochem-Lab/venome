<script lang="ts">
	/* Put stuff here */
	import { parseBibFile, type BibEntry, BibFilePresenter } from "bibtex";

	export let bibtex = String.raw``;
	let bib: BibFilePresenter;
	$: {
		try {
			bib = parseBibFile(bibtex);
		} catch (e) {
			console.log("error in syntax");
		}
	}

	/**
	 * @returns string of authors
	 */
	function parseAuthors(entry: BibEntry) {
		const authors = entry.getFieldAsString("author");
		// if a number or not found, error in parsing, so do nothing
		if (!authors || typeof authors === "number")
			return "[error in parsing authors]";

		const parsed = authors.split(" and ").map((author) =>
			author
				.split(",")
				.map((d) => d.trim())
				.reverse()
				.join(" ")
		);
		return new Intl.ListFormat("en").format(parsed);
	}
</script>

{#if bib}
	{#each bib.entries_raw as entry, i}
		<div class={i > 0 ? "mt-5" : ""} id={entry._id}>
			<div class="bg-gray-50 text-gray-400">
				[<span style="font-size: 15px;">{entry._id}</span>]
			</div>
			<div class="border-l-2 border-gray-400 pl-2">
				<div style="font-size: 17px;">
					{#if entry.getFieldAsString("url")}
						<a href={`${entry.getFieldAsString("url")}`}>
							<b>
								{entry.getFieldAsString("title")}
							</b>
						</a>
					{:else}
						<b>
							{entry.getFieldAsString("title")}
						</b>
					{/if}
				</div>

				<p>{parseAuthors(entry)}</p>
				{#if entry.getFieldAsString("journal")}
					<i>
						{entry.getFieldAsString("journal")}
						{entry.getFieldAsString("year")}
					</i>
				{/if}
			</div>
		</div>
	{/each}
{:else}
	<span class="text-red-700 font-bold"> BibTeX Syntax Error </span>
{/if}
