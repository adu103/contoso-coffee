import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have accessibility basics', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle('Contoso Coffee');
    
    await page.goto('/store');
    await expect(page).toHaveTitle('Contoso Coffee');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check that h2 is used for main page title
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    
    // Check that h3 is used for section titles
    await expect(page.locator('h3').first()).toContainText('Our Story');
    
    // Check that h4 is used for subsection titles
    await expect(page.locator('h4').first()).toContainText('Our Location');
  });

  test('should have accessible navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check that navigation links are properly labeled
    const homeLink = page.locator('a[href="/"]');
    const storeLink = page.locator('a[href="/store"]');
    
    await expect(homeLink).toBeVisible();
    await expect(storeLink).toBeVisible();
    
    // Links should be keyboard accessible
    await storeLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/store');
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('button:has-text("all")', { timeout: 10000 });
    
    // Filter buttons should be keyboard accessible
    const allButton = page.locator('button:has-text("all")');
    const coffeeButton = page.locator('button:has-text("coffee")');
    
    await allButton.focus();
    await page.keyboard.press('Tab');
    await expect(coffeeButton).toBeFocused();
    
    // Button should be activatable with keyboard
    await page.keyboard.press('Enter');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is visible and readable
    const heroText = page.locator('.hero p');
    await expect(heroText).toBeVisible();
    
    // Check button styling
    await page.goto('/store');
    await page.waitForSelector('button:has-text("all")', { timeout: 10000 });
    
    const activeButton = page.locator('button:has-text("all")');
    await expect(activeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    await expect(activeButton).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should be able to navigate to store page using keyboard
    const storeLink = page.locator('a[href="/store"]');
    await storeLink.focus();
    await page.keyboard.press('Enter');
    
    await expect(page).toHaveURL('/store');
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for proper section structure
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });
});
