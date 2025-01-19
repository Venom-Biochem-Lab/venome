<script>
	import UserTable from "../lib/UserTable.svelte";


	let unique = {};

	function reloadTable() {
 		unique = {};
	}
</script>
<svelte:head>
	<title>User List</title>
</svelte:head>

<div class="userlist">
	<table>
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
		margin:30px auto;
	}
</style>
