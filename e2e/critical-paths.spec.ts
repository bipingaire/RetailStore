import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test('should load admin dashboard', async ({ page }) => {
        await page.goto('/admin');

        // Should redirect to login if not authenticated
        await expect(page).toHaveURL(/.*login/);
    });

    test('should show inventory reconciliation page', async ({ page }) => {
        // Skip auth for testing
        await page.goto('/admin/reconciliation');

        await expect(page.locator('h1')).toContainText('Inventory Reconciliation');
    });

    test('should navigate to profit dashboard', async ({ page }) => {
        await page.goto('/admin/reports/profit-loss');

        await expect(page.locator('h1')).toContainText('Profit');
    });
});

test.describe('E-commerce Shop', () => {
    test('should display shop homepage', async ({ page }) => {
        await page.goto('/shop');

        await expect(page).toHaveTitle(/InduMart/);
    });

    test('should show products on shop page', async ({ page }) => {
        await page.goto('/shop');

        // Check for product grid
        const products = page.locator('[data-testid="product-card"]');
        await expect(products.first()).toBeVisible();
    });
});
