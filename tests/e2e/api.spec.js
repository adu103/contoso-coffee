import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test('should successfully fetch products from API', async ({ page }) => {
    // Navigate to store page
    await page.goto('/store');
    
    // Wait for API call to complete and products to load
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Verify products are displayed
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that specific expected products are present
    await expect(page.locator('text=Contoso Classic Blend')).toBeVisible();
    await expect(page.locator('text=Espresso Dark Roast')).toBeVisible();
    await expect(page.locator('text=Contoso Coffee Mug')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock a network failure
    await page.route('**/api/products', route => {
      route.abort();
    });
    
    // Navigate to store page
    await page.goto('/store');
    
    // Should show error message
    await expect(page.locator('text=Failed to load products')).toBeVisible();
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should retry failed API calls', async ({ page }) => {
    let callCount = 0;
    
    // Mock API to fail first time, succeed second time
    await page.route('**/api/products', route => {
      callCount++;
      if (callCount === 1) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Navigate to store page
    await page.goto('/store');
    
    // Should show error initially
    await expect(page.locator('text=Failed to load products')).toBeVisible();
    
    // Click retry button
    await page.click('button:has-text("Try Again")');
    
    // Should now load successfully
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display correct product information', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Check first product (Contoso Classic Blend)
    const firstProduct = page.locator('.product-card').first();
    await expect(firstProduct.locator('h4')).toContainText('Contoso Classic Blend');
    await expect(firstProduct.locator('p')).toContainText('signature medium roast');
    await expect(firstProduct.locator('text=$12.99')).toBeVisible();
    
    // Verify product has category information for filtering
    await page.click('button:has-text("coffee")');
    await expect(firstProduct).toBeVisible(); // Should still be visible when coffee filter is active
  });

  test('should handle empty product responses', async ({ page }) => {
    // Mock empty product list
    await page.route('**/api/products', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/store');
    
    // Should show no products message
    await expect(page.locator('text=No products found')).toBeVisible();
  });
});
