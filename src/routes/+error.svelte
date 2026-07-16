<script lang="ts">
	import { page } from '$app/state';
	import { IconArrowLeft, IconHome, IconPizzaOff } from '@tabler/icons-svelte';

	const isNotFound = $derived(page.status === 404);

	const heading = $derived(isNotFound ? 'This slice is missing' : 'The oven overheated');
	const message = $derived(
		isNotFound
			? "We couldn't find the page you were looking for. It may have been moved or never existed."
			: (page.error?.message ?? 'Something went wrong on our end. Please try again in a moment.')
	);
</script>

<svelte:head>
	<title
		>{isNotFound ? 'Page Not Found' : `Error ${page.status}`} | Pizza Size Price Calculator</title
	>
</svelte:head>

<div class="prose prose-lg lg:mx-auto lg:py-16 text-center">
	<div
		class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-amber-500/30 text-amber-900 shadow-inner"
	>
		<IconPizzaOff size={40} stroke={1.5} />
	</div>

	<p class="text-amber-800 text-7xl font-bold tracking-tight">{page.status}</p>

	<h1 class="text-amber-900 mt-4 text-4xl lg:text-5xl text-shadow-sm text-shadow-amber-400">
		<span aria-hidden="true" class="hidden lg:inline">🍕</span>
		{heading}
	</h1>

	<p class="text-amber-800 mt-4 mx-auto max-w-md">
		{message}
	</p>
</div>

<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
	<a
		href="/"
		class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-900/90 px-6 py-3 text-sm font-semibold text-red-100 transition-colors hover:bg-red-800 sm:w-auto"
	>
		<IconHome size={18} />
		Back to home
	</a>
	<button
		type="button"
		onclick={() => history.back()}
		class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-900/60 px-6 py-3 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500/30 sm:w-auto"
	>
		<IconArrowLeft size={18} />
		Go back
	</button>
</div>
