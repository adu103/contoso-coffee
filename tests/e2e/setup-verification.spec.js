import { test, expect } from '@playwright/test';

test.describe('Setup Verification', () => {
  test('should verify the test setup is working correctly', async ({ page }) => {
    // This is a simple smoke test to verify everything is set up correctly
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Basic verification that the app is running
    await expect(page.locator('h1')).toContainText('Contoso Coffee');
    
    // Verify we can navigate to store
    await page.click('a[href="/store"]');
    await expect(page).toHaveURL('/store');
    
    console.log('✅ E2E test setup is working correctly!');
  });

  test('should verify API is accessible', async ({ page }) => {
    // Test that we can reach the API
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const health = await response.json();
    expect(health.status).toBe('OK');
    
    console.log('✅ Backend API is accessible!');
  });
});
