import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Pizza Size Price Calculator' })).toBeVisible();
});

test('quantity stepper updates the total price', async ({ page }) => {
	await page.goto('/');
	const quantity = page.getByRole('spinbutton', { name: 'Quantity of Costco' });
	await expect(quantity).toHaveValue('1');
	await page.getByRole('button', { name: 'Increase quantity of Costco' }).click();
	await expect(quantity).toHaveValue('2');
	await expect(page.getByRole('row').filter({ has: quantity })).toContainText('19.90');
	await page.getByRole('button', { name: 'Decrease quantity of Costco' }).click();
	await expect(quantity).toHaveValue('1');
});
