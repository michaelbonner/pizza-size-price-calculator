<script lang="ts">
	import DollarSign from '#lib/components/DollarSign.svelte';
	import { IconArrowDown, IconArrowsSort, IconArrowUp } from '@tabler/icons-svelte';
	import { clsx } from 'clsx';

	const sizes = ['10', '12', '14', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30'];

	let pizzas = $state([
		{ name: 'Dominos Medium', size: '12', price: 6.99, quantity: 2 },
		{ name: 'Little Caesars Large', size: '14', price: 6.99, quantity: 1 },
		{ name: 'Costco', size: '18', price: 9.95, quantity: 1 }
	]);

	let squareInchPerPerson = $state(40);

	type Pizza = (typeof pizzas)[number];
	type SortKey =
		| 'name'
		| 'size'
		| 'quantity'
		| 'price'
		| 'totalPrice'
		| 'squareInches'
		| 'pricePerSquareInch'
		| 'servings'
		| 'pricePerPerson';

	const columns: { key: SortKey; label: string }[] = [
		{ key: 'name', label: 'Name' },
		{ key: 'size', label: 'Size (inches)' },
		{ key: 'quantity', label: 'Qty' },
		{ key: 'price', label: 'Price (each)' },
		{ key: 'totalPrice', label: 'Total Price' },
		{ key: 'squareInches', label: 'Total in²' },
		{ key: 'pricePerSquareInch', label: '$ / in²' },
		{ key: 'servings', label: 'Servings' },
		{ key: 'pricePerPerson', label: '$ / Person' }
	];

	let sortKey = $state<SortKey>('pricePerPerson');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	function getQuantity(pizza: Pizza): number {
		const quantity = Math.floor(+pizza.quantity);
		return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
	}

	function setQuantity(pizza: Pizza, quantity: number) {
		pizza.quantity = Math.max(1, Math.min(99, Math.floor(quantity) || 1));
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

	function getValue(pizza: Pizza, key: SortKey): number | string {
		switch (key) {
			case 'name':
				return pizza.name.toLowerCase();
			case 'size':
				return +pizza.size;
			case 'quantity':
				return getQuantity(pizza);
			case 'price':
				return pizza.price;
			case 'totalPrice':
				return calculateTotalPrice(pizza);
			case 'squareInches':
				return calculateTotalSquareInches(pizza);
			case 'pricePerSquareInch':
				return calculatePricePerSquareInch(pizza);
			case 'servings':
				return calculateServings(pizza);
			case 'pricePerPerson':
				return calculatePricePerPerson(pizza);
			default:
				return 0;
		}
	}

	const sortedPizzas = $derived.by(() => {
		if (!sortKey) return pizzas;

		return [...pizzas].sort((a, b) => {
			const aVal = sortKey ? getValue(a, sortKey) : 0;
			const bVal = sortKey ? getValue(b, sortKey) : 0;

			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	});

	function handleSort(key: SortKey) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}
</script>

<svelte:head>
	<title>Pizza Size Price Calculator</title>
</svelte:head>

<div class="prose prose-lg lg:mx-auto lg:py-16">
	<h1
		class="text-amber-900 lg:text-center text-shadow-sm text-shadow-amber-400 text-4xl lg:text-5xl"
	>
		<span aria-hidden="true" class="hidden lg:inline">🍕</span> Pizza Size Price Calculator
	</h1>
	<p class="lg:text-center text-amber-800">
		Have you ever wondered if ordering two medium pizzas is cheaper than getting one large? Or
		whether Costco's pizza is a good deal? Now you don't have to wonder.
	</p>
</div>

<div class="py-8 mt-6">
	<p class="text-amber-800 mb-3">
		Set the quantity to compare orders like two mediums against one large. Totals reflect the
		quantity; <span class="whitespace-nowrap">$ / in²</span> and $ / Person show the value of each order.
	</p>
	<div class="overflow-x-auto bg-white/20 rounded-xl shadow-lg backdrop-blur-lg">
		<table class="w-full border-collapse">
			<thead class="bg-amber-500/30">
				<tr>
					{#each columns as column (column.key)}
						<th
							class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
							aria-sort={sortKey === column.key
								? sortDirection === 'asc'
									? 'ascending'
									: 'descending'
								: undefined}
						>
							<button
								class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
								onclick={() => handleSort(column.key)}
							>
								{column.label}
								<span class="text-xs">
									{#if sortKey === column.key}
										{#if sortDirection === 'asc'}
											<IconArrowUp size="16" />
										{:else}
											<IconArrowDown size="16" />
										{/if}
									{:else}
										<IconArrowsSort size="18" class="opacity-20" />
									{/if}
								</span>
							</button>
						</th>
					{/each}
					<th class="px-4 py-3 text-amber-900 font-semibold border-b-2 border-amber-900/20">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedPizzas as pizza (pizza)}
					{@const originalIndex = pizzas.indexOf(pizza)}
					<tr
						class={clsx(
							'border-b border-amber-900/10 transition-colors',
							!pizzas[originalIndex].price
								? 'bg-red-500/30 hover:bg-red-500/20'
								: 'hover:bg-white/40'
						)}
					>
						<td class="px-4 py-3 text-amber-900">
							<input
								class="w-full min-w-32 border-amber-900/60 rounded-md"
								bind:value={pizzas[originalIndex].name}
								placeholder="Name"
								type="text"
							/>
						</td>
						<td class="px-4 py-3 text-amber-900">
							<select
								class="w-full border-amber-900/60 rounded-md"
								bind:value={pizzas[originalIndex].size}
							>
								{#each sizes as size (size)}
									<option value={size}>{size}&ldquo;</option>
								{/each}
							</select>
						</td>
						<td class="px-4 py-3 text-amber-900">
							<div class="flex items-center">
								<button
									class="size-9 shrink-0 rounded-l-md border border-r-0 border-amber-900/60 bg-amber-500/20 font-semibold hover:bg-amber-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
									aria-label="Decrease quantity of {pizza.name || 'pizza'}"
									disabled={getQuantity(pizza) <= 1}
									onclick={() => setQuantity(pizzas[originalIndex], getQuantity(pizza) - 1)}
								>
									&minus;
								</button>
								<input
									class="h-9 w-14 border-amber-900/60 px-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									aria-label="Quantity of {pizza.name || 'pizza'}"
									bind:value={pizzas[originalIndex].quantity}
									onblur={() => setQuantity(pizzas[originalIndex], pizza.quantity)}
									inputmode="numeric"
									max="99"
									min="1"
									step="1"
									type="number"
								/>
								<button
									class="size-9 shrink-0 rounded-r-md border border-l-0 border-amber-900/60 bg-amber-500/20 font-semibold hover:bg-amber-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
									aria-label="Increase quantity of {pizza.name || 'pizza'}"
									disabled={getQuantity(pizza) >= 99}
									onclick={() => setQuantity(pizzas[originalIndex], getQuantity(pizza) + 1)}
								>
									+
								</button>
							</div>
						</td>
						<td class="px-4 py-3 text-amber-900">
							<div class="flex gap-1 items-center">
								<span class="font-light text-amber-900/60">$</span>
								<input
									bind:value={pizzas[originalIndex].price}
									class="w-full min-w-20 border-amber-900/60 rounded-md pl-2"
									min="0"
									placeholder="Price"
									step="0.01"
									type="number"
								/>
							</div>
						</td>
						<td class="px-4 py-3 text-amber-900 font-semibold">
							<DollarSign />{calculateTotalPrice(pizza).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							{calculateTotalSquareInches(pizza).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							<DollarSign />{calculatePricePerSquareInch(pizza).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							{calculateServings(pizza).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							<DollarSign />{calculatePricePerPerson(pizza).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							<button
								class="py-2 px-4 text-red-800 rounded-lg transition-colors hover:text-white hover:bg-red-900/90"
								onclick={() => {
									pizzas = pizzas.filter((p) => p !== pizza);
								}}
							>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6">
		<button
			class="py-2 px-6 bg-red-900/90 text-red-100 rounded-lg transition-colors hover:bg-red-800 font-medium"
			onclick={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0, quantity: 1 }];
			}}
		>
			+ Add Pizza
		</button>
	</div>
</div>

<div class="bg-white/40 rounded-xl shadow-lg backdrop-blur-lg p-6 mt-6">
	<div class="flex flex-col gap-4">
		<div>
			<label for="squareInchPerPerson" class="block text-amber-900 font-semibold mb-2">
				Square Inches per Person
			</label>
			<p class="text-sm text-amber-800 mb-3">
				Adjust how much pizza each person typically eats. A typical adult serving is 40-50 square
				inches.
			</p>
			<div class="flex flex-wrap gap-2 items-center">
				<input
					id="squareInchPerPerson"
					type="number"
					bind:value={squareInchPerPerson}
					min="10"
					max="100"
					step="5"
					class="border-amber-900/60 rounded-md px-3 py-2 w-24"
				/>
				<span class="text-amber-900">in²</span>
				<div class="flex gap-2 ml-4 flex-wrap">
					<button
						onclick={() => (squareInchPerPerson = 30)}
						class="px-3 py-1 bg-amber-500/30 text-amber-900 rounded-md hover:bg-amber-500/50 transition-colors text-sm"
					>
						Light (30)
					</button>
					<button
						onclick={() => (squareInchPerPerson = 40)}
						class="px-3 py-1 bg-amber-500/30 text-amber-900 rounded-md hover:bg-amber-500/50 transition-colors text-sm"
					>
						Normal (40)
					</button>
					<button
						onclick={() => (squareInchPerPerson = 50)}
						class="px-3 py-1 bg-amber-500/30 text-amber-900 rounded-md hover:bg-amber-500/50 transition-colors text-sm"
					>
						Hungry (50)
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
