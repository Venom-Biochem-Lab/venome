<script lang="ts">
	import { Button, Label, Input } from "flowbite-svelte";

	let username: string = "";
	let password: string = "";
</script>

<form on:submit|preventDefault class="flex gap-4 flex-col">
	<div>
		<Label for="username">Username</Label>
		<Input
			id="username"
			bind:value={username}
			placeholder="Enter your username..."
		/>
	</div>

	<div>
		<Label for="password">Password</Label>
		<Input
			type="password"
			id="password"
			bind:value={password}
			placeholder="Enter your password..."
		/>
	</div>

	<Button
		type="submit"
		on:click={() => {
			console.log("hit submit", password, username);
		}}>Login</Button
	>
</form>
