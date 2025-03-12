<script lang="ts">
	import UserTable from "../lib/UserTable.svelte";
	import { navigate } from "svelte-routing";
	import { onMount } from "svelte";
	import { user } from "../lib/stores/user";

	let unique = {};

	function reloadTable() {
		unique = {};
	}

	onMount(async () => {
		if (!$user.admin) {
			alert(
				"You are not an admin. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}
	});
</script>

<svelte:head>
	<title>User List</title>
</svelte:head>

<div class="userlist">
	<table>
		<!-- Allows only the table to be reloaded, rather than the whole site. #key checks if a unique item is changed, and every {} is unique so it is reloaded when the function is called. -->
		{#key unique}
			<UserTable {reloadTable} />
		{/key}
	</table>
</div>

<style>
	.userlist {
		width: 100%;
		align-items: center;
	}

	table {
		width: 95%;
		margin: 30px auto;
	}
</style>
