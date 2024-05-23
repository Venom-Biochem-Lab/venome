<script lang="ts">
	import { onMount } from "svelte";
	import { backendUrl, Backend, type ProteinEntry } from "../lib/backend";
	import BigNavLink from "../lib/BigNavLink.svelte";
	import Molstar from "../lib/Molstar.svelte";
	import ProteinLinkCard from "../lib/ProteinLinkCard.svelte";
	import {
		colorEntireChain,
		colorScheme,
		jsColorToResidueColor,
	} from "../lib/venomeMolstarUtils";
	import EntryCard from "../lib/EntryCard.svelte";
	import * as d3 from "d3";

	const quickLinks = [
		{
			title: "Search for Venom Proteins",
			desc: "Search over 400 proteins parasitoid wasp venom proteins using filtering or search. <b>Sneak peak below ↓</b>",
			href: "/proteins",
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
			href: "https://github.com/venom-biochem-lab/venome",
		},
	];

	const numRandomProteins = 4;
	const homeColorScheme = [
		colorScheme[0],
		colorScheme[1],
		d3.schemeSet1[1],
		d3.schemeSet1[0],
	]; // add more colors here if you increase numRandomProteins
	let randomProteins: ProteinEntry[] = new Array(2).fill(undefined);
	onMount(async () => {
		for (let i = 0; i < randomProteins.length; i++) {
			randomProteins[i] = await Backend.getRandomProtein();
		}
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

	<div class="flex justify-center">
		<div>
			<div class="flex gap-2 mb-2">
				<span class="font-medium">Sneak Peak ↓</span>
				<span class="font-light"
					>Here's a couple random proteins from our database</span
				>
			</div>
			<div class="flex gap-5 flex-wrap content-start">
				{#each randomProteins.filter((d) => d !== undefined) as randomProtein, i}
					{@const hexColor = homeColorScheme[i]}
					<div class="flex gap-5 flex-col">
						<ProteinLinkCard
							color={hexColor}
							entry={randomProtein}
						/>
						<div>
							<Molstar
								spin
								format="pdb"
								url={backendUrl(
									`protein/pdb/${randomProtein.name}`
								)}
								width={375}
								height={350}
								zIndex={990}
								hideCanvasControls={[
									"animation",
									"controlToggle",
									"selection",
									"expand",
									"controlInfo",
								]}
								chainColors={{
									A: colorEntireChain(
										jsColorToResidueColor(hexColor),
										randomProtein.length
									),
								}}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div>
		<EntryCard title="Who created Venome?" style="margin-top: 5px;">
			<div>
				<div style="font-weight: 300;" class="flex gap-2 flex-col">
					<div style="width: 400px;">
						<img
							src="group-2024.jpg"
							width="400"
							alt="Founding Venome team picture in 2024."
						/>
					</div>
					<div>
						This website started in Fall 2023 as a Senior Computer
						Science Capstone project in collaboration with the <a
							href="https://venombiochemistrylab.weebly.com/"
							target="_blank"
							>Venom Biochemistry and Molecular Biology Laboratory</a
						> at Oregon State University.
					</div>
					<div>
						Why the name? Just as a collection of genes is a genome,
						a collection of venom proteins is a venome.
					</div>
					<div>
						Pictured here, the founding group was <a
							href="https://donnybertucci.com"
							target="_blank">Donald Bertucci</a
						>,
						<a href="http://ansengarvin.com" target="_blank"
							>Ansen Garvin</a
						>,
						<a
							href="https://www.linkedin.com/in/cora-bailey-a08004243/"
							target="_blank">Cora Bailey</a
						>,
						<a
							href="https://www.linkedin.com/in/amanda-sinha-310b6921b/"
							target="_blank">Amanda Sinha</a
						>,
						<a
							href="https://biochem.oregonstate.edu/directory/michael-youkhateh"
							target="_blank">Michael Youkhateh</a
						>, and
						<a
							href="https://biochem.oregonstate.edu/directory/nathan-mortimer"
							target="_blank">Nathan Mortimer</a
						>.
					</div>
				</div>
			</div>
		</EntryCard>
	</div>
</section>

<style>
</style>
