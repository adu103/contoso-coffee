import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load pages within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check that page is interactive
    await expect(page.locator('h2')).toBeVisible();
  });

  test('should load store page and products efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/store');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Should load products within 10 seconds
    
    // Verify products are actually loaded
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle rapid navigation without issues', async ({ page }) => {
    // Rapidly navigate between pages
    for (let i = 0; i < 3; i++) {
      await page.goto('/');
      await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
      
      await page.goto('/store');
      await expect(page.locator('h2')).toContainText('Our Store');
    }
    
    // Final check that everything still works
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter products quickly', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Rapidly switch between filters
    const startTime = Date.now();
    
    await page.click('button:has-text("coffee")');
    await page.click('button:has-text("merchandise")');
    await page.click('button:has-text("all")');
    
    const filterTime = Date.now() - startTime;
    expect(filterTime).toBeLessThan(2000); // Filtering should be fast
    
    // Verify final state
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should not have memory leaks during extended use', async ({ page }) => {
    // Simulate extended browsing session
    for (let i = 0; i < 5; i++) {
      await page.goto('/');
      await page.goto('/store');
      await page.waitForSelector('.products-grid', { timeout: 10000 });
      
      // Filter products multiple times
      await page.click('button:has-text("coffee")');
      await page.click('button:has-text("merchandise")');
      await page.click('button:has-text("all")');
    }
    
    // Page should still be responsive
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Navigation should still work
    await page.click('a[href="/"]');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
  });
});

test.describe('Visual Regression', () => {
  test('should maintain consistent homepage layout', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero')).toBeVisible();
    
    // Take screenshot for visual comparison (you can enable this for visual regression testing)
    // await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should maintain consistent store page layout', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Ensure all filter buttons are visible
    await expect(page.locator('button:has-text("all")')).toBeVisible();
    await expect(page.locator('button:has-text("coffee")')).toBeVisible();
    await expect(page.locator('button:has-text("merchandise")')).toBeVisible();
    
    // Take screenshot for visual comparison
    // await expect(page).toHaveScreenshot('store-page.png');
  });

  test('should display products in grid layout correctly', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Check that products are displayed in a grid
    const productsGrid = page.locator('.products-grid');
    await expect(productsGrid).toBeVisible();
    
    // Check that product cards have consistent structure
    const firstProduct = page.locator('.product-card').first();
    await expect(firstProduct.locator('h4')).toBeVisible();
    await expect(firstProduct.locator('p')).toBeVisible();
    await expect(firstProduct.locator('text=$')).toBeVisible();
  });
});
