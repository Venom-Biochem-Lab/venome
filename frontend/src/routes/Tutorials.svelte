<script lang="ts">
	import { onMount } from "svelte";
	import { Backend, type Tutorial } from "../lib/backend";

	let tutorials: Tutorial[] = [];
	let error = false;

	onMount(async () => {
		tutorials = await Backend.getAllTutorials();
		if (tutorials == null) error = true;

		console.log("Received", tutorials);
	});
</script>

<div class="page">
	<div class="tutorials-container">

		{#each tutorials as tutorial}
			<div class="tutorial">


				<h2 class="title">{tutorial.title}</h2>
				<p class="summary">{tutorial.description}</p>
				<!-- <ul> -->
                    <!-- {#each tutorial.links as link} -->
					<!-- add the anchor tags back in when problem gets figured out -->
					<!-- <li><a href={link.url}>{link.title}</a></li> -->
                        <!-- <a href={link.url}>{link.title}</a> -->
						 <!-- <p class="header">{link.url}</p> -->
                    <!-- {/each} -->
                <!-- </ul> -->

			</div>
		{/each}
	</div>
</div>

<style>
	.page {
        background-color: #f0f0f0;
        padding: 40px;
    }

	.tutorials-container {
        background-color: white;
        padding: 30px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    }

    .tutorial {
        margin-bottom: 5px;
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
