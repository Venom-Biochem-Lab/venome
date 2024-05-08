<script lang="ts">
	import { navigate } from "svelte-routing";

	export let width = 400;
	export let title = "TITLE";
	export let desc = "DESCRIPTION";
	export let href = "";
	let hovering = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	style="width: {width}px; "
	class="big-nav-link"
	on:click={() => {
		navigate(href);
	}}
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	title="Click to go to {href}"
>
	<div>
		<div class="title-nav">{title}</div>
		<div class="desc-nav">{@html desc}</div>
	</div>
	<div class={hovering ? "arrow-icon-active" : "arrow-icon"}>
		<svg
			width="60"
			height="60"
			viewBox="0 0 52 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M31.7559 19.8702L18.8802 32.7459M31.7559 19.8702L32.4368 28.4746M31.7559 19.8702L23.1515 19.1893"
				stroke="#193F5A"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
</div>

<style>
	.arrow-icon {
		position: absolute;
		right: 5px;
		top: 5px;
		opacity: 0.25;
		transition: all 0.2s ease-in-out;
	}
	.arrow-icon-active {
		position: absolute;
		right: 0;
		top: 0;
		opacity: 1;
		transition: all 0.2s ease-in-out;
	}
	.big-nav-link {
		position: relative;
		background-color: hsla(205, 57%, 23%, 0.05);
		border-radius: 5px;
		padding: 30px;
		padding-top: 20px;
		padding-bottom: 20px;
		transition: all 0.2s ease-in-out;
	}
	.big-nav-link:hover {
		cursor: pointer;
		background-color: hsla(205, 57%, 23%, 0.2);
	}

	.title-nav {
		font-size: 22px;
		font-weight: 500;
		color: var(--primary-800);
	}
	.desc-nav {
		font-size: 19px;
		font-weight: 200;
		color: hsla(205, 57%, 23%, 0.7);
	}
</style>
