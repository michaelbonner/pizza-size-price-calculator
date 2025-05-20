<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="py-8 px-8 mx-auto max-w-7xl">
	{@render children?.()}
</div>
