<script lang="ts">
	import logo from "../images/logo.svg";
	import { links } from "svelte-routing";
	import { onMount } from "svelte";
	import {
		UserOutline,
		SearchOutline,
		NewspapperSolid,
		UploadSolid,
		SearchSolid,
	} from "flowbite-svelte-icons";
	import { user } from "./stores/user";
	import Cookies from "js-cookie";
	import ProteinIcon from "../lib/ProteinIcon.svelte";

	onMount(async () => {
        /**
         * Checking if the user has a cookie. If they do, set user svelte store loggin attribute.
         * Done here because the header is loaded first, which means user can still directly navigate
         * to restricted pages if they refresh while logged in.
         */
		if (Cookies.get("auth")) {
			$user.loggedIn = true;
		}
	});
</script>

<header class="flex justify-between" use:links>
	<div class="nav-container">
		<div id="logo">
			<a href="/">
				<img src={logo} alt="Venome Logo" />
			</a>
		</div>
		<div class="nav">
			<a href="/search" class="flex items-center"
				><ProteinIcon width={35} height={35} />Proteins</a
			>
			<a href="/articles" class="flex items-center gap-1">
				<NewspapperSolid size="lg" />Articles</a
			>
			{#if $user.loggedIn}
				<a href="/upload" class="flex items-center gap-1">
					<UploadSolid size="lg" />Upload</a
				>
			{/if}
		</div>
	</div>

	<a href="/login" class="flex items-center gap-1 mr-5">
		<UserOutline size="lg" />
		{#if $user.loggedIn}
			Logout
		{:else}
			Login
		{/if}
	</a>
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
		color: var(--primary-700);
	}
	a:hover {
		color: var(--primary-800);
	}
</style>
