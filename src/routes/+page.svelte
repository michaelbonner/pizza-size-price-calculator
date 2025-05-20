<script lang="ts">
	const sizes = ['10', '12', '14', '16', '17', '18', '19', '20', '22', '24', '26', '28', '30'];

	let pizzas = $state([
		{ name: 'Dominos Medium', size: '12', price: 6.99 },
		{ name: 'Little Caesars', size: '14', price: 6.99 },
		{ name: 'Costco', size: '18', price: 9.95 }
	]);

	const squareInchPerPerson = 40;
</script>

<svelte:head>
	<title>Pizza Size Price Calculator</title>
</svelte:head>

<div class="prose prose-lg mx-auto">
	<h1 class="text-amber-900 lg:text-center text-shadow-sm text-shadow-amber-400">
		<span aria-hidden="true" class="hidden lg:inline">🍕</span> Pizza Size Price Calculator
	</h1>
	<p class="lg:text-center text-amber-800">
		Have you ever wondered if ordering two medium pizzas is cheaper than getting one large? Or
		whether Costco's pizza is a good deal? Now you don't have to wonder.
	</p>
</div>

<div class="grid gap-8 py-8 w-full lg:grid-cols-3 mt-6 text-amber-900">
	{#each pizzas as pizza}
		<div class="flex items-center p-3 bg-amber-300 rounded-xl shadow-xs">
			<div class="grid gap-2 py-8 px-8 w-full bg-white rounded-lg">
				<div>
					<label for="name" class="sr-only">Name</label>
					<input
						id="name"
						class="w-full border-amber-900 rounded"
						bind:value={pizza.name}
						name="name"
						placeholder="Name"
						type="text"
					/>
				</div>
				<div class="grid gap-y-2 gap-x-6 w-full lg:grid-cols-2">
					<div>
						<label for="size" class="sr-only">Size</label>
						<select
							id="size"
							class="w-full border-amber-900 rounded"
							name="size"
							bind:value={pizza.size}
						>
							{#each sizes as size}
								<option value={size}>{size}&ldquo;</option>
							{/each}
						</select>
					</div>
					<div class="flex gap-1 items-center">
						<span class="font-light text-amber-900/60" style={`scale: 1 1.35`}>$</span>
						<label for="price" class="sr-only">Price</label>
						<input
							id="price"
							bind:value={pizza.price}
							class="w-full border-amber-900 rounded"
							min="0"
							name="price"
							placeholder="Price"
							step="0.01"
							type="number"
						/>
					</div>
				</div>

				<hr class="my-4" />

				<div>
					in<sup>2</sup>: {(Math.PI * Math.pow(+pizza.size / 2, 2)).toFixed(2)}
				</div>
				<div>
					$ / in<sup>2</sup>: ${(+pizza.price / (Math.PI * Math.pow(+pizza.size / 2, 2))).toFixed(
						2
					)}
				</div>
				<div>
					Servings / pizza: {(
						(Math.PI * Math.pow(+pizza.size / 2, 2)) /
						squareInchPerPerson
					).toFixed(2)}
				</div>
				<div>
					$ / person: ${(
						pizza.price /
						((Math.PI * Math.pow(+pizza.size / 2, 2)) / squareInchPerPerson)
					).toFixed(2)}
				</div>
				<div class="flex justify-end">
					<button
						class="py-2 px-4 -mr-4 -mb-4 text-red-700 rounded-sm transition-colors hover:text-white hover:bg-red-600"
						onclick={() => {
							pizzas = pizzas.filter((p) => p !== pizza);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/each}

	<div class="flex items-stretch p-3 bg-amber-300 rounded-xl shadow-xs">
		<button
			class="flex justify-center items-center p-8 w-full h-full text-3xl font-bold text-amber-800 bg-amber-50 rounded-lg transition-colors hover:bg-amber-200 min-h-[356px]"
			onclick={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0 }];
			}}
		>
			+
		</button>
	</div>
</div>
