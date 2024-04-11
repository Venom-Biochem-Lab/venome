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
		$user.admin = false
	});

	let email: string = "";
	let password: string = "";
	$: formValid = email.length > 0 && password.length > 0;

	/**
	 * Gets run on pressing "Login" button or form submit (pressing enter)
	 */
	let result: LoginResponse | null = null;
	async function submitForm() {
		if (!formValid) return;
		console.log("submitted");
		try {
			
            // Makes call to /users/login API endpoint, sending username and password in JSON format.
			result = await Backend.login({
				email,
				password,
			});

			if (result == null) {
				// If result is null, log to console. Don't expect this would happen.
				console.log("Response is null");
                alert(result["NULL response. This is probably our fault."])

			} else if (result["error"] != "") {
				// API returned an error. This either means the account doesn't exist, or user entered wrong username / password.
                // @todo Display this in a better way than an alert popup.
				console.log("Response received. Error: " + result["error"]);
				alert(result["error"])

			} else if (result["token"] != "") {
				// User entered the correct username and password. Store token in cookie and set svelte store loggedin status to true.
				console.log("Response received. Token: " + result["token"]);
				Cookies.set("auth", result["token"]);
				$user.loggedIn = true
                $user.username = email
                $user.admin = true
				navigate(`/search`);

			} else {
				// User got a result, but both the error and token field are empty. This indicates a bug on our end.
				console.log("Unexpected edge cage regarding user authentication.");
                alert(result["Unexpected edge cage regarding user authentication. This is probably our fault."])
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
