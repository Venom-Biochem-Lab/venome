<script lang="ts">
	import logo from "$lib/images/logo.svg";
</script>

<header>
	<div class="nav-container">
		<div id="logo">
			<a href="/">
				<img src={logo} alt="Venome Logo" />
			</a>
		</div>
		<div class="nav">
			<a href="/">Home</a>
			<a href="/upload">Upload</a>
		</div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: #08163803;
		box-shadow: 0px 0px 2px 2px hsla(0, 0%, 0%, 0.1);
		height: 60px;
	}

	#logo {
		/* TODO remove these hard coded constraints and do it right */
		margin-top: 10px;
		height: 45px;
		width: 100px;
	}

	.nav-container {
		display: flex;
		height: 60px;
		gap: 20px;
		margin-left: 20px;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 15px;
		font-size: 18px;
		font-weight: 300;
	}

	a {
		color: var(--darkblue);
	}
	a:hover {
		color: var(--darkblue);
	}
</style>
