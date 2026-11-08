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
	await expect(page.getByText('more than the best deal')).toHaveCount(1);
	await expect(page.getByText('Dominos Medium & Costco')).toBeVisible();
});
