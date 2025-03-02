<script lang="ts">
	export let title: string = "TITLE";
	export let desc: string = "DESCRIPTION";
	export let href: string = "";
	export let width: number = 400;
	export let onClick: (() => void) | undefined = undefined; //  onClick prop

	let hovering = false;

	function handleClick(event: MouseEvent) {
		if (onClick) {
			event.preventDefault(); // Prevent *default* link behavior
			onClick();  // Call the custom onClick handler
		}
		//  No else clause needed. If onClick is NOT defined,
        // the default link behavior (following the href) will occur.
	}
</script>

<a
	style="width: {width}px; display: block; text-decoration: none; cursor: pointer;"
	class="big-nav-link"
	href={href}
	on:click={handleClick}  on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	title="Click to go to {href}"
	target={href.startsWith("http") ? "_blank" : "_self"}
	rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
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
</a>

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