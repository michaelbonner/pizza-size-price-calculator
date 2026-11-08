import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Pizza Size Price Calculator' })).toBeVisible();
});

test('quantity stepper updates the total price', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const quantity = page.getByRole('spinbutton', { name: 'Quantity of Costco' });
	await expect(quantity).toHaveValue('1');
	await page.getByRole('button', { name: 'Increase quantity of Costco' }).click();
	await expect(quantity).toHaveValue('2');
	await expect(page.getByRole('listitem', { name: 'Costco' })).toContainText('19.90');
	await page.getByRole('button', { name: 'Decrease quantity of Costco' }).click();
	await expect(quantity).toHaveValue('1');
});

test('a pizza with no quantity is not named the best deal', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const costco = page.getByRole('listitem', { name: 'Costco' });
	await expect(costco).toContainText('Best deal');
	await page.getByRole('spinbutton', { name: 'Quantity of Costco' }).fill('0');
	await expect(costco).not.toContainText('Best deal');
	await expect(costco).toContainText('Set a quantity');
	await expect(page.getByRole('listitem', { name: 'Little Caesars Large' })).toContainText(
		'Best deal'
	);
});

test('pizzas with equal unit prices share the best deal', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const dominos = page.getByRole('listitem', { name: 'Dominos Medium' });
	await dominos.getByRole('combobox').selectOption('18');
	await dominos.getByRole('spinbutton').first().fill('9.95');
	await expect(dominos).toContainText('Best deal');
	await expect(page.getByRole('listitem', { name: 'Costco' })).toContainText('Best deal');
	// Only the two pizzas that aren't tied for best are marked up against it.
	await expect(page.getByText('more than the best deal')).toHaveCount(2);
	await expect(dominos).not.toContainText('more than the best deal');
	await expect(page.getByText('Dominos Medium & Costco')).toBeVisible();
});

test('table view shows the same comparison and remembers the choice', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Table view' }).click();
	await expect(page.getByRole('table')).toBeVisible();
	await expect(page.getByRole('row', { name: 'Costco' })).toContainText('Best deal');
	await page.getByRole('button', { name: 'Increase quantity of Costco' }).click();
	await expect(page.getByRole('row', { name: 'Costco' })).toContainText('19.90');

	await page.reload();
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('table')).toBeVisible();
	await page.getByRole('button', { name: 'Cards view' }).click();
	await expect(page.getByRole('listitem', { name: 'Costco' })).toBeVisible();
});

test('pizzas can be sorted by name, price, and price per square inch', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const names = () =>
		page
			.getByRole('listitem')
			.evaluateAll((items) => items.map((item) => item.getAttribute('aria-label')).filter(Boolean));
	const sort = page.getByRole('combobox', { name: 'Sort pizzas' });

	await sort.selectOption('Name: A–Z');
	expect(await names()).toEqual([
		'Costco',
		'Dominos Large',
		'Dominos Medium',
		'Little Caesars Large'
	]);

	await sort.selectOption('Price each: high–low');
	expect(await names()).toEqual([
		'Dominos Large',
		'Costco',
		'Dominos Medium',
		'Little Caesars Large'
	]);

	await sort.selectOption('Per in²: best value');
	expect(await names()).toEqual([
		'Costco',
		'Little Caesars Large',
		'Dominos Medium',
		'Dominos Large'
	]);

	// Re-sorts once the edit is committed, not while typing.
	const price = page
		.getByRole('listitem', { name: 'Dominos Large' })
		.getByRole('spinbutton')
		.first();
	await price.fill('1');
	expect((await names())[0]).toBe('Costco');
	await price.blur();
	await expect
		.poll(names)
		.toEqual(['Dominos Large', 'Costco', 'Little Caesars Large', 'Dominos Medium']);
});

test('table column headers toggle the sort', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Table view' }).click();
	const names = () =>
		page
			.getByRole('row')
			.evaluateAll((rows) => rows.map((row) => row.getAttribute('aria-label')).filter(Boolean));
	const header = page.getByRole('columnheader', { name: 'Pizza' });

	await header.getByRole('button').click();
	await expect(header).toHaveAttribute('aria-sort', 'ascending');
	expect((await names())[0]).toBe('Costco');

	await header.getByRole('button').click();
	await expect(header).toHaveAttribute('aria-sort', 'descending');
	expect((await names())[0]).toBe('Little Caesars Large');
	await expect(page.getByRole('combobox', { name: 'Sort pizzas' })).toHaveValue('name-desc');
});
