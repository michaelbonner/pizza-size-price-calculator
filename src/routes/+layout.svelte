<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Pizza Size Price Calculator</title>
	<meta
		name="description"
		content="Have you ever wondered if ordering two medium pizzas is cheaper than getting one large? Or whether Costco's pizza is a good deal? Now you don't have to wonder."
	/>
	<meta property="og:title" content="Pizza Size Price Calculator" />
	<meta
		property="og:description"
		content="Have you ever wondered if ordering two medium pizzas is cheaper than getting one large? Or whether Costco's pizza is a good deal? Now you don't have to wonder."
	/>
	<meta property="og:image" content="/og-image.jpg" />
	<meta property="og:url" content="https://pizza.michaelbonner.dev/" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Pizza Size Price Calculator" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Pizza Size Price Calculator" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta name="color-scheme" content="light only" />
	<meta name="theme-color" content="#FEF3C6" />

	<link rel="canonical" href="https://pizza.michaelbonner.dev/" />
</svelte:head>

<main class="px-8">
	<div class="py-8 mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>
<footer class="m-8 text-center text-amber-800">
	<p>
		Made with 🧀 by <a class="underline" href="https://michaelbonner.dev">Michael Bonner</a>
	</p>
</footer>
