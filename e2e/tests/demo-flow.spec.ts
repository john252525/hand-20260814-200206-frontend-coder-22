import { test, expect } from '@playwright/test';
import { mockThreads } from '../../src/lib/mocks/threads';

test.describe('Demo flow', () => {
  test.beforeEach(async ({ page }) => {
    // Используем мок-данные, не завися от реального API
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({ json: { data: { token: 'mock-token', user: { id: '1', email: 'admin@example.com', name: 'Admin', role: 'admin' } } } });
    });
    await page.route('**/api/v1/tenders?**', route => {
      route.fulfill({ json: { data: [{ id: '1', title: 'Тестовый тендер', nmck: 100000, status: 'NEW', customer_name: 'Тест' }], meta: { page: 1, per_page: 20, total: 1, pages: 1 } } });
    });
    await page.route('**/api/v1/communications/threads', route => {
      route.fulfill({ json: { data: mockThreads, meta: { page: 1, per_page: 20, total: mockThreads.length, pages: 1 } } });
    });

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

    await expect(page.getByRole('button', { name: /Перезапустить/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Запросить КП/ })).toBeVisible();

    await page.goto('/decisions');
    await expect(page.getByRole('heading', { name: 'Решения' })).toBeVisible();
  });
});