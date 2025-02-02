<script lang="ts">
	import { Backend, clearToken, type SignupResponse, type LoginResponse } from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user";

    let username: string = "";
	let email: string = "";
	let password: string = "";
	$: formValid = email.length > 0 && password.length > 0;
    let loginError: boolean = false;

	/**
	 * Gets run on pressing "Signup" button or form submit (pressing enter)
	 */
	let result: SignupResponse | null = null;
	async function submitForm() {
		if (!formValid) return;
		console.log("submitted");
		try {
			// Makes call to /users/signup API endpoint, sending username and password in JSON format.
			result = await Backend.signup({
                username,
				email,
				password,
			});

			if (result == null) {
				// If result is null, log to console. Don't expect this would happen.
				console.log("Response is null");
				alert("NULL response. This is probably our fault.");
			} else if (result["error"] != "") {
				// API returned an error. This means there was an errror in the signup process.
				// @todo Display this in a better way than an alert popup.
				console.log("Response received. Error: " + result["error"]);
                loginError = true;
				// alert(result["error"]);
			} else {
                // Signup Successful
                console.log("Account Created.")
                
                // Automatically login the user
                let loginResult: LoginResponse | null = await Backend.login({
                    email,
                    password,
                });

                if (loginResult == null) {
                    // If result is null, log to console. Don't expect this would happen.
                    console.log("Response is null");
                    alert("NULL response. This is probably our fault.");
                } else if (loginResult["error"] != "") {
                    // API returned an error. This either means the account doesn't exist, or user entered wrong username / password.
                    // @todo Display this in a better way than an alert popup.
                    console.log("Response received. Error: " + loginResult["error"]);
                    alert(loginResult["error"]);
                } else if (loginResult["token"] != "") {
                    // User entered the correct username and password.
                    console.log("Response received. Token: " + loginResult["token"]);
                    Cookies.set("auth", loginResult["token"]);
                    $user.loggedIn = true;
                    $user.id = loginResult["userId"];
                    $user.admin = false;
                    
                    Cookies.set("id", loginResult["userId"])
				    Cookies.set("admin", "false")
                    navigate(`/proteins`);
                } else {
                    // User got a result, but both the error and token field are empty. This indicates a bug on our end.
                    console.log(
                        "Unexpected edge cage regarding user authentication."
                    );
                }
			}
		} catch (e) {
			alert([e]);
			console.log(e);
		}
	}
</script>

<svelte:head>
	<title>Signup</title>
</svelte:head>

<div class="signup">
    <h1 class="text-2xl font-bold">Create a new account</h1>
    <form on:submit|preventDefault={submitForm} class="flex gap-5 flex-col p-5">
        <div>
            <Label for="username">Username</Label>
            {#if loginError == false}
                <Input
                    id="username"
                    style="width: 300px;"
                    bind:value={username}
                    placeholder="Enter your username..."
                />
                {:else}
                    <Input
                        id="username"
                        style="width: 300px; border: 1px solid red"
                        bind:value={username}
                        placeholder="Enter your username..."
                />
                    <p style="color: red;">Error with username, try again</p>
            {/if}
        </div>

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
            <Button size="lg" type="submit" disabled={!formValid}>Sign Up</Button>
        </div>
    </form>
</div>

<style>
	.signup {
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

