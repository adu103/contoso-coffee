import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with correct title and hero content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Contoso Coffee');
    
    // Check hero section
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    await expect(page.locator('.hero p')).toContainText('Where passion for coffee meets exceptional quality');
  });

  test('should display all main sections', async ({ page }) => {
    // Check "Our Story" section
    await expect(page.locator('h3').first()).toContainText('Our Story');
    
    // Check about cards
    await expect(page.locator('.about-card').first()).toContainText('Our Location');
    await expect(page.locator('.about-card').nth(1)).toContainText('Our History');
    await expect(page.locator('.about-card').nth(2)).toContainText('Our Philosophy');
    
    // Check values section
    await expect(page.locator('h3').nth(1)).toContainText('Why Choose Contoso Coffee?');
    await expect(page.locator('.about-card').nth(3)).toContainText('Sustainable Sourcing');
    await expect(page.locator('.about-card').nth(4)).toContainText('Expert Roasting');
    await expect(page.locator('.about-card').nth(5)).toContainText('Community Focused');
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.locator('text=Address: 123 Coffee Street')).toBeVisible();
    await expect(page.locator('text=Phone: (555) 123-BREW')).toBeVisible();
    await expect(page.locator('text=Mon-Fri 6AM-8PM, Sat-Sun 7AM-9PM')).toBeVisible();
  });

  test('should have working navigation to store page', async ({ page }) => {
    // Click on store link in navigation
    await page.click('a[href="/store"]');
    
    // Should navigate to store page
    await expect(page).toHaveURL('/store');
    await expect(page.locator('h2')).toContainText('Our Store');
  });
});
