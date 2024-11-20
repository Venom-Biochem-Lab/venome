<script lang="ts">
	import { links } from "svelte-routing";
	import { onMount } from "svelte";
	import {
		UserOutline,
		UserAddOutline,
		NewspapperSolid,
		UploadSolid,
	} from "flowbite-svelte-icons";
	import { user } from "./stores/user";
	import Cookies from "js-cookie";
	import ProteinIcon from "../lib/ProteinIcon.svelte";
	import Logo from "../lib/Logo.svelte";

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

<header class="flex justify-between" style="z-index: 999;" use:links>
	<div class="nav-container">
		<div id="logo">
			<a href="/">
				<Logo height={45} width={100} />
			</a>
		</div>
		<div class="nav">
			<a href="/proteins" class="flex items-center"
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

	<div class="user-container">
		<!-- svelte-ignore empty-block -->
		{#if $user.loggedIn}
			<!-- TODO: User Profile Page -->
		{:else}
			<a href="/signup" class="signup flex items-center mr-5">
				<UserAddOutline size="lg" />
				Sign Up
			</a>
		{/if}


		<a href="/login" class="login flex items-center gap-1 mr-5">
			<UserOutline size="lg" />
			{#if $user.loggedIn}
				Logout
			{:else}
				Login
			{/if}
		</a>
	</div>

</header>
<div style="height: 60px;" />

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: hsla(0, 0%, 100%, 0.5);
		box-shadow: 0px 0px 2px 2px hsla(0, 0%, 0%, 0.1);
		height: 60px;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 998;
		backdrop-filter: blur(20px);
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

	.user-container {
		display: flex;
		height: 60px;
		align-items: center;
	}

	.signup {
		background-color: var(--primary-700);
		color: white;
		border-radius: 5px;
		padding: 5px 10px;
	}

	.login {
		border: 1px solid var(--primary-700);
		border-radius: 5px;
		padding: 4px 9px;
	}

	a {
		color: var(--primary-700);
	}
	a:hover {
		color: var(--primary-800);
	}
</style>
