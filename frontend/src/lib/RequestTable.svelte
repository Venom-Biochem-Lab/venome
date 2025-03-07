<script lang="ts">
	import {
		Backend,
		clearToken,
		type FullProteinInfo,
		RequestStatus,
	} from "../lib/backend";
	import { onMount } from "svelte";
	import { setToken } from "../lib/backend";

	let requestList: FullProteinInfo[] = [];

	export let reloadTable: () => void;

	onMount(async () => {
		setToken();
		const response = await Backend.getAllRequestEntries();
		requestList = response;
		console.log(requestList);
	});

	async function editStatus(requestId: number, status: RequestStatus) {
		setToken();
		const response = await Backend.editRequestStatus({
			requestId,
			status,
		});
		if (!response) {
			reloadTable();
		}
	}
</script>

<tr>
	<th colspan="4">Request</th>
	<th colspan="2">User</th>
	<th colspan="4">Protein</th>
</tr>
<tr>
	<!-- Request -->
	<th>ID</th>
	<th>Date</th>
	<th>Status</th>
	<th>Comment</th>
	<!-- User -->
	<th>ID</th>
	<th>Username</th>
	<!-- Protein -->
	<th>ID</th>
	<th>Name</th>
	<th>Species</th>
	<th>Content</th>
</tr>
{#each requestList as request}
	<tr>
		<td>{request.requestId}</td>
		<td>{new Date(request.requestDate).toLocaleString()}</td>
		<td>
			{#if request.requestStatus === RequestStatus.PENDING}
				<button
					class="status-button"
					id="approved"
					on:click={() => editStatus(request.requestId, RequestStatus.APPROVED)}
				>
					Approve
				</button>
				<p style="text-align: center; width: 100%;">or</p>
				<button
					class="status-button"
					id="denied"
					on:click={() => editStatus(request.requestId, RequestStatus.DENIED)}
				>
					Deny
				</button>
			{:else if request.requestStatus === RequestStatus.APPROVED}
				<button class="status-button" id="approved" disabled>Approved</button>
			{:else}
				<button class="status-button" id="denied" disabled>Denied</button>
			{/if}
		</td>
		<td>{request.comment}</td>
		<td>{request.userId}</td>
		<td>{request.username}</td>
		<td>{request.proteinId}</td>

		<td>
			<a href={`/protein/${request.proteinName}`}>{request.proteinName}</a>
		</td>
		<td>{request.species}</td>
		<td>{request.proteinContent}</td>
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

	.status-button {
		margin: 10px;
		padding: 10px;
		width: 100px;
	}

	#approved {
		background-color: hsla(120, 85%, 37%, 0.35);
	}

	#denied {
		background-color: hsla(0, 83%, 39%, 0.514);
	}

	th {
		background-color: hsla(205, 57%, 23%, 0.35);
	}
	button {
		background-color: hsla(205, 57%, 23%, 0.35);
		border-radius: 15px;
		padding: 5px;
	}

	a {
		color: var(--primary-700);
		text-decoration: underline;
	}
</style>
