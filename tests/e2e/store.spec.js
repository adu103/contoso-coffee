import { test, expect } from '@playwright/test';

test.describe('Store Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
  });

  test('should display store page with correct title and hero content', async ({ page }) => {
    // Check hero section
    await expect(page.locator('h2')).toContainText('Our Store');
    await expect(page.locator('.hero p')).toContainText('Discover our premium collection');
  });

  test('should load and display products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Check that products are displayed
    const productCards = page.locator('.product-card');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that first product has required elements
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('h4')).toBeVisible();
    await expect(firstProduct.locator('p')).toBeVisible();
    await expect(firstProduct.locator('text=$')).toBeVisible();
  });

  test('should display category filter buttons', async ({ page }) => {
    // Wait for products to load first
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Check filter buttons
    await expect(page.locator('button:has-text("all")')).toBeVisible();
    await expect(page.locator('button:has-text("coffee")')).toBeVisible();
    await expect(page.locator('button:has-text("merchandise")')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Get initial product count
    const allProducts = page.locator('.product-card');
    const initialCount = await allProducts.count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Click coffee filter
    await page.click('button:has-text("coffee")');
    
    // Wait a moment for filtering
    await page.waitForTimeout(500);
    
    // Check that coffee filter is active
    const coffeeButton = page.locator('button:has-text("coffee")');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Check that products are filtered (should be fewer than all)
    const coffeeProducts = page.locator('.product-card');
    const coffeeCount = await coffeeProducts.count();
    expect(coffeeCount).toBeLessThanOrEqual(initialCount);
    
    // Click merchandise filter
    await page.click('button:has-text("merchandise")');
    await page.waitForTimeout(500);
    
    // Check that merchandise filter is active
    const merchandiseButton = page.locator('button:has-text("merchandise")');
    await expect(merchandiseButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Click "all" to show all products again
    await page.click('button:has-text("all")');
    await page.waitForTimeout(500);
    
    const allProductsAgain = page.locator('.product-card');
    const finalCount = await allProductsAgain.count();
    expect(finalCount).toBe(initialCount);
  });

  test('should handle loading state', async ({ page }) => {
    // Navigate to store page and check for loading indicator
    await page.goto('/store');
    
    // We might see the loading text briefly, but products should eventually load
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Ensure no loading text is visible after products load
    await expect(page.locator('text=Loading products...')).not.toBeVisible();
  });

  test('should navigate back to home page', async ({ page }) => {
    // Click on home link in navigation
    await page.click('a[href="/"]');
    
    // Should navigate to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
  });

  test('should be responsive on mobile devices', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.waitForSelector('.products-grid', { timeout: 10000 });
      
      // Check that products grid is still visible on mobile
      await expect(page.locator('.products-grid')).toBeVisible();
      
      // Check that filter buttons are visible and clickable
      await expect(page.locator('button:has-text("all")')).toBeVisible();
      await page.click('button:has-text("coffee")');
      
      // Verify filter works on mobile
      const coffeeButton = page.locator('button:has-text("coffee")');
      await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    }
  });
});
