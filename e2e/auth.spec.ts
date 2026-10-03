import { test, expect } from '@playwright/test';

test.describe('Auth Page E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display hero section and branding highlights', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome to');
    await expect(page.locator('h1')).toContainText('Mamun Command Center');
    await expect(page.getByText('Secure • Fast • Reliable')).toBeVisible();
    await expect(page.getByText('Modern Stack').first()).toBeVisible();
    await expect(page.getByText('Secure Access')).toBeVisible();
    await expect(page.getByText('Higher Productivity')).toBeVisible();
  });

  test('should default to Sign In mode and allow switching to Create Account mode', async ({ page }) => {
    const signInTab = page.getByRole('button', { name: 'Sign In', exact: true });
    const createAccountTab = page.getByRole('button', { name: 'Create Account', exact: true });

    await expect(signInTab).toBeVisible();
    await expect(createAccountTab).toBeVisible();

    await createAccountTab.click();
    await expect(page.getByRole('button', { name: 'Create Command Account' })).toBeVisible();

    await signInTab.click();
    await expect(page.getByRole('button', { name: 'Sign In to Command Suite' })).toBeVisible();
  });

  test('should toggle password field visibility when eye icon is clicked', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click password visibility toggle button by title
    const toggleButton = page.getByTitle('Toggle password visibility');
    await toggleButton.click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display Google SSO button and trust badges', async ({ page }) => {
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.getByText('Trusted Platform')).toBeVisible();
    await expect(page.getByText('Cloud Powered')).toBeVisible();
    await expect(page.getByText('Enterprise Ready')).toBeVisible();
  });
});
