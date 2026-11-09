<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Pizza Size Price Calculator | Compare Pizza Deals</title>
	<meta
		name="description"
		content="Compare pizza sizes and prices to find the best deal. See the cost per square inch, price per person, total area, and how many people each order feeds."
	/>
	<meta name="author" content="Michael Bonner" />
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content="Pizza Size Price Calculator" />
	<meta
		property="og:description"
		content="Which pizza is the best deal? Compare sizes, prices, servings, and cost per square inch in seconds."
	/>
	<meta property="og:image" content="https://pizza.michaelbonner.dev/og-image.jpg" />
	<meta property="og:image:secure_url" content="https://pizza.michaelbonner.dev/og-image.jpg" />
	<meta property="og:url" content="https://pizza.michaelbonner.dev/" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Pizza Size Price Calculator" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Pizza Size Price Calculator with two differently sized pepperoni pizzas and the words Compare pizza deals."
	/>
	<meta property="og:image:type" content="image/jpeg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Pizza Size Price Calculator" />
	<meta
		name="twitter:description"
		content="Which pizza is the best deal? Compare sizes, prices, servings, and cost per square inch in seconds."
	/>
	<meta name="twitter:image" content="https://pizza.michaelbonner.dev/og-image.jpg" />
	<meta
		name="twitter:image:alt"
		content="Pizza Size Price Calculator with two differently sized pepperoni pizzas and the words Compare pizza deals."
	/>
	<meta name="color-scheme" content="light only" />
	<meta name="theme-color" content="#FEF3C6" />

	<link rel="canonical" href="https://pizza.michaelbonner.dev/" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebSite",
					"@id": "https://pizza.michaelbonner.dev/#website",
					"url": "https://pizza.michaelbonner.dev/",
					"name": "Pizza Size Price Calculator",
					"description": "Compare pizza sizes and prices to find the best deal.",
					"inLanguage": "en-US"
				},
				{
					"@type": "WebApplication",
					"@id": "https://pizza.michaelbonner.dev/#app",
					"url": "https://pizza.michaelbonner.dev/",
					"name": "Pizza Size Price Calculator",
					"description": "Compare pizza sizes and prices by cost per square inch, price per person, total area, and estimated servings.",
					"applicationCategory": "UtilitiesApplication",
					"operatingSystem": "Any",
					"browserRequirements": "Requires JavaScript",
					"isAccessibleForFree": true,
					"inLanguage": "en-US",
					"image": "https://pizza.michaelbonner.dev/og-image.jpg",
					"isPartOf": { "@id": "https://pizza.michaelbonner.dev/#website" },
					"creator": {
						"@type": "Person",
						"name": "Michael Bonner",
						"url": "https://michaelbonner.dev/"
					}
				}
			]
		}
	</script>
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
