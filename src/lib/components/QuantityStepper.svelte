<script lang="ts">
	import { IconMinus, IconPlus } from '@tabler/icons-svelte';

	// `oncommit` fires once a new quantity is settled (a button press or leaving
	// the field), unlike the input's change event, which buttons don't emit.
	let {
		value = $bindable(),
		label,
		oncommit
	}: { value: number; label: string; oncommit?: () => void } = $props();

	// Mirrors the page's quantity rules: whole numbers, 0 while the field is
	// being edited, clamped to 1-99 when committed.
	const quantity = $derived.by(() => {
		const whole = Math.floor(+value);
		return Number.isFinite(whole) && whole > 0 ? whole : 0;
	});

	function set(next: number) {
		value = Math.max(1, Math.min(99, Math.floor(next) || 1));
		oncommit?.();
	}
</script>

<div class="flex w-fit items-center rounded-lg ring-1 ring-amber-900/30">
	<button
		class="flex size-8 items-center justify-center rounded-l-lg text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-30"
		aria-label="Decrease quantity of {label}"
		disabled={quantity <= 1}
		onclick={() => set(quantity - 1)}
	>
		<IconMinus size={16} />
	</button>
	<input
		class="h-8 w-10 border-0 bg-transparent p-0 text-center font-semibold tabular-nums focus:ring-2 focus:ring-amber-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
		aria-label="Quantity of {label}"
		bind:value
		onblur={() => set(value)}
		inputmode="numeric"
		max="99"
		min="1"
		step="1"
		type="number"
	/>
	<button
		class="flex size-8 items-center justify-center rounded-r-lg text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-30"
		aria-label="Increase quantity of {label}"
		disabled={quantity >= 99}
		onclick={() => set(quantity + 1)}
	>
		<IconPlus size={16} />
	</button>
</div>
