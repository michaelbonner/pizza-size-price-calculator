<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="px-8">
	<div class="py-8 mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>
<footer class="m-8">
	<div class="text-center bg-white/70 backdrop-blur-sm p-8 rounded-lg max-w-7xl lg:mx-auto">
		<p>
			Made with 🧀 by <a class="underline" href="https://michaelbonner.dev">Michael Bonner</a>
		</p>
	</div>
</footer>
