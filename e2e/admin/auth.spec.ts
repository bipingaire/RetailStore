
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
    test('should allow admin to login and redirect to dashboard', async ({ page }) => {
        // 1. Go to Login Page
        await page.goto('/shop/login');

        // 2. Fill Credentials (Seeded Tenant)
        await page.fill('input[type="email"]', 'admin@techhaven.com');
        await page.fill('input[type="password"]', 'password123');

        // 3. Submit
        await page.click('button[type="submit"]');

        // 4. Verify Redirection (should go to /admin or home then user navigates)
        // Adjust expectation based on actual app flow. Usually goes to / or /shop
        // Then we manually navigate to /admin to check access
        await expect(page).toHaveURL(/.*shop|.*admin/); // fast check

        // 5. Navigate to Admin
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*admin/);
        await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/shop/login');
        await page.fill('input[type="email"]', 'admin@techhaven.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Check for error toast or message
        await expect(page.getByText(/invalid login credentials|error/i)).toBeVisible();
    });
});
