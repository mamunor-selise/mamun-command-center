import { test, expect } from '@playwright/test';

test.describe('Application Smoke Suite', () => {
  test('should load application root and display correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mamun Command Center/i);
  });
});
