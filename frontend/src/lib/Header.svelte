<script lang="ts">
	import logo from "../images/logo.svg";
	import { links } from "svelte-routing";
	import {
		UploadOutline,
		UserOutline,
		TableRowOutline,
		BookOutline,
	} from "flowbite-svelte-icons";
	import {user} from "./stores/user"
</script>

<header class="flex justify-between" use:links>
	<div class="nav-container">
		<div id="logo">
			<a href="/">
				<img src={logo} alt="Venome Logo" />
			</a>
		</div>
		<div class="nav">
			<a href="/search" class="flex items-center gap-1"
				><TableRowOutline size="lg" />Search</a
			>
			{#if $user.loggedIn}
			<a href="/upload" class="flex items-center gap-1">
				<UploadOutline size="lg" />Upload</a
			>
			{/if}
			<a href="/tutorials" class="flex items-center gap-1">
				<BookOutline size="lg" />Tutorials</a
			>
		</div>
	</div>

	<a href="/login" class="flex items-center gap-1 mr-5">
		<UserOutline size="lg" />Login</a
	>
</header>
<div style="height: 60px;" />

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: #08163803;
		box-shadow: 0px 0px 2px 2px hsla(0, 0%, 0%, 0.1);
		height: 60px;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 998;
		backdrop-filter: blur(10px);
	}

	#logo {
		/* TODO remove these hard coded constraints and do it right */
		height: 45px;
		width: 100px;
	}

	.nav-container {
		display: flex;
		height: 60px;
		gap: 20px;
		margin-left: 20px;
		align-items: center;
	}

	.nav {
		display: flex;
		gap: 20px;
		font-size: 18px;
		font-weight: 300;
		margin-left: 10px;
	}

	a {
		color: var(--darkblue);
	}
	a:hover {
		color: var(--darkblue);
	}
</style>
