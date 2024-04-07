<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";
	import { navigate } from "svelte-routing";
	import { Button } from "flowbite-svelte";

	let tutorials: Tutorial[] = [];
	let error = false;

	onMount(async () => {
		try {
			tutorials = await Backend.getAllTutorials();
		} catch (e) {
			error = true;
		}
		console.log("Received", tutorials);
	});
</script>

<div class="p-5">
	<div class="mb-5">
		<Button on:click={() => navigate(`/upload/tutorial`)}
			>Upload Tutorial</Button
		>
	</div>
	<div class="tutorials-container">
		{#each tutorials as tutorial}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="tutorial"
				on:click={() => {
					navigate(`/tutorial/${tutorial.title}`);
				}}
			>
				<div class="tutorial-title">{tutorial.title}</div>
				<div class="tutorial-desc">{tutorial.description ?? ""}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.tutorials-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		gap: 10px;
	}
	.tutorial {
		--border-opacity: 0.3;
		display: flex;
		flex-direction: column;
		outline: hsla(var(--darkblue-hsl), var(--border-opacity)) 1px solid;
		border-radius: 5px;
		width: 300px;
		padding-left: 15px;
		padding-bottom: 15px;
		padding-top: 15px;
		box-sizing: border-box;
		transition: all 0.2s ease-in-out;
		align-self: start;
	}
	.tutorial:hover {
		transform: scale(1.02);
		--border-opacity: 0.5;
		box-shadow: 0 1px 2px 2px #00000010;
		cursor: pointer;
	}

	.tutorial-title {
		font-size: 1.2em;
		color: var(--darkblue);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tutorial-desc {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 300;

		@supports (-webkit-line-clamp: 3) {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: initial;

			display: -webkit-box;

			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}

	.title {
		font-size: 24px;
		margin-bottom: 5px;
	}

	.summary {
		font-size: 18px;
		margin-left: 40px;
		margin-right: 40px;
	}
</style>
