<script lang="ts">
	import { Backend, clearToken, type LoginResponse } from "../lib/backend";
	import { Button, Label, Input } from "flowbite-svelte";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { user } from "../lib/stores/user"
	import ProteinVis from "../lib/ProteinVis.svelte";
</script>

<svelte:head>
	<title>Venome Home</title>
</svelte:head>

<div id="title">
	<h1>Welcome to the Unknown Venome</h1>
</div>
<div id="title_page">
	<div id="side_col" class="col">
		<h3>Get to know the <a href="https://venombiochemistrylab.weebly.com/">Venome Lab</a>!</h3>
		<p>The Venome Lab is based out of OSU and studies three species of parasitic wasps and their proteins</p>
		<h3>There are so many wasps in there</h3>
		<!--search bar-->
		<img src="https://biochem.oregonstate.edu/sites/biochem.oregonstate.edu/files/styles/600_x_var/public/2023-02/Nate.jpg?itok=eoH8WcNU" alt="A picture of Nate Mortimer in lab gear doing some scientific stuff." id="DeadInTheWater">
	</div>
	<div id="middle_col" class="col">
		<h3>Looking for something specific? Start searching now!</h3>
		<!--search bar-->
		<form>
			<input type="text">
			<!--I'm feeling lucky-->
			<button>Roll the dice</button>
		</form>

		<ProteinVis
			format="pdb"
			width={400}
			height={400}
		/>
		<div class="protein_about">
			<p>lorem ipsum dolor sit something about the proteins</p>
		</div>
	</div>
	<div id="side_col" class="col">
		<h3>New? Check out our <a href="/tutorials">tutorials</a>!</h3>
		<p>Whether you're a protein expert looking to analyze some proteins or a new student with a budding interest in biochemistry, this is the place for you.</p>
		<h3>See <em>all</em> of our proteins, <a href="/search">listed here</a>!</h3>
		<p>Filter down the Venome lab's catalog of proteins and see all the features within.</p>
		<!--search bar-->
		<div id="GettingStarted">
			<h3>Get started with these helpful tutorials!</h3>
			<ul>
				<li>using the site</li>
				<li>biochem basics</li>
			</ul>
		</div>
	</div>
</div>

<style>
	#title {
		width: 100%;
	}

	h1 {
		margin-top: 10px;
		margin-bottom: 3px;
		text-align: center;
		color: rgb(25, 63, 90);
	}

	h3 {
		margin-bottom: 3px;
		margin-top: 10px;
	}

	input {
		padding: 5px;
		display: inline;
	}

	button {
		background-color: rgb(25, 63, 90);
		border-radius: 3px;
		color: lightgray;
		padding: 3px;
	}

	#title_page {
		margin: 0% 2%;
		display: flex;
	}

	.col {
		margin: 0% 0.5%;
		padding: 2%;
		background-color:aliceblue;
	}

	#side_col {
		width: 27%
	}

	#middle_col {
		width: 42%;
	}

	ProteinVis {
		margin: 1%;
		max-width: 30%;
		max-height: 30%;
		display: block;
	}

	.protein_about {
		margin-left: 20px;
		display: block;
	}

	ul li {
		margin-left: 7%;
		list-style-type: circle;
	}

	input {
		margin-bottom: 15px;
	}
	

</style>