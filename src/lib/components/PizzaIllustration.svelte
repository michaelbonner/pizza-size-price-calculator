<script lang="ts">
	// Draws a pizza whose diameter is `scale` (0-1) of the available box, so
	// several illustrations side by side read as true-to-size.
	let { scale = 1, muted = false }: { scale?: number; muted?: boolean } = $props();

	const pepperoni = [
		{ x: 50, y: 30 },
		{ x: 31, y: 44 },
		{ x: 66, y: 47 },
		{ x: 42, y: 65 },
		{ x: 62, y: 70 },
		{ x: 50, y: 50 }
	];
</script>

<svg
	viewBox="0 0 100 100"
	class="size-full transition-transform duration-500 ease-out"
	style:transform="scale({Math.max(0.15, Math.min(1, scale))})"
	aria-hidden="true"
>
	<g class={muted ? 'opacity-40 grayscale' : ''}>
		<circle cx="50" cy="50" r="48" fill="#d9913f" />
		<circle cx="50" cy="50" r="42" fill="#c2410c" />
		<circle cx="50" cy="50" r="39" fill="#fcd34d" />
		<path
			d="M50 50 L50 11 M50 50 L83.8 69.5 M50 50 L16.2 69.5"
			stroke="#d97706"
			stroke-width="0.8"
		/>
		{#each pepperoni as p, i (i)}
			<circle cx={p.x} cy={p.y} r="6" fill="#b91c1c" />
			<circle cx={p.x - 1.5} cy={p.y - 1.5} r="1.2" fill="#ef4444" />
		{/each}
	</g>
</svg>
