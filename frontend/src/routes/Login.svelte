<script lang="ts">
	import { Backend, clearToken, type UserLoginResponse } from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user";

	onMount(async () => {
		/**
		 * Deletes the cookie and clears user store attributes upon entering the login page.
		 * Done here, because the log out button redirects to this page.
		 */
		clearToken();
		Cookies.remove("auth");
		$user.loggedIn = false;
		$user.id = 0;
		$user.admin = false;
	});

	let email: string = "";
	let password: string = "";
	$: formValid = email.length > 0 && password.length > 0;

	/**
	 * Gets run on pressing "Login" button or form submit (pressing enter)
	 */
	let loginResponse: UserLoginResponse;
	async function submitForm() {
		if (!formValid) return;
		console.log("submitted");
		try {
			// Makes call to /users/login API endpoint, sending username and password in JSON format.
			loginResponse = await Backend.login({
				email,
				password,
			});

		} catch (e) {
			alert([e]);
			console.log(e);
		}
		if (loginResponse["token"] != "") {
			// User entered the correct username and password.
			console.log("Response received. Token: " + loginResponse["token"]);
			
			let isAdmin = (await Backend.getUser(loginResponse["userId"])).admin
			$user.loggedIn = true;
			$user.id = loginResponse["userId"];
			$user.admin = isAdmin;
			Cookies.set("auth", loginResponse["token"]);
			Cookies.set("id", loginResponse["userId"].toString())
			Cookies.set("admin", isAdmin.toString())
			navigate(`/proteins`);
		} else {
			// User got a result, but both the error and token field are empty. This indicates a bug on our end.
			console.log(
				"Unexpected edge cage regarding user authentication."
			);
			alert(
				"Unexpected edge cage regarding user authentication. This is probably our fault."
			);
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="login">
	<h1 class="text-2xl font-bold">Login to an existing account</h1>
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
</div>

<style>
	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: hsla(205, 57%, 23%, 0.05);
		border-radius: 10px;
		width: 20%;
		margin: 50px auto;
		padding: 30px;
	}

	h1 {
		font-size: 22px;
		font-weight: 500;
		color: var(--primary-800);
	}
</style>