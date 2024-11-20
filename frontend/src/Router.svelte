<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Header from "./lib/Header.svelte";
	import Home from "./routes/Home.svelte";
	import Proteins from "./routes/Proteins.svelte";
	import UploadProtein from "./routes/UploadProtein.svelte";
	import Login from "./routes/Login.svelte";
	import Signup from "./routes/Signup.svelte";
	import Protein from "./routes/Protein.svelte";
	import Error from "./routes/Error.svelte";
	import Edit from "./routes/Edit.svelte";
	import ForceUploadThumbnails from "./routes/ForceUploadThumbnails.svelte";
	import Align from "./routes/Align.svelte";
	import UploadArticle from "./routes/UploadArticle.svelte";
	import Article from "./routes/Article.svelte";
	import Articles from "./routes/Articles.svelte";
	import EditArticle from "./routes/EditArticle.svelte";
	import Upload from "./routes/Upload.svelte";
	import FullScreen from "./routes/FullScreen.svelte";
</script>

<Router>
	<nav>
		<Header />
	</nav>
	<main id="layout">
		<!-- main navigation routes -->
		<Route path="/"><Home /></Route>
		<Route path="/proteins"><Proteins /></Route>
		<Route path="/login"><Login /></Route>
		<Route path="/signup"><Signup /></Route>
		<Route path="/upload"><Upload /></Route>

		<!-- all things proteins -->
		<Route path="/protein/:id" let:params
			><Protein urlId={params.id} /></Route
		>
		<Route path="/protein/edit/:id" let:params
			><Edit urlId={params.id} /></Route
		>
		<Route path="/upload/protein"><UploadProtein /></Route>
		<Route path="/fullscreen/:id" let:params
			><FullScreen proteinName={params.id} /></Route
		>
		<Route path="/align/:a/:b" let:params
			><Align proteinA={params.a} proteinB={params.b} /></Route
		>

		<!-- all things articles -->
		<Route path="/articles"><Articles /></Route>
		<Route path="/article/:id" let:params
			><Article articleID={params.id} /></Route
		>
		<Route path="/article/edit/:id" let:params
			><Article articleID={params.id} editMode />
		</Route>
		<Route path="/article/meta/edit/:id" let:params
			><EditArticle articleID={params.id} />
		</Route>
		<Route path="/upload/article"><UploadArticle /></Route>

		<!-- other -->
		<Route path="/force-upload-thumbnails"><ForceUploadThumbnails /></Route>
		<Route path="/*"><Error /></Route>
	</main>
</Router>

<style>
	#layout {
		position: relative;
	}
</style>
