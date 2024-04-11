<script lang="ts">
	import { Backend, clearToken, type LoginResponse } from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user"

	 onMount(async () => {
        /*
        * Deletes the cookie and clears user store attributes upon entering the login page.
        * Done here, because the log out button redirects to this page.
        */
		clearToken()
		Cookies.remove("auth")
		$user.loggedIn = false
		$user.username = ""
		$user.admin = true
	});

	let email: string = "";
	let password: string = "";
	$: formValid = email.length > 0 && password.length > 0;

	let error = false;

	let token = "";
	/**
	 * Gets run on button "Login" or form submit (pressing enter)
	 * @todo add login logic with tokens and making a request to the backend
	 */
	let result: LoginResponse | null = null;
	async function submitForm() {
		if (!formValid) return;
		console.log("submitted");
		try {
			// Attempting to get a valid authentication token from the API
			result = await Backend.login({
				email,
				password,
			});

			if (result == null) {
				// If result is null, log to console. Don't expect this would happen.
				console.log("Response is null");
			} else if (result["error"] != "") {
				// User entered wrong username or password, or account doesn't exist.
				// @todo Display this error message to the user.
				console.log("Response received. Error: " + result["error"]);
				alert(result["error"])
			} else if (result["token"] != "") {
				// User entered the correct username / password and got a result.
				// @todo Store this in a cookie.
				console.log("Response received. Token: " + result["token"]);
				Cookies.set("auth", result["token"]);
				$user.loggedIn = true
				navigate(`/search`);
			} else {
				// User got a result, but both fields are null. This should never happen.
				console.log(
					"Unexpected edge cage regarding user authentication."
				);
			}
		} catch (e) {
			alert([e])
			console.log(e);
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<form on:submit|preventDefault={submitForm} class="flex gap-5 flex-col p-5">
	<div>
		<Label for="email">Email</Label>
		<Input
			id="email"
			style="width: 300px;"
			bind:value={email}
			placeholder="Enter your email..."
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
