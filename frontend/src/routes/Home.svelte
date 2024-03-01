<script lang="ts">
	import { Backend, clearToken, type LoginResponse } from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user"
</script>

<svelte:head>
	<title>Venome Home</title>
</svelte:head>

<div id="title_col_1">
	<h1>Welcome to the Unknown Venome</h1>
	<h3>New? Check out our <a href="/tutorials">tutorials</a>!</h3>
	<h3>Looking for something specific? Start searching now!</h3>
	<!--search bar-->
	<form>
		<input type="text">
		<!--I'm feeling lucky-->
		<button>Roll the dice</button>
	</form>
</div>

<style>
	h1 {
		margin-top: 10px;
		margin-top: 3px;
		color: rgb(25, 63, 90);
	}

	h3 {
		margin: 5px;
		margin-bottom: 3px;
		margin-top: 10px;
	}

	input {
		padding: 5px;
		display: inline;
	}

	button {
		background-color: rgb(25, 63, 90);
		border-radius: 3px;
		color: lightgray;
		padding: 3px;
	}

	#title_col_1 {
		margin-left: 15px;
	}
</style>