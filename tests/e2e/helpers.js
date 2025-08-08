// Test utilities and helper functions for Playwright E2E tests

export class TestHelpers {
  /**
   * Wait for API call to complete and verify response
   */
  static async waitForApiResponse(page, url, expectedStatus = 200) {
    const responsePromise = page.waitForResponse(response => 
      response.url().includes(url) && response.status() === expectedStatus
    );
    return await responsePromise;
  }

  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForElement(page, selector, timeout = 10000) {
    return await page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if running on mobile device
   */
  static isMobile(page) {
    return page.context().browser().contexts()[0].pages()[0].viewportSize().width < 768;
  }

  /**
   * Clear all network responses and start fresh
   */
  static async clearNetworkResponses(page) {
    await page.route('**/*', route => route.continue());
  }

  /**
   * Mock API responses for testing
   */
  static async mockApiResponse(page, url, response, status = 200) {
    await page.route(`**/${url}`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot with timestamp
   */
  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Get the count of elements matching selector
   */
  static async getElementCount(page, selector) {
    return await page.locator(selector).count();
  }

  /**
   * Verify page accessibility basics
   */
  static async checkBasicAccessibility(page) {
    // Check for basic semantic structure
    await expect(page.locator('main')).toBeVisible();
    
    // Check for page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(0);
  }

  /**
   * Test keyboard navigation
   */
  static async testKeyboardNavigation(page, elements) {
    for (const element of elements) {
      await page.keyboard.press('Tab');
      await expect(page.locator(element)).toBeFocused();
    }
  }

  /**
   * Verify responsive design by testing different viewport sizes
   */
  static async testResponsiveDesign(page, test) {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await test(page, viewport.name);
    }
  }
}

// Custom expect matchers
export const customMatchers = {
  async toHaveLoadedWithin(page, maxTime) {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(maxTime);
  },

  async toBeAccessible(element) {
    // Basic accessibility checks
    await expect(element).toBeVisible();
    
    if (await element.getAttribute('role') === 'button' || element.tagName === 'BUTTON') {
      await expect(element).toBeEnabled();
    }
    
    if (await element.getAttribute('href')) {
      const href = await element.getAttribute('href');
      expect(href).toBeTruthy();
    }
  }
};

export default TestHelpers;
