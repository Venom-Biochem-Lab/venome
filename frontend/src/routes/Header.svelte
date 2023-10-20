<script lang="ts">
	import logo from "$lib/images/logo.svg";
	import github from "$lib/images/github.svg";
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="Venome Logo" />
		</a>
	</div>

	<div class="corner">
		<a href="https://github.com/xnought/venome">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: hsla(15, 98%, 51%, 0.164);
		box-shadow: 0px 0px 3px 2px hsla(0, 0%, 0%, 0.208);
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
