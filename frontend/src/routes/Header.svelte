<script lang="ts">
	import logo from "$lib/images/logo.svg";
	import {
		HomeOutline,
		UploadOutline,
		UserOutline,
		TableRowOutline,
	} from "flowbite-svelte-icons";
	import { Search, Button } from "flowbite-svelte";
	import { searchBy } from "$lib/customStores";
</script>

<header class="flex justify-between">
	<div class="nav-container">
		<div id="logo">
			<a href="/">
				<img src={logo} alt="Venome Logo" />
			</a>
		</div>
		<div class="nav">
			<a href="/" class="flex items-center gap-1"
				><HomeOutline size="sm" />Home</a
			>
			<a href="/upload" class="flex items-center gap-1">
				<UploadOutline size="sm" />Upload</a
			>
			<a href="/search" class="flex items-center gap-1"
				><TableRowOutline size="sm" />Proteins</a
			>
		</div>
		<form
			id="search-bar"
			on:submit={() => {
				if ($searchBy) {
					window.location.href = `/search?name=${$searchBy}`;
				} else {
					window.location.href = `/search`;
				}
			}}
		>
			<Search
				size="lg"
				type="text"
				class="flex gap-2 items-center"
				placeholder="Enter search..."
				bind:value={$searchBy}
			/>
			<Button type="submit" size="sm">Search</Button>
		</form>
	</div>

	<a href="/login" class="flex items-center gap-1 mr-5">
		<UserOutline size="sm" />Login</a
	>
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
		height: 45px;
		width: 100px;
	}

	#search-bar {
		display: flex;
		min-width: 500px;
		gap: 5px;
		margin-left: 20px;
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
