# E2E Testing with Playwright - Contoso Coffee

This directory contains comprehensive end-to-end tests for the Contoso Coffee application using Playwright.

## Test Structure

### Test Files

- **`home.spec.js`** - Tests for the homepage functionality
  - Hero section display
  - Content sections (Our Story, Why Choose Us)
  - Contact information visibility
  - Navigation to store

- **`store.spec.js`** - Tests for the store page functionality
  - Product loading and display
  - Category filtering (all, coffee, merchandise)
  - Loading states and error handling
  - Mobile responsiveness

- **`navigation.spec.js`** - Tests for navigation between pages
  - Header/footer presence on all pages
  - Direct URL navigation
  - Browser back/forward buttons
  - Navigation link functionality

- **`api.spec.js`** - Tests for API integration
  - Product fetching from backend API
  - Error handling and retry mechanisms
  - Empty response handling
  - Product data validation

- **`accessibility.spec.js`** - Tests for accessibility compliance
  - Page titles and heading hierarchy
  - Keyboard navigation
  - Link and button accessibility
  - Semantic HTML structure
  - Color contrast basics

- **`performance.spec.js`** - Tests for performance and visual regression
  - Page load times
  - Rapid navigation handling
  - Product filtering performance
  - Memory leak prevention
  - Layout consistency

- **`user-journey.spec.js`** - Complete user journey tests
  - Full application workflow
  - Mobile user experience
  - Error scenario handling
  - State persistence during navigation

- **`helpers.js`** - Test utilities and helper functions

## Running Tests

### Prerequisites

Make sure you have installed dependencies:
```bash
npm install
```

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Individual Test Files

```bash
# Run specific test file
npx playwright test tests/e2e/home.spec.js

# Run specific test with browser
npx playwright test tests/e2e/store.spec.js --headed

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

The tests are configured in `playwright.config.js` with:

- **Multiple browsers**: Chromium, Firefox, WebKit
- **Mobile testing**: Pixel 5, iPhone 12
- **Automatic server startup**: Both frontend (port 3000) and backend (port 5000)
- **Screenshots and videos**: Captured on failure
- **Traces**: Recorded on retry for debugging

## Browser Support

Tests run on:
- ✅ Desktop Chrome/Chromium
- ✅ Desktop Firefox  
- ✅ Desktop Safari/WebKit
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Test Coverage

### Functional Testing
- ✅ Homepage content display
- ✅ Store page product loading
- ✅ Product category filtering
- ✅ Navigation between pages
- ✅ API integration and error handling
- ✅ Complete user workflows

### Non-Functional Testing
- ✅ Performance and load times
- ✅ Mobile responsiveness
- ✅ Accessibility compliance
- ✅ Error scenario handling
- ✅ Browser compatibility

### User Experience Testing
- ✅ Complete user journeys
- ✅ Mobile user experience
- ✅ Navigation state preservation
- ✅ Graceful error recovery

## Test Data

Tests use the same product data as defined in the backend API:
- Coffee products (Contoso Classic Blend, Espresso Dark Roast, Colombian Single Origin)
- Merchandise (Coffee Mug, T-Shirt, Stickers Pack)
- Categories: `coffee`, `merchandise`

## Debugging Tests

### Visual Debugging
```bash
# Run with browser visible
npm run test:e2e:headed

# Run in debug mode (step through)
npm run test:e2e:debug

# Use Playwright UI for interactive debugging
npm run test:e2e:ui
```

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded when tests fail
- Traces are captured on retry for detailed debugging

### Common Issues

1. **Tests timing out**: Increase timeouts in individual tests if needed
2. **API not responding**: Ensure backend server is running on port 5000
3. **Frontend not loading**: Ensure frontend server is running on port 3000
4. **Flaky tests**: Use `waitForSelector` with appropriate timeouts

## CI/CD Integration

For continuous integration:

```bash
# Run tests in CI mode
CI=true npm run test:e2e
```

CI mode includes:
- Retry failed tests 2 times
- Run tests sequentially (not parallel)
- Fail build if `test.only` is found

## Extending Tests

### Adding New Tests

1. Create new `.spec.js` file in `tests/e2e/`
2. Follow naming convention: `feature.spec.js`
3. Import test utilities from `helpers.js`
4. Use descriptive test names and group related tests

### Test Organization

```javascript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });
});
```

### Best Practices

- Use descriptive test names
- Group related tests with `test.describe`
- Use `beforeEach` for common setup
- Wait for elements to be visible before interacting
- Use data-testid attributes for reliable element selection
- Mock external dependencies when needed
- Test both happy path and error scenarios

## Reporting

Test results are available in:
- Console output during test runs
- HTML report (view with `npm run test:e2e:report`)
- Screenshots and videos in `test-results/` directory
- Traces for failed tests in `test-results/`
