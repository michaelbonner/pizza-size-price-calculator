<script lang="ts">
	import PizzaIllustration from '#lib/components/PizzaIllustration.svelte';
	import { IconMinus, IconPlus, IconTrash, IconTrophy } from '@tabler/icons-svelte';
	import { clsx } from 'clsx';

	const sizes = ['10', '12', '14', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30'];

	const appetites = [
		{ label: 'Light', value: 30 },
		{ label: 'Normal', value: 40 },
		{ label: 'Hungry', value: 50 }
	];

	let pizzas = $state([
		{ name: 'Dominos Large', size: '12', price: 10.99, quantity: 1 },
		{ name: 'Dominos Medium', size: '12', price: 6.99, quantity: 2 },
		{ name: 'Little Caesars Large', size: '14', price: 6.99, quantity: 1 },
		{ name: 'Costco', size: '18', price: 9.95, quantity: 1 }
	]);

	let squareInchPerPerson = $state(40);

	type Pizza = (typeof pizzas)[number];

	function getQuantity(pizza: Pizza): number {
		const quantity = Math.floor(+pizza.quantity);
		return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
	}

	function setQuantity(pizza: Pizza, quantity: number) {
		pizza.quantity = Math.max(1, Math.min(99, Math.floor(quantity) || 1));
	}

	function hasPrice(pizza: Pizza): boolean {
		return +pizza.price > 0;
	}

	function isComparable(pizza: Pizza): boolean {
		return hasPrice(pizza) && getQuantity(pizza) > 0;
	}

	function calculateSquareInches(size: string): number {
		return Math.PI * Math.pow(+size / 2, 2);
	}

	function calculateTotalPrice(pizza: Pizza): number {
		return pizza.price * getQuantity(pizza);
	}

	function calculateTotalSquareInches(pizza: Pizza): number {
		return calculateSquareInches(pizza.size) * getQuantity(pizza);
	}

	function calculatePricePerSquareInch(pizza: Pizza): number {
		return pizza.price / calculateSquareInches(pizza.size);
	}

	function calculateServings(pizza: Pizza): number {
		return calculateTotalSquareInches(pizza) / squareInchPerPerson;
	}

	function calculatePricePerPerson(pizza: Pizza): number {
		return pizza.price / (calculateSquareInches(pizza.size) / squareInchPerPerson);
	}

	function formatMoney(value: number): string {
		return `$${value.toFixed(2)}`;
	}

	function formatCents(value: number): string {
		return `${(value * 100).toFixed(1)}¢`;
	}

	// Pizzas with a price and quantity, cheapest per square inch first.
	const ranked = $derived(
		pizzas
			.filter(isComparable)
			.toSorted((a, b) => calculatePricePerSquareInch(a) - calculatePricePerSquareInch(b))
	);

	const best = $derived(ranked[0]);
	const worst = $derived(ranked.length > 1 ? ranked[ranked.length - 1] : undefined);

	// Equal unit prices share the win, so compare with a tolerance for float noise.
	function isTiedWithBest(pizza: Pizza): boolean {
		if (!best || !isComparable(pizza)) return false;
		const bestPrice = calculatePricePerSquareInch(best);
		return Math.abs(calculatePricePerSquareInch(pizza) - bestPrice) <= bestPrice * 1e-9;
	}

	const bestDeals = $derived(ranked.filter(isTiedWithBest));
	const allTied = $derived(ranked.length > 1 && bestDeals.length === ranked.length);

	function formatNames(list: Pizza[]): string {
		const names = list.map((p) => p.name || 'Unnamed pizza');
		return names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names[0];
	}

	const largestSize = $derived(Math.max(...pizzas.map((p) => +p.size), 1));

	function percentMoreThanBest(pizza: Pizza): number {
		if (!best) return 0;
		return (calculatePricePerSquareInch(pizza) / calculatePricePerSquareInch(best) - 1) * 100;
	}

	function percentCheaperThanWorst(): number {
		if (!best || !worst) return 0;
		return (1 - calculatePricePerSquareInch(best) / calculatePricePerSquareInch(worst)) * 100;
	}
</script>

<svelte:head>
	<title>Pizza Size Price Calculator</title>
</svelte:head>

<header class="mx-auto max-w-3xl pt-4 pb-10 sm:text-center lg:pt-12">
	<h1
		class="text-4xl font-black tracking-tight text-balance text-amber-950 text-shadow-amber-300 text-shadow-sm sm:text-5xl lg:text-6xl"
	>
		Pizza Size Price Calculator
	</h1>
	<p class="mt-4 text-lg text-pretty text-amber-900/80 sm:text-xl">
		Is two mediums cheaper than one large? Is Costco really a deal? Plug in what's on the menu and
		find out which order gets you the most pizza for your money.
	</p>
</header>

<section
	aria-live="polite"
	class="mx-auto mb-8 max-w-3xl rounded-2xl bg-amber-950 px-6 py-5 text-amber-50 shadow-xl shadow-amber-900/20 sm:px-8"
>
	{#if best && allTied}
		<p class="flex items-center gap-2 text-sm font-semibold tracking-wide text-amber-300 uppercase">
			<IconTrophy size={18} /> It's a tie
		</p>
		<p class="mt-1 text-2xl font-bold text-balance sm:text-3xl">
			Every pizza costs {formatCents(calculatePricePerSquareInch(best))}
			<span class="font-normal text-amber-200/80">per in²</span>
		</p>
		<p class="mt-2 text-amber-100/80">Pick whichever one you like best.</p>
	{:else if best && worst}
		<p class="flex items-center gap-2 text-sm font-semibold tracking-wide text-amber-300 uppercase">
			<IconTrophy size={18} />
			{bestDeals.length > 1 ? 'Best deals' : 'Best deal'}
		</p>
		<p class="mt-1 text-2xl font-bold text-balance sm:text-3xl">
			{formatNames(bestDeals)}
			<span class="font-normal text-amber-200/80">at</span>
			{formatCents(calculatePricePerSquareInch(best))}
			<span class="font-normal text-amber-200/80">per in²</span>
		</p>
		<p class="mt-2 text-amber-100/80">
			That's {percentCheaperThanWorst().toFixed(0)}% less per bite than {worst.name ||
				'the priciest option'}.
		</p>
	{:else if best}
		<p class="text-lg">Add another pizza to see which one is the better deal.</p>
	{:else}
		<p class="text-lg">Enter a price for at least two pizzas to compare them.</p>
	{/if}
</section>

<div
	class="mb-6 flex flex-col gap-3 rounded-2xl bg-white/50 p-4 shadow-sm ring-1 ring-amber-900/10 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:px-6"
>
	<div>
		<label for="squareInchPerPerson" class="font-semibold text-amber-950">Appetite</label>
		<p class="text-sm text-amber-900/70">
			How much each person eats. A typical adult serving is 40–50 in².
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<div class="flex rounded-lg bg-amber-900/10 p-1" role="group" aria-label="Appetite presets">
			{#each appetites as appetite (appetite.value)}
				<button
					class={clsx(
						'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
						squareInchPerPerson === appetite.value
							? 'bg-white text-amber-950 shadow-sm'
							: 'text-amber-900/70 hover:text-amber-950'
					)}
					aria-pressed={squareInchPerPerson === appetite.value}
					onclick={() => (squareInchPerPerson = appetite.value)}
				>
					{appetite.label}
				</button>
			{/each}
		</div>
		<div class="flex items-center gap-1.5">
			<input
				id="squareInchPerPerson"
				type="number"
				bind:value={squareInchPerPerson}
				min="10"
				max="100"
				step="5"
				class="w-20 rounded-lg border-amber-900/30 py-1.5 text-right tabular-nums focus:border-amber-600 focus:ring-amber-600"
			/>
			<span class="text-sm text-amber-900/70">in² / person</span>
		</div>
	</div>
</div>

<ul class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
	{#each pizzas as pizza, index (pizza)}
		{@const isBest = ranked.length > 1 && !allTied && isTiedWithBest(pizza)}
		{@const priced = hasPrice(pizza)}
		{@const comparable = isComparable(pizza)}
		{@const label = pizza.name || 'pizza'}
		<li
			aria-label={pizza.name || `Pizza ${index + 1}`}
			class={clsx(
				'relative flex flex-col rounded-2xl bg-white/70 shadow-lg ring-1 backdrop-blur-lg transition-shadow',
				isBest
					? 'shadow-amber-600/30 ring-2 ring-amber-500'
					: 'shadow-amber-900/10 ring-amber-900/10',
				!comparable && 'ring-2 ring-red-400'
			)}
		>
			{#if isBest}
				<span
					class="absolute -top-3 left-5 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold tracking-wide text-amber-950 uppercase shadow-sm"
				>
					<IconTrophy size={14} /> Best deal
				</span>
			{/if}

			<div class="flex gap-3 p-4 pb-4 sm:gap-4 sm:p-5">
				<div class="relative size-20 shrink-0 sm:size-28">
					<PizzaIllustration scale={+pizza.size / largestSize} muted={!comparable} />
					{#if getQuantity(pizza) > 1}
						<span
							class="absolute right-0 bottom-0 rounded-full bg-amber-950 px-2 py-0.5 text-xs font-bold text-amber-50 tabular-nums"
						>
							×{getQuantity(pizza)}
						</span>
					{/if}
				</div>

				<div class="flex min-w-0 flex-1 flex-col gap-2">
					<div class="flex items-start gap-2">
						<input
							class="min-w-0 flex-1 rounded-lg border-transparent bg-transparent px-2 py-1 -ml-2 text-lg font-bold text-amber-950 placeholder:text-amber-900/40 hover:border-amber-900/20 focus:border-amber-600 focus:bg-white focus:ring-amber-600"
							aria-label="Name"
							bind:value={pizza.name}
							placeholder="Name this pizza"
							type="text"
						/>
						<button
							class="-mt-1 -mr-2 rounded-lg p-2 text-amber-900/40 transition-colors hover:bg-red-100 hover:text-red-700"
							aria-label="Remove {label}"
							onclick={() => {
								pizzas = pizzas.filter((p) => p !== pizza);
							}}
						>
							<IconTrash size={18} />
						</button>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<label class="flex min-w-0 flex-col gap-1">
							<span class="text-xs font-medium text-amber-900/70">Size</span>
							<select
								class="w-full rounded-lg border-amber-900/30 py-1.5 tabular-nums focus:border-amber-600 focus:ring-amber-600"
								bind:value={pizza.size}
							>
								{#each sizes as size (size)}
									<option value={size}>{size}&Prime;</option>
								{/each}
							</select>
						</label>
						<label class="flex min-w-0 flex-col gap-1">
							<span class="text-xs font-medium text-amber-900/70">Price each</span>
							<div class="relative">
								<span
									class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-amber-900/50"
									>$</span
								>
								<input
									bind:value={pizza.price}
									class={clsx(
										'w-full rounded-lg py-1.5 pl-6 tabular-nums focus:border-amber-600 focus:ring-amber-600',
										priced ? 'border-amber-900/30' : 'border-red-400 bg-red-50'
									)}
									min="0"
									placeholder="0.00"
									step="0.01"
									type="number"
								/>
							</div>
						</label>
					</div>

					<div class="flex items-center justify-between gap-2">
						<span class="text-xs font-medium text-amber-900/70">Quantity</span>
						<div class="flex items-center rounded-lg ring-1 ring-amber-900/30">
							<button
								class="flex size-8 items-center justify-center rounded-l-lg text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-30"
								aria-label="Decrease quantity of {label}"
								disabled={getQuantity(pizza) <= 1}
								onclick={() => setQuantity(pizza, getQuantity(pizza) - 1)}
							>
								<IconMinus size={16} />
							</button>
							<input
								class="h-8 w-10 border-0 bg-transparent p-0 text-center font-semibold tabular-nums focus:ring-2 focus:ring-amber-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								aria-label="Quantity of {label}"
								bind:value={pizza.quantity}
								onblur={() => setQuantity(pizza, pizza.quantity)}
								inputmode="numeric"
								max="99"
								min="1"
								step="1"
								type="number"
							/>
							<button
								class="flex size-8 items-center justify-center rounded-r-lg text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-30"
								aria-label="Increase quantity of {label}"
								disabled={getQuantity(pizza) >= 99}
								onclick={() => setQuantity(pizza, getQuantity(pizza) + 1)}
							>
								<IconPlus size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-auto rounded-b-2xl border-t border-amber-900/10 bg-amber-50/70 px-5 py-4">
				{#if comparable}
					<div class="flex items-baseline justify-between gap-4">
						<div>
							<p class="text-xs font-medium text-amber-900/70">Per square inch</p>
							<p class="text-2xl font-bold text-amber-950 tabular-nums">
								{formatCents(calculatePricePerSquareInch(pizza))}
							</p>
						</div>
						<div class="text-right">
							<p class="text-xs font-medium text-amber-900/70">Per person</p>
							<p class="text-2xl font-bold text-amber-950 tabular-nums">
								{formatMoney(calculatePricePerPerson(pizza))}
							</p>
						</div>
					</div>
					{#if ranked.length > 1 && !allTied && !isBest}
						<p class="mt-1 text-sm font-medium text-red-800">
							{percentMoreThanBest(pizza).toFixed(0)}% more than the best deal
						</p>
					{/if}
					<dl
						class="mt-3 grid grid-cols-3 gap-2 border-t border-amber-900/10 pt-3 text-sm tabular-nums"
					>
						<div>
							<dt class="text-xs text-amber-900/70">Total</dt>
							<dd class="font-semibold text-amber-950">
								{formatMoney(calculateTotalPrice(pizza))}
							</dd>
						</div>
						<div>
							<dt class="text-xs text-amber-900/70">Area</dt>
							<dd class="font-semibold text-amber-950">
								{calculateTotalSquareInches(pizza).toFixed(0)} in²
							</dd>
						</div>
						<div>
							<dt class="text-xs text-amber-900/70">Feeds</dt>
							<dd class="font-semibold text-amber-950">
								{calculateServings(pizza).toFixed(1)}
							</dd>
						</div>
					</dl>
				{:else}
					<p class="py-6 text-center text-sm font-medium text-red-800">
						{priced
							? 'Set a quantity to see how this pizza stacks up.'
							: 'Enter a price to see how this pizza stacks up.'}
					</p>
				{/if}
			</div>
		</li>
	{/each}

	<li>
		<button
			class="flex size-full min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-900/25 bg-white/20 font-semibold text-amber-900/70 transition-colors hover:border-amber-700 hover:bg-white/50 hover:text-amber-950"
			onclick={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0, quantity: 1 }];
			}}
		>
			<IconPlus size={28} />
			Add a pizza
		</button>
	</li>
</ul>
