<script lang="ts">
	import { Backend, UploadError } from "$lib/backend";
	import {
		Fileupload,
		Button,
		Input,
		Label,
		Helper,
		Textarea,
		Tabs,
		TabItem,
		Card,
		Heading,
	} from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { formatProteinName } from "$lib/format";
	import Markdown from "$lib/Markdown.svelte";
	import References from "$lib/References.svelte";

	let name: string = "";
	let content: string = "";
	let files: FileList | undefined; // bind:files on the Fileupload
	let uploadError: UploadError | undefined;
	let refs = "";
	$: file = files ? files[0] : undefined; // we're just concerned with one file
	$: console.log(content);

	function fileToBase64(f: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(f);
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = reject;
		});
	}
</script>

<section>
	<div class="w-500 flex flex-col gap-5">
		<div>
			<Label
				color={uploadError ? "red" : undefined}
				for="protein-name"
				class="block mb-2">Protein Name</Label
			>
			<Input
				bind:value={name}
				color={uploadError ? "red" : "base"}
				style="width: 300px"
				id="protein-name"
				placeholder="Name"
			/>
			{#if uploadError && uploadError === UploadError.NAME_NOT_UNIQUE}
				<Helper class="mt-2" color="red"
					>This name already exists, please create a unique name and resubmit</Helper
				>
			{/if}
		</div>

		<Card
			class="max-w-full"
			style="height: 600px; overflow-y: scroll; padding: 0; padding-top: 4px; padding-left: 4px;"
		>
			<Tabs contentClass="bg-none p-5" style="underline">
				<TabItem title="article content" open>
					<div>
						<Label for="content" class="block mb-2"
							>Protein Article (Markdown)</Label
						>
						<Textarea
							id="content"
							placeholder="Enter markdown..."
							rows={12}
							bind:value={content}
						/>
					</div>

					<div class="mt-3">
						<Label for="refs" class="block mb-2">References (BibTeX)</Label>
						<Textarea
							id="refs"
							placeholder="Enter bibtex with atleast an id, title, and author (optionally url and year)"
							rows={4}
							bind:value={refs}
						/>
					</div>
				</TabItem>
				<TabItem title="preview">
					{#if content.length > 0 || refs.length > 0}
						<Card class="max-w-full">
							<Heading tag="h4">Article</Heading>
							<Markdown text={content} />
						</Card>

						<Card class="max-w-full mt-5">
							<Heading tag="h4">References</Heading>
							<References bibtex={String.raw`${refs}`} />
						</Card>
					{:else}
						No content to render/preview
					{/if}
				</TabItem>
			</Tabs>
		</Card>

		<div>
			<Fileupload class="w-100" bind:files />
		</div>
		<div>
			<Button
				on:click={async () => {
					if (file === undefined || name === "") return; // no file selected

					const base64Encoding = await fileToBase64(file);
					try {
						const err = await Backend.uploadProteinEntry({
							name,
							pdbFileBase64: base64Encoding,
							content,
							refs,
						});
						if (err) {
							uploadError = err;
							console.log(uploadError);
						} else {
							// success, so we can go back!
							goto(`/protein/${formatProteinName(name)}`);
						}
					} catch (e) {
						console.log(e);
					}
				}}
				disabled={file === undefined || name === ""}
				>Upload and Publish Protein</Button
			>
		</div>
	</div>
</section>
