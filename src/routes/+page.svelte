<script lang="ts">
	const sizes = ['10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'];

	let pizzas = [
		{ name: 'Dominos Medium', size: '12', price: 6.99 },
		{ name: 'Little Caesars', size: '14', price: 6.99 },
		{ name: 'Costco', size: '18', price: 9.95 }
	];

	const squareInchPerPerson = 40;
</script>

<svelte:head>
	<title>Pizza Size Price Calculator</title>
</svelte:head>

<h1 class="text-3xl font-bold text-white lg:py-8 lg:text-5xl lg:text-center">
	Pizza Size Price Calculator
</h1>

<div class="grid gap-8 py-8 w-full lg:grid-cols-3">
	{#each pizzas as pizza}
		<div class="flex items-center p-3 bg-yellow-500 rounded-3xl">
			<div class="grid gap-2 py-8 px-8 w-full bg-white rounded-2xl">
				<div>
					<input
						class="w-full"
						bind:value={pizza.name}
						name="name"
						placeholder="Name"
						type="text"
					/>
				</div>
				<div class="grid gap-y-2 gap-x-6 w-full lg:grid-cols-2">
					<div>
						<select class="w-full" name="size" bind:value={pizza.size}>
							{#each sizes as size}
								<option value={size}>{size}&ldquo;</option>
							{/each}
						</select>
					</div>
					<div class="flex gap-1 items-center">
						<span class="font-light text-gray-600" style={`scale: 1 1.35`}>$</span>
						<input
							bind:value={pizza.price}
							class="w-full"
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
						class="py-2 px-4 -mr-4 -mb-4 text-red-700 rounded transition-colors hover:text-white hover:bg-red-600"
						on:click={() => {
							pizzas = pizzas.filter((p) => p !== pizza);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/each}

	<div class="flex items-stretch p-3 bg-yellow-500 rounded-3xl">
		<button
			class="flex justify-center items-center p-8 w-full h-full text-3xl font-bold text-yellow-800 bg-yellow-50 rounded-2xl transition-colors hover:bg-yellow-200 min-h-[356px]"
			on:click={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0 }];
			}}
		>
			+
		</button>
	</div>
</div>
