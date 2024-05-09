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

<h1 class="text-3xl lg:text-5xl font-bold text-white lg:text-center lg:py-8">
	Pizza Size Price Calculator
</h1>

<div class="grid lg:grid-cols-3 w-full py-8 gap-8">
	{#each pizzas as pizza}
		<div class="bg-yellow-500 p-3 rounded-3xl flex items-center">
			<div class="w-full grid gap-2 py-8 px-8 bg-white rounded-2xl">
				<div>
					<input
						class="w-full"
						bind:value={pizza.name}
						name="name"
						placeholder="Name"
						type="text"
					/>
				</div>
				<div class="w-full grid lg:grid-cols-2 gap-x-6 gap-y-2">
					<div>
						<select class="w-full" name="size" bind:value={pizza.size}>
							{#each sizes as size}
								<option value={size}>{size}&ldquo;</option>
							{/each}
						</select>
					</div>
					<div class="flex gap-1 items-center">
						<span class="text-gray-600 font-light" style={`scale: 1 1.35`}>$</span>
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
						class="py-2 px-4 text-red-700 rounded transition-colors hover:bg-red-600 hover:text-white -mr-4 -mb-4"
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

	<div class="bg-yellow-500 p-3 rounded-3xl flex items-stretch">
		<button
			class="p-8 w-full h-full min-h-[356px] flex justify-center items-center bg-yellow-50 rounded-2xl transition-colors text-3xl font-bold text-yellow-800 hover:bg-yellow-200"
			on:click={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0 }];
			}}
		>
			+
		</button>
	</div>
</div>
