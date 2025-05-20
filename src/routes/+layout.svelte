<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="px-8">
	<div class="py-8 mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>
<footer class="text-center bg-white/80 p-8 rounded-lg max-w-7xl mx-auto my-8">
	<p>
		Made with 🧀 by <a class="underline" href="https://michaelbonner.dev">Michael Bonner</a>
	</p>
</footer>
