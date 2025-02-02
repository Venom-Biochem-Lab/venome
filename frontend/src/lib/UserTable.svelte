<script lang="ts">
	import { Backend, clearToken, type UserResponse, type UserBody} from "../lib/backend";
	import { onMount } from "svelte";
	
	let userList: UserResponse[] = [];
	let unique = {};

	export let reloadTable: () => void;
	
	onMount(async () => {
		const response = await Backend.getUsers();
		userList = response.users;

	});


	async function getID(username: string) {
		return (await Backend.getUserId(username)).id;
	}
	
	async function deleteUser(username: string) {
		const id = await getID(username);
		await Backend.deleteUser(id);
		reloadTable()
	}

	async function editUsername(username: string) {
		const id = await getID(username);
		const newUsername = prompt("Enter new username", username);
		const user: UserBody = {
			id : id,
			username: newUsername,
		};
		await Backend.editUser(id, user);
		reloadTable()
	}

	async function editEmail(username: string, email: string) {
		const id = await getID(username);
		const newEmail = prompt("Enter new email", email);
		const user: UserBody = {
			id : id,
			email: newEmail,
		};
		await Backend.editUser(id, user);
		reloadTable()
	}

	async function editRole(username: string) {
		const id = await getID(username);
		const isAlreadyAdmin = (await Backend.getUser(id)).admin;
		const newRole = isAlreadyAdmin ? false : true;
		const user: UserBody = {
			id : id,
			admin: newRole,
		};
		await Backend.editUser(id, user);
		reloadTable()
	}
</script>

<tr>
    <th>Username</th>
    <th>Email</th>
    <th>Admin</th>
    <th>Proteins Submitted</th>
</tr>
{#each userList as user}
    <tr>
        <td>{user.username} <button on:click={editUsername(user.username)}>Edit Username</button></td>
        <td>{user.email} <button on:click = {editEmail(user.username, user.email)}>Edit Email</button></td>
        <td class="admin">{user.admin.toString()} <button on:click ={editRole(user.username)}>Toggle Admin</button></td>
        <td></td>
    </tr>
{/each}


<style>

	th, td {
		border: 1px solid black;
		padding: 8px;
		text-align: left;
	}

	.admin {
		text-transform: capitalize;
	}

	th {
		background-color: hsla(205, 57%, 23%, 0.35);
	}
	button {
		background-color: hsla(205, 57%, 23%, 0.35);
		border-radius: 15px;
		padding: 5px;
	}
</style>