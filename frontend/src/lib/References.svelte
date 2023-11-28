<script lang="ts">
	/* Put stuff here */
	import { parseBibFile, type BibEntry } from "bibtex";

	export let bibtex = String.raw``;
	$: bib = parseBibFile(bibtex);

	/**
	 * @returns string of authors
	 */
	function parseAuthors(entry: BibEntry) {
		const authors = entry.getFieldAsString("author") as string;
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

{#if bib.entries_raw.length > 0}
	{#each bib.entries_raw as entry, i}
		<div class="flex gap-2 mt-2">
			<div class="w-5">
				[{i + 1}]
			</div>
			<div>
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
{/if}
