<script lang="ts">
	import PizzaIllustration from '#lib/components/PizzaIllustration.svelte';
	import QuantityStepper from '#lib/components/QuantityStepper.svelte';
	import {
		IconArrowDown,
		IconArrowUp,
		IconArrowsSort,
		IconLayoutGrid,
		IconPlus,
		IconSelector,
		IconTable,
		IconTrash,
		IconTrophy
	} from '@tabler/icons-svelte';
	import { clsx } from 'clsx';
	import { onMount, untrack } from 'svelte';

	const views = [
		{ label: 'Cards', value: 'cards', icon: IconLayoutGrid },
		{ label: 'Table', value: 'table', icon: IconTable }
	] as const;

	type View = (typeof views)[number]['value'];

	const sortOptions = [
		{ label: 'Order added', value: 'added' },
		{ label: 'Name: A–Z', value: 'name-asc' },
		{ label: 'Name: Z–A', value: 'name-desc' },
		{ label: 'Price each: low–high', value: 'price-asc' },
		{ label: 'Price each: high–low', value: 'price-desc' },
		{ label: 'Per in²: best value', value: 'unit-asc' },
		{ label: 'Per in²: worst value', value: 'unit-desc' }
	] as const;

	type Sort = (typeof sortOptions)[number]['value'];
	type SortKey = 'name' | 'price' | 'unit';

	const viewStorageKey = 'pizza-view';
	const sortStorageKey = 'pizza-sort';

	let view = $state<View>('cards');
	let sort = $state<Sort>('added');

	// Remember the layout and sort per browser; storage can be unavailable
	// (private mode, blocked site data), so fall back to the defaults quietly.
	function load(key: string): string | null {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	}

	function save(key: string, value: string) {
		try {
			localStorage.setItem(key, value);
		} catch {
			// ignore
		}
	}

	onMount(() => {
		const savedView = load(viewStorageKey);
		if (views.some((v) => v.value === savedView)) view = savedView as View;
		const savedSort = load(sortStorageKey);
		if (sortOptions.some((s) => s.value === savedSort)) sort = savedSort as Sort;
	});

	function setView(next: View) {
		view = next;
		save(viewStorageKey, next);
	}

	function setSort(next: Sort) {
		sort = next;
		save(sortStorageKey, next);
	}

	// Column headers toggle direction when already sorted by that column,
	// otherwise start ascending.
	function toggleSort(key: SortKey) {
		setSort(sort === `${key}-asc` ? `${key}-desc` : `${key}-asc`);
	}

	function sortDirection(key: SortKey): 'ascending' | 'descending' | undefined {
		if (sort === `${key}-asc`) return 'ascending';
		if (sort === `${key}-desc`) return 'descending';
	}

	const sizes = ['10', '12', '14', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30'];

	const appetites = [
		{ label: 'Light', value: 30 },
		{ label: 'Normal', value: 40 },
		{ label: 'Hungry', value: 50 }
	];

	let pizzas = $state([
		{ name: 'Dominos Large', size: '14', price: 10.99, quantity: 1 },
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

	// Full-size pizzas stacked with a small diagonal offset (percent of the
	// box), centered as a group. Orders above 4 still draw 4.
	const stackOffset = 8;

	function getPizzaStack(pizza: Pizza): number[] {
		const count = Math.max(1, Math.min(4, getQuantity(pizza)));
		return Array.from({ length: count }, (_, i) => (i - (count - 1) / 2) * stackOffset);
	}

	function addPizza() {
		pizzas = [...pizzas, { name: '', size: '14', price: 0, quantity: 1 }];
	}

	function removePizza(pizza: Pizza) {
		pizzas = pizzas.filter((p) => p !== pizza);
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

	// Pizzas missing the sorted value (no name, no price) always go last so a
	// freshly added pizza lands at the bottom, next to the add button.
	function comparePizzas(a: Pizza, b: Pizza, key: SortKey): number | undefined {
		if (key === 'name') {
			if (!a.name || !b.name) return undefined;
			return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
		}
		if (key === 'price') {
			if (!hasPrice(a) || !hasPrice(b)) return undefined;
			return +a.price - +b.price;
		}
		if (!isComparable(a) || !isComparable(b)) return undefined;
		return calculatePricePerSquareInch(a) - calculatePricePerSquareInch(b);
	}

	function hasSortValue(pizza: Pizza, key: SortKey): boolean {
		if (key === 'name') return !!pizza.name;
		if (key === 'price') return hasPrice(pizza);
		return isComparable(pizza);
	}

	function sortPizzas(list: Pizza[], by: Sort): Pizza[] {
		if (by === 'added') return list;
		const [key, dir] = by.split('-') as [SortKey, 'asc' | 'desc'];
		return list.toSorted((a, b) => {
			const missing = +!hasSortValue(a, key) - +!hasSortValue(b, key);
			if (missing) return missing;
			const order = comparePizzas(a, b, key) ?? 0;
			return dir === 'asc' ? order : -order;
		});
	}

	// Re-sort when the sort, the set of pizzas, or a committed edit (a change
	// event) changes, but not on every keystroke, so a row doesn't jump away
	// while someone is typing in it.
	let sortVersion = $state(0);

	const sortedPizzas = $derived.by(() => {
		const list = pizzas;
		const by = sort;
		void sortVersion;
		return untrack(() => sortPizzas(list, by));
	});

	function resort() {
		sortVersion++;
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
		<div class="ml-auto flex items-center gap-2 sm:ml-0">
			<span aria-hidden="true" class="mx-1 hidden h-6 w-px bg-amber-900/15 sm:block"></span>
			<label class="relative flex items-center">
				<span class="sr-only">Sort pizzas</span>
				<IconArrowsSort
					size={16}
					class="pointer-events-none absolute left-2.5 text-amber-900/60"
					aria-hidden="true"
				/>
				<select
					class="rounded-lg border-amber-900/30 py-1.5 pl-8 text-sm text-amber-950 focus:border-amber-600 focus:ring-amber-600"
					value={sort}
					onchange={(e) => setSort(e.currentTarget.value as Sort)}
				>
					{#each sortOptions as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
			<div class="flex rounded-lg bg-amber-900/10 p-1" role="group" aria-label="Layout">
				{#each views as option (option.value)}
					<button
						class={clsx(
							'rounded-md p-1.5 transition-colors',
							view === option.value
								? 'bg-white text-amber-950 shadow-sm'
								: 'text-amber-900/70 hover:text-amber-950'
						)}
						aria-label="{option.label} view"
						aria-pressed={view === option.value}
						title="{option.label} view"
						onclick={() => setView(option.value)}
					>
						<option.icon size={18} />
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

{#if view === 'table'}
	<div
		class="overflow-x-auto rounded-2xl bg-white/70 shadow-lg ring-1 shadow-amber-900/10 ring-amber-900/10 backdrop-blur-lg"
	>
		<table class="w-full text-left text-sm tabular-nums">
			<thead class="border-b border-amber-900/10 bg-amber-50/70 text-xs text-amber-900/70">
				<tr>
					<th scope="col" class="py-3 pr-2 pl-4 sm:pl-5" aria-sort={sortDirection('name')}>
						<button
							class={clsx(
								'group inline-flex items-center gap-1 font-medium hover:text-amber-950',
								sortDirection('name') && 'text-amber-950'
							)}
							onclick={() => toggleSort('name')}
						>
							Pizza
							{#if sortDirection('name') === 'ascending'}
								<IconArrowUp size={14} />
							{:else if sortDirection('name') === 'descending'}
								<IconArrowDown size={14} />
							{:else}
								<IconSelector size={14} class="opacity-40 group-hover:opacity-100" />
							{/if}
						</button>
					</th>
					<th scope="col" class="px-2 py-3 font-medium">Size</th>
					<th scope="col" class="px-2 py-3" aria-sort={sortDirection('price')}>
						<button
							class={clsx(
								'group inline-flex items-center gap-1 font-medium hover:text-amber-950',
								sortDirection('price') && 'text-amber-950'
							)}
							onclick={() => toggleSort('price')}
						>
							Price each
							{#if sortDirection('price') === 'ascending'}
								<IconArrowUp size={14} />
							{:else if sortDirection('price') === 'descending'}
								<IconArrowDown size={14} />
							{:else}
								<IconSelector size={14} class="opacity-40 group-hover:opacity-100" />
							{/if}
						</button>
					</th>
					<th scope="col" class="px-2 py-3 font-medium">Quantity</th>
					<th scope="col" class="px-2 py-3 text-right" aria-sort={sortDirection('unit')}>
						<button
							class={clsx(
								'group inline-flex items-center gap-1 font-medium hover:text-amber-950',
								sortDirection('unit') && 'text-amber-950'
							)}
							onclick={() => toggleSort('unit')}
						>
							Per in²
							{#if sortDirection('unit') === 'ascending'}
								<IconArrowUp size={14} />
							{:else if sortDirection('unit') === 'descending'}
								<IconArrowDown size={14} />
							{:else}
								<IconSelector size={14} class="opacity-40 group-hover:opacity-100" />
							{/if}
						</button>
					</th>
					<th scope="col" class="px-2 py-3 text-right font-medium">Per person</th>
					<th scope="col" class="px-2 py-3 text-right font-medium">Total</th>
					<th scope="col" class="px-2 py-3 text-right font-medium">Area</th>
					<th scope="col" class="px-2 py-3 text-right font-medium">Feeds</th>
					<th scope="col" class="py-3 pr-4 pl-2 sm:pr-5"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-amber-900/10" onchange={resort}>
				{#each sortedPizzas as pizza (pizza)}
					{@const index = pizzas.indexOf(pizza)}
					{@const isBest = ranked.length > 1 && !allTied && isTiedWithBest(pizza)}
					{@const priced = hasPrice(pizza)}
					{@const comparable = isComparable(pizza)}
					{@const label = pizza.name || 'pizza'}
					<tr
						aria-label={pizza.name || `Pizza ${index + 1}`}
						class={clsx(isBest && 'bg-amber-100/80', !comparable && 'bg-red-50/70')}
					>
						<th scope="row" class="py-2 pr-2 pl-4 text-left font-normal sm:pl-5">
							<div class="flex items-center gap-2">
								<div class="relative size-9 shrink-0">
									<PizzaIllustration scale={+pizza.size / largestSize} muted={!comparable} />
									{#if getQuantity(pizza) > 1}
										<span
											class="absolute -right-1.5 -bottom-1 rounded-full bg-amber-950 px-1.5 text-[0.65rem] leading-4 font-bold text-amber-50 tabular-nums"
										>
											×{getQuantity(pizza)}
										</span>
									{/if}
								</div>
								<div class="min-w-36 flex-1">
									<input
										class="w-full rounded-lg border-transparent bg-transparent px-2 py-1 font-bold text-amber-950 placeholder:text-amber-900/40 hover:border-amber-900/20 focus:border-amber-600 focus:bg-white focus:ring-amber-600"
										aria-label="Name of pizza {index + 1}"
										bind:value={pizza.name}
										placeholder="Name this pizza"
										type="text"
									/>
									{#if isBest}
										<span
											class="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-amber-950 uppercase"
										>
											<IconTrophy size={12} /> Best deal
										</span>
									{/if}
								</div>
							</div>
						</th>
						<td class="px-2 py-2">
							<select
								class="w-20 rounded-lg border-amber-900/30 py-1.5 text-sm tabular-nums focus:border-amber-600 focus:ring-amber-600"
								aria-label="Size of {label}"
								bind:value={pizza.size}
							>
								{#each sizes as size (size)}
									<option value={size}>{size}&Prime;</option>
								{/each}
							</select>
						</td>
						<td class="px-2 py-2">
							<div class="relative w-24">
								<span
									class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-amber-900/50"
									>$</span
								>
								<input
									bind:value={pizza.price}
									aria-label="Price of {label}"
									class={clsx(
										'w-full rounded-lg py-1.5 pl-6 text-sm tabular-nums focus:border-amber-600 focus:ring-amber-600',
										priced ? 'border-amber-900/30' : 'border-red-400 bg-red-50'
									)}
									min="0"
									placeholder="0.00"
									step="0.01"
									type="number"
								/>
							</div>
						</td>
						<td class="px-2 py-2">
							<QuantityStepper bind:value={pizza.quantity} {label} oncommit={resort} />
						</td>
						{#if comparable}
							<td class="px-2 py-2 text-right">
								<span class="text-base font-bold text-amber-950">
									{formatCents(calculatePricePerSquareInch(pizza))}
								</span>
								{#if ranked.length > 1 && !allTied && !isBest}
									<span class="block text-xs font-medium whitespace-nowrap text-red-800">
										+{percentMoreThanBest(pizza).toFixed(0)}% vs best
									</span>
								{/if}
							</td>
							<td class="px-2 py-2 text-right font-semibold text-amber-950">
								{formatMoney(calculatePricePerPerson(pizza))}
							</td>
							<td class="px-2 py-2 text-right text-amber-950">
								{formatMoney(calculateTotalPrice(pizza))}
							</td>
							<td class="px-2 py-2 text-right whitespace-nowrap text-amber-950">
								{calculateTotalSquareInches(pizza).toFixed(0)} in²
							</td>
							<td class="px-2 py-2 text-right text-amber-950">
								{calculateServings(pizza).toFixed(1)}
							</td>
						{:else}
							<td colspan="5" class="px-2 py-2 text-center text-sm font-medium text-red-800">
								{priced ? 'Set a quantity to compare.' : 'Enter a price to compare.'}
							</td>
						{/if}
						<td class="py-2 pr-4 pl-2 text-right sm:pr-5">
							<button
								class="rounded-lg p-2 text-amber-900/40 transition-colors hover:bg-red-100 hover:text-red-700"
								aria-label="Remove {label}"
								onclick={() => removePizza(pizza)}
							>
								<IconTrash size={18} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<button
			class="flex w-full items-center justify-center gap-2 border-t border-amber-900/10 px-4 py-3 font-semibold text-amber-900/70 transition-colors hover:bg-white/50 hover:text-amber-950"
			onclick={addPizza}
		>
			<IconPlus size={20} />
			Add a pizza
		</button>
	</div>
{:else}
	<ul class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" onchange={resort}>
		{#each sortedPizzas as pizza (pizza)}
			{@const index = pizzas.indexOf(pizza)}
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
						{#each getPizzaStack(pizza) as offset, i (i)}
							<div class="absolute inset-0 drop-shadow-sm" style:translate="{offset}% {offset}%">
								<PizzaIllustration scale={+pizza.size / largestSize} muted={!comparable} />
							</div>
						{/each}
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
								onclick={() => removePizza(pizza)}
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
							<QuantityStepper bind:value={pizza.quantity} {label} oncommit={resort} />
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
				onclick={addPizza}
			>
				<IconPlus size={28} />
				Add a pizza
			</button>
		</li>
	</ul>
{/if}
