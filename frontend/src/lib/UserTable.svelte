<script lang="ts">
	import {
		Backend,
		clearToken,
		type UserResponse,
		type UserBody,
	} from "../lib/backend";
	import { onMount } from "svelte";
	import { setToken } from "../lib/backend";
	import { TrashBinSolid } from "flowbite-svelte-icons";

	let userList: UserResponse[] = [];
	let proteins: String[][] = [];
	let showProteins: Boolean[] = [];
	let unique = {};

	export let reloadTable: () => void;

	onMount(async () => {
		setToken();
		const response = await Backend.getUsers();
		userList = response.users;

		for (let i = 0; i < userList.length; i++) {
			const user = userList[i];
			const id = user.id;
			const proteinList = (await Backend.getUserProteins(id)) ?? [""];
			proteins[user.id] = proteinList;
			if (proteinList.length > 10) {
				showProteins[user.id] = false;
			} else {
				showProteins[user.id] = true;
			}
		}
		console.log(userList);
		console.log(proteins);
	});

	async function getID(username: string) {
		setToken();
		return (await Backend.getUserId(username)).id;
	}

	async function deleteUser(username: string) {
		let choice = confirm("Are you sure you want to delete this user?");
		if (!choice) {
			return;
		}
		setToken();
		const id = await getID(username);
		await Backend.deleteUser(id);
		reloadTable();
	}

	async function editUsername(username: string) {
		setToken();
		const id = await getID(username);
		const newUsername = prompt("Enter new username", username);
		const user: UserBody = {
			id: id,
			username: newUsername,
		};
		await Backend.editUser(id, user);
		reloadTable();
	}

	async function editEmail(username: string, email: string) {
		setToken();
		const id = await getID(username);
		const newEmail = prompt("Enter new email", email);
		const user: UserBody = {
			id: id,
			email: newEmail,
		};
		await Backend.editUser(id, user);
		reloadTable();
	}

	async function editRole(username: string) {
		setToken();
		const id = await getID(username);
		const isAlreadyAdmin = (await Backend.getUser(id)).admin;
		const newRole = isAlreadyAdmin ? false : true;
		const user: UserBody = {
			id: id,
			admin: newRole,
		};
		await Backend.editUser(id, user);
		reloadTable();
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
		<td>
			<button on:click={() => deleteUser(user.username)}>
				<TrashBinSolid></TrashBinSolid>
			</button>
			{user.username}
			<button on:click={() => editUsername(user.username)}>
				Edit Username
			</button>
		</td>
		<td>
			{user.email}
			<button on:click={() => editEmail(user.username, user.email)}>
				Edit Email
			</button>
		</td>
		<td class="admin">
			{user.admin.toString()}
			<button on:click={() => editRole(user.username)}>Toggle Admin</button>
		</td>
		<td>
			{#if proteins[user.id]}
				{#if proteins[user.id].length == 0}
					No proteins submitted
				{:else if showProteins[user.id]}
					<button on:click={() => (showProteins[user.id] = false)}>
						Show Less
					</button>
					<div class="proteins">
						{#each proteins[user.id] as protein}
							<a href="/protein/{[protein]}">{protein}</a>
						{/each}
					</div>
				{:else}
					<button on:click={() => (showProteins[user.id] = true)}>
						Show More
					</button>
				{/if}
			{/if}
		</td>
	</tr>
{/each}

<style>
	th,
	td {
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

	.proteins {
		display: flex;
		flex-direction: column;
	}
</style>
