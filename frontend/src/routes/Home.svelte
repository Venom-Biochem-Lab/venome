<script lang="ts">
	import BigNavLink from "../lib/BigNavLink.svelte";

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
			title: "Upload",
			desc: "Upload new proteins or create new articles for others to view.",
			href: "/upload",
		},
		{
			title: "Open Source Code",
			desc: "See our GitHub repository and contribute to the project.",
			href: "https://github.com/xnought/venome",
		},
	];
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

<section class="p-5">
	<div class="flex gap-5 flex-wrap">
		{#each quickLinks as q}
			<BigNavLink {...q} />
		{/each}
	</div>

	<div>Random protein here</div>
	<div>About us here</div>
</section>

<style>
</style>
