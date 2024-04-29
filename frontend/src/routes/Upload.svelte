<script lang="ts">
	/* Put stuff here */

	import {
		CirclePlusSolid,
		PlusSolid,
		UploadSolid,
	} from "flowbite-svelte-icons";
	import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { user } from "../lib/stores/user";

    onMount(async () => {
		if (!$user.loggedIn) {
			alert(
				"You are not logged in. You are being redirected to home. TODO: Make this better."
			);
			navigate("/");
		}
    })
</script>

<section class="p-5">
	<div class="large-text">Upload</div>
	<br />
	<div class="flex gap-5">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="option" on:click={() => navigate("upload/protein")}>
			<div class="big-text flex gap-1 items-center">
				<UploadSolid size="lg" /> Upload a new Protein
			</div>
			<div>
				If you want to upload a new .pdb protein to Venome, <b
					>Click here.</b
				>
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="option" on:click={() => navigate("upload/article")}>
			<div class="big-text flex gap-1 items-center">
				<CirclePlusSolid size="lg" /> Create a new Article
			</div>
			<div>
				If you want to create a new article, <b>Click here</b>.
			</div>
		</div>
	</div>
</section>

<style>
	/*  put stuff here */
	.option {
		width: 400px;
		height: 200px;
		--border-opacity: 0.2;
		outline: hsla(0, 0%, 0%, var(--border-opacity)) 1px solid;
		border-radius: 5px;
		padding: 15px;
		/* display: flex; */
		/* justify-content: center;
		align-items: center; */
		transition: all 0.2s ease-in-out;
	}

	.big-text {
		font-size: 30px;
		color: var(--primary-700);
	}

	.option:hover {
		transform: scale(1.02);
		box-shadow: 0 1px 2px 2px #00000010;
		background-color: var(--primary-100);
		--border-opacity: 0.4;
		cursor: pointer;
	}
</style>
