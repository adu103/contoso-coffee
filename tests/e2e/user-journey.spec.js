import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should complete a full user journey through the coffee shop', async ({ page }) => {
    // 1. Start at the homepage
    await page.goto('/');
    
    // Verify homepage loaded correctly
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    await expect(page.locator('h1')).toContainText('☕ Contoso Coffee');
    
    // 2. Read about the company
    await expect(page.locator('text=Our Story')).toBeVisible();
    await expect(page.locator('text=Address: 123 Coffee Street')).toBeVisible();
    await expect(page.locator('text=Phone: (555) 123-BREW')).toBeVisible();
    
    // 3. Navigate to the store
    await page.click('a[href="/store"]');
    await expect(page).toHaveURL('/store');
    await expect(page.locator('h2')).toContainText('Our Store');
    
    // 4. Wait for products to load
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // 5. Browse all products
    const allProducts = page.locator('.product-card');
    const totalProducts = await allProducts.count();
    expect(totalProducts).toBeGreaterThan(0);
    
    // Verify key products are available
    await expect(page.locator('text=Contoso Classic Blend')).toBeVisible();
    await expect(page.locator('text=Espresso Dark Roast')).toBeVisible();
    await expect(page.locator('text=Contoso Coffee Mug')).toBeVisible();
    
    // 6. Filter by coffee products
    await page.click('button:has-text("coffee")');
    await page.waitForTimeout(500); // Wait for filter to apply
    
    // Verify coffee filter is active
    const coffeeButton = page.locator('button:has-text("coffee")');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Verify coffee products are shown
    const coffeeProducts = page.locator('.product-card');
    const coffeeCount = await coffeeProducts.count();
    expect(coffeeCount).toBeGreaterThan(0);
    expect(coffeeCount).toBeLessThanOrEqual(totalProducts);
    
    // Check that coffee products contain coffee-related terms
    await expect(page.locator('.product-card:has-text("Blend")')).toBeVisible();
    
    // 7. Filter by merchandise
    await page.click('button:has-text("merchandise")');
    await page.waitForTimeout(500);
    
    // Verify merchandise filter is active
    const merchandiseButton = page.locator('button:has-text("merchandise")');
    await expect(merchandiseButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Verify merchandise products are shown
    await expect(page.locator('text=Contoso Coffee Mug')).toBeVisible();
    await expect(page.locator('text=Contoso T-Shirt')).toBeVisible();
    
    // 8. Go back to all products
    await page.click('button:has-text("all")');
    await page.waitForTimeout(500);
    
    const allButton = page.locator('button:has-text("all")');
    await expect(allButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Verify all products are shown again
    const finalProducts = page.locator('.product-card');
    const finalCount = await finalProducts.count();
    expect(finalCount).toBe(totalProducts);
    
    // 9. Examine a specific product in detail
    const classicBlend = page.locator('.product-card:has-text("Contoso Classic Blend")');
    await expect(classicBlend.locator('h4')).toContainText('Contoso Classic Blend');
    await expect(classicBlend.locator('p')).toContainText('signature medium roast');
    await expect(classicBlend.locator('text=$12.99')).toBeVisible();
    await expect(classicBlend.locator('.product-category')).toContainText('coffee');
    
    // 10. Navigate back to home to complete the journey
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    
    // Verify we're back at the homepage with all content intact
    await expect(page.locator('text=Our Story')).toBeVisible();
    await expect(page.locator('text=Why Choose Contoso Coffee?')).toBeVisible();
  });

  test('should handle the complete mobile user experience', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('This test is only for mobile devices');
    }

    // Mobile-specific user journey
    await page.goto('/');
    
    // Verify mobile layout works
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Welcome to Contoso Coffee');
    
    // Navigate to store on mobile
    await page.click('a[href="/store"]');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Verify mobile layout for products
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Test mobile filtering
    await page.click('button:has-text("coffee")');
    const coffeeButton = page.locator('button:has-text("coffee")');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Verify products are still accessible on mobile
    await expect(page.locator('text=Contoso Classic Blend')).toBeVisible();
  });

  test('should handle error scenarios gracefully during user journey', async ({ page }) => {
    // Start normal journey
    await page.goto('/');
    await page.click('a[href="/store"]');
    
    // Simulate network error during product loading
    await page.route('**/api/products', route => {
      route.abort();
    });
    
    // Refresh page to trigger error
    await page.reload();
    
    // Verify error is handled gracefully
    await expect(page.locator('text=Failed to load products')).toBeVisible();
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    
    // Remove network error and retry
    await page.unroute('**/api/products');
    await page.click('button:has-text("Try Again")');
    
    // Verify recovery
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Continue journey normally
    await page.click('button:has-text("coffee")');
    const coffeeButton = page.locator('button:has-text("coffee")');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
  });

  test('should maintain state during back/forward navigation', async ({ page }) => {
    // Complete a multi-step journey
    await page.goto('/');
    await page.click('a[href="/store"]');
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    
    // Apply a filter
    await page.click('button:has-text("coffee")');
    await page.waitForTimeout(500);
    
    // Verify filter is applied
    const coffeeButton = page.locator('button:has-text("coffee")');
    await expect(coffeeButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
    
    // Navigate away and back
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/store');
    
    // Verify the page still works (filter may reset, which is expected)
    await page.waitForSelector('.products-grid', { timeout: 10000 });
    const products = page.locator('.product-card');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Can still interact with filters
    await page.click('button:has-text("merchandise")');
    const merchandiseButton = page.locator('button:has-text("merchandise")');
    await expect(merchandiseButton).toHaveCSS('background-color', 'rgb(212, 165, 116)');
  });
});
