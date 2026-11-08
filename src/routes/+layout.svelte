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

<main class="px-4 sm:px-8">
	<div class="mx-auto max-w-7xl py-8">
		{@render children?.()}
	</div>
</main>
<footer class="px-4 pb-10 sm:px-8">
	<p
		class="mx-auto w-fit max-w-full rounded-2xl bg-white/70 px-5 py-3 text-center text-sm text-pretty text-amber-950 shadow-sm ring-1 ring-amber-900/10 backdrop-blur-lg sm:text-base"
	>
		Made with 🧀 by
		<a
			class="font-semibold underline decoration-amber-900/30 underline-offset-2 hover:decoration-amber-900"
			href="https://michaelbonner.dev">Michael Bonner</a
		>
		at
		<a
			class="font-semibold underline decoration-amber-900/30 underline-offset-2 hover:decoration-amber-900"
			href="https://bootpackdigital.com">Bootpack Digital</a
		>
	</p>
</footer>
