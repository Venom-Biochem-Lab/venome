<script lang="ts">
	import { Backend, clearToken, type LoginResponse, type UserResponse} from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user";
	
	let userList: UserResponse[] = [];
	
	onMount(async () => {
		const response = await Backend.getUsers();
		userList = response.users;
	});

</script>

<svelte:head>
	<title>User List</title>
</svelte:head>

<table>
	<tr>
		<th>Username</th>
		<th>Email</th>
		<th>Role</th>
	</tr>
	{#each userList as user}
		<tr>
			<td>{user.username}</td>
			<td>{user.email}</td>
			<td>{user.admin}</td>
		</tr>
	{/each}
</table>