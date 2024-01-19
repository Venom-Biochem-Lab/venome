<script lang="ts">
	import { Button, Label, Input } from "flowbite-svelte";

	let username: string = "";
	let password: string = "";
	$: formValid = username.length > 0 && password.length > 0;

	/**
	 * Gets run on button "Login" or form submit (pressing enter)
	 * @todo add login logic with tokens and making a request to the backend
	 */
	function submitForm() {
		if (!formValid) return;

		console.log("submitted");
		console.table({ username, password });
	}
</script>

<form on:submit={submitForm} class="flex gap-5 flex-col">
	<div>
		<Label for="username">Username</Label>
		<Input
			id="username"
			style="width: 300px;"
			bind:value={username}
			placeholder="Enter your username..."
		/>
	</div>

	<div>
		<Label for="password">Password</Label>
		<Input
			type="password"
			id="password"
			style="width: 300px;"
			bind:value={password}
			placeholder="Enter your password..."
		/>
	</div>

	<div>
		<Button size="lg" type="submit" disabled={!formValid}>Login</Button>
	</div>
</form>
