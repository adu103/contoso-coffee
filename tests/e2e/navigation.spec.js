import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have working navigation between pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    
    // Navigate to store
    await page.click('a[href="/store"]');
    await expect(page).toHaveURL('/store');
    await expect(page.locator('h2')).toContainText('Our Store');
    
    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
  });

  test('should display header and footer on all pages', async ({ page }) => {
    // Check home page
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check store page
    await page.goto('/store');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Direct navigation to store page
    await page.goto('/store');
    await expect(page.locator('h2')).toContainText('Our Store');
    
    // Direct navigation to home page
    await page.goto('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
  });

  test('should handle browser back and forward buttons', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Navigate to store
    await page.click('a[href="/store"]');
    await expect(page).toHaveURL('/store');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/store');
    await expect(page.locator('h2')).toContainText('Our Store');
  });
});
