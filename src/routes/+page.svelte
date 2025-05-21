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

<div class="grid gap-y-8 gap-x-4 xl:gap-8 py-8 w-full lg:grid-cols-3 mt-6 text-amber-900">
	{#each pizzas as pizza, index (index)}
		<div class="flex items-center p-3 bg-amber-500/30 rounded-xl backdrop-blur-sm shadow-xs">
			<div class="grid gap-2 py-8 px-8 w-full bg-white/80 rounded-lg">
				<div>
					<label for="name-{index}" class="sr-only">Name</label>
					<input
						id="name-{index}"
						class="w-full border-amber-900/60 rounded-md"
						bind:value={pizza.name}
						name="name"
						placeholder="Name"
						type="text"
					/>
				</div>
				<div class="grid gap-y-2 gap-x-6 w-full lg:grid-cols-2">
					<div>
						<label for="size-{index}" class="sr-only">Size</label>
						<select
							id="size-{index}"
							class="w-full border-amber-900/60 rounded-md"
							name="size"
							bind:value={pizza.size}
						>
							{#each sizes as size (size)}
								<option value={size}>{size}&ldquo;</option>
							{/each}
						</select>
					</div>
					<div class="flex gap-1 items-center">
						<span class="font-light text-amber-900/60" style="scale: 1 1.35">$</span>
						<label for="price-{index}" class="sr-only">Price</label>
						<input
							id="price-{index}"
							bind:value={pizza.price}
							class="w-full border-amber-900/60 rounded-md"
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

	<div
		class="flex items-center p-3 bg-amber-500/30 rounded-xl backdrop-blur-sm shadow-xs justify-center min-h-[356px] relative hover:bg-amber-500/40 transition-colors"
	>
		<button
			class="size-24 rounded-full bg-red-900/90 flex justify-center items-center p-8 text-3xl lg:text-7xl font-light text-red-100 transition-colors hover:bg-red-800 group"
			onclick={() => {
				pizzas = [...pizzas, { name: '', size: '14', price: 0 }];
			}}
		>
			<span
				class="-translate-y-1 transition-transform group-hover:rotate-360 group-hover:-translate-y-1.5 group-hover:scale-110"
				>+</span
			>
			<span class="sr-only">Add pizza</span>
			<span class="absolute inset-0"></span>
		</button>
	</div>
</div>
