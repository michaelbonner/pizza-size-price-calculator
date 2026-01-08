<script lang="ts">
	import DollarSign from '$lib/components/DollarSign.svelte';
	import { IconArrowDown, IconArrowsSort, IconArrowUp } from '@tabler/icons-svelte';
	import { clsx } from 'clsx';

	const sizes = ['10', '12', '14', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30'];

	let pizzas = $state([
		{ name: 'Dominos Medium', size: '12', price: 6.99 },
		{ name: 'Little Caesars Large', size: '14', price: 6.99 },
		{ name: 'Costco', size: '18', price: 9.95 }
	]);

	const squareInchPerPerson = 40;

	type Pizza = (typeof pizzas)[number];
	type SortKey =
		| 'name'
		| 'size'
		| 'price'
		| 'squareInches'
		| 'pricePerSquareInch'
		| 'servingsPerPizza'
		| 'pricePerPerson';

	let sortKey = $state<SortKey | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	function calculateSquareInches(size: string): number {
		return Math.PI * Math.pow(+size / 2, 2);
	}

	function calculatePricePerSquareInch(price: number, size: string): number {
		return price / calculateSquareInches(size);
	}

	function calculateServingsPerPizza(size: string): number {
		return calculateSquareInches(size) / squareInchPerPerson;
	}

	function calculatePricePerPerson(price: number, size: string): number {
		return price / calculateServingsPerPizza(size);
	}

	function getValue(pizza: Pizza, key: SortKey): number | string {
		switch (key) {
			case 'name':
				return pizza.name.toLowerCase();
			case 'size':
				return +pizza.size;
			case 'price':
				return pizza.price;
			case 'squareInches':
				return calculateSquareInches(pizza.size);
			case 'pricePerSquareInch':
				return calculatePricePerSquareInch(pizza.price, pizza.size);
			case 'servingsPerPizza':
				return calculateServingsPerPizza(pizza.size);
			case 'pricePerPerson':
				return calculatePricePerPerson(pizza.price, pizza.size);
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
	<div class="overflow-x-auto bg-white/20 rounded-xl shadow-lg backdrop-blur-lg">
		<table class="w-full border-collapse">
			<thead class="bg-amber-500/30">
				<tr>
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('name')}
						>
							Name
							<span class="text-xs">
								{#if sortKey === 'name'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('size')}
						>
							Size (inches)
							<span class="text-xs">
								{#if sortKey === 'size'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('price')}
						>
							Price
							<span class="text-xs">
								{#if sortKey === 'price'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('squareInches')}
						>
							Square Inches
							<span class="text-xs">
								{#if sortKey === 'squareInches'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('pricePerSquareInch')}
						>
							$ / in²
							<span class="text-xs">
								{#if sortKey === 'pricePerSquareInch'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('servingsPerPizza')}
						>
							Servings / Pizza
							<span class="text-xs">
								{#if sortKey === 'servingsPerPizza'}
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
					<th
						class="px-4 py-3 text-left text-amber-900 font-semibold border-b-2 border-amber-900/20"
					>
						<button
							class="flex items-center gap-2 hover:text-amber-700 transition-colors cursor-pointer select-none text-left"
							onclick={() => handleSort('pricePerPerson')}
						>
							$ / Person
							<span class="text-xs">
								{#if sortKey === 'pricePerPerson'}
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
					<th class="px-4 py-3 text-amber-900 font-semibold border-b-2 border-amber-900/20">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedPizzas as pizza, index (pizza)}
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
								class="w-full border-amber-900/60 rounded-md"
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
							<div class="flex gap-1 items-center">
								<span class="font-light text-amber-900/60">$</span>
								<input
									bind:value={pizzas[originalIndex].price}
									class="w-full border-amber-900/60 rounded-md pl-2"
									min="0"
									placeholder="Price"
									step="0.01"
									type="number"
								/>
							</div>
						</td>
						<td class="px-4 py-3 text-amber-900">
							{calculateSquareInches(pizza.size).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							<DollarSign />{calculatePricePerSquareInch(pizza.price, pizza.size).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							{calculateServingsPerPizza(pizza.size).toFixed(2)}
						</td>
						<td class="px-4 py-3 text-amber-900">
							<DollarSign />{calculatePricePerPerson(pizza.price, pizza.size).toFixed(2)}
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
				pizzas = [...pizzas, { name: '', size: '14', price: 0 }];
			}}
		>
			+ Add Pizza
		</button>
	</div>
</div>
