import { test, expect } from '@playwright/test';

test.describe('Demo flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login if API unavailable
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('full journey: tender -> decision', async ({ page }) => {
    await page.goto('/tenders');
    await expect(page.getByRole('heading', { name: /Тендеры/ })).toBeVisible();
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    await page.waitForURL(/\/tenders\/[a-f0-9-]+/);

    // Actions should be visible
    await expect(page.getByRole('button', { name: /Перезапустить/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Запросить КП/ })).toBeVisible();

    // Go to decisions
    await page.goto('/decisions');
    await expect(page.getByRole('heading', { name: 'Решения' })).toBeVisible();
  });
});