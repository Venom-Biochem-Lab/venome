<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Header from "./lib/Header.svelte";
	import Home from "./routes/Home.svelte";
	import Search from "./routes/Search.svelte";
	import Upload from "./routes/Upload.svelte";
	import Login from "./routes/Login.svelte";
	import Protein from "./routes/Protein.svelte";
	import Error from "./routes/Error.svelte";
	import Edit from "./routes/Edit.svelte";
	import Tutorials from "./routes/Tutorials.svelte";
	import ForceUploadThumbnails from "./routes/ForceUploadThumbnails.svelte";
	import Align from "./routes/Align.svelte";
	import Tutorial from "./routes/Tutorial.svelte";
	import UploadTutorial from "./routes/UploadTutorial.svelte";
	import EditTutorial from "./routes/EditTutorial.svelte";
</script>

<Router>
	<nav>
		<Header />
	</nav>
	<main id="layout">
		<Route path="/"><Home /></Route>
		<Route path="/search"><Search /></Route>
		<Route path="/upload"><Upload /></Route>
		<Route path="/upload/tutorial"><UploadTutorial /></Route>
		<Route path="/login"><Login /></Route>
		<Route path="/tutorials"><Tutorials /></Route>
		<Route path="/tutorial/:id" let:params
			><Tutorial tutorialTitle={params.id} /></Route
		>
		<Route path="/protein/:id" let:params
			><Protein urlId={params.id} /></Route
		>
		<Route path="/protein/edit/:id" let:params
			><Edit urlId={params.id} /></Route
		>
		<Route path="/tutorial/edit/:id" let:params
			><EditTutorial tutorialTitle={params.id} /></Route
		>
		<Route path="/force-upload-thumbnails"><ForceUploadThumbnails /></Route>
		<Route path="/align/:a/:b" let:params
			><Align proteinA={params.a} proteinB={params.b} /></Route
		>
		<Route path="/*"><Error /></Route>
	</main>
</Router>
