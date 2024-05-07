<script lang="ts">
	import { onMount } from "svelte";
	import { BACKEND_URL, Backend, type ProteinEntry } from "../lib/backend";
	import BigNavLink from "../lib/BigNavLink.svelte";
	import Molstar from "../lib/Molstar.svelte";
	import ProteinLinkCard from "../lib/ProteinLinkCard.svelte";
	import { colorScheme } from "../lib/venomeMolstarUtils";
	import { Card } from "flowbite-svelte";
	import EntryCard from "../lib/EntryCard.svelte";

	const quickLinks = [
		{
			title: "Search for Venom Proteins",
			desc: "Search over 400 proteins parasitoid wasp venom proteins using filtering or search.",
			href: "/search",
		},
		{
			title: "Read Interactive Articles",
			desc: "Learn about our proteins, how the site works, research, and more!",
			href: "/articles",
		},
		{
			title: "Upload New Proteins",
			desc: "Upload new proteins or create new articles for others to view.",
			href: "/upload",
		},
		{
			title: "Completely Open Source",
			desc: "This sites code is completely open source on GitHub.",
			href: "https://github.com/xnought/venome",
		},
	];

	let randomProtein: ProteinEntry;
	onMount(async () => {
		randomProtein = await Backend.getRandomProtein();
		console.log(randomProtein);
	});
</script>

<svelte:head>
	<title>Venome Home</title>
</svelte:head>

<div class="bg-gradient-to-b from-primary-700 to-primary-500">
	<div
		style="color: white; padding-left: 40px; padding-top: 30px; padding-bottom: 40px;"
	>
		<div style="font-size: 30px; font-weight: 100;">The Unknown</div>
		<div style="font-size: 55px; margin-top: -20px;">Venome</div>
		<div style="font-size: 22px; font-weight: 200;">
			A platform that stores and visualizes the <u>
				<a
					style="color: white; font-weight: 500;"
					href="https://venombiochemistrylab.weebly.com/"
					target="_blank">Venom Biochemistry Lab</a
				>
			</u>’s Proteins at Oregon State University
		</div>
	</div>
</div>

<section class="p-5 flex gap-5 flex-col">
	<div class="flex justify-center">
		<div class="flex gap-5 flex-wrap">
			{#each quickLinks as q}
				<BigNavLink {...q} />
			{/each}
		</div>
	</div>

	{#if randomProtein}
		<div>
			<EntryCard title="Random Protein" style="margin-top: 0;">
				<div class="flex gap-5">
					<div>
						<ProteinLinkCard
							color={colorScheme[0]}
							entry={randomProtein}
						/>
					</div>
					<div>
						<Molstar
							format="pdb"
							url="{BACKEND_URL}/protein/pdb/{randomProtein.name}"
							width={600}
							height={500}
							zIndex={990}
							hideCanvasControls={[
								"animation",
								"controlToggle",
								"selection",
								"expand",
								"controlInfo",
							]}
						/>
					</div>
				</div>
			</EntryCard>
		</div>
	{/if}
	<div>About us here</div>
</section>

<style>
</style>
