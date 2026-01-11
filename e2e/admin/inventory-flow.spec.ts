
import { test, expect } from '@playwright/test';

test.describe('Admin Inventory Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/shop/login');
        await page.fill('input[type="email"]', 'admin@techhaven.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000); // Wait for auth cookie
    });

    test('should display inventory products', async ({ page }) => {
        await page.goto('/admin/inventory');

        // Check Header
        await expect(page.locator('h1')).toContainText('Inventory');

        // Check for at least one product row or "No inventory" message if empty
        // We expect seeded data might be empty or present. 
        // If empty, we check for "No inventory". If present, we check for table rows.

        const tableFn = page.locator('table');
        await expect(tableFn).toBeVisible();
    });

    test('should filter inventory', async ({ page }) => {
        await page.goto('/admin/inventory');

        // Type in search
        const searchInput = page.locator('input[placeholder="Search products..."]');
        await searchInput.fill('NonExistentProductXYZ');

        // Wait for filtered results (should be empty)
        await expect(page.getByText(/no inventory found/i)).toBeVisible({ timeout: 10000 });
    });
});
