# Visual Regression Testing Setup

## Overview
This document explains how to set up and run visual regression tests for the Matrix Protocol Website.

## Prerequisites
- Node.js 18+ 
- pnpm package manager
- Matrix Protocol Website running locally

## Installation

### 1. Install Playwright
```bash
pnpm add -D @playwright/test
```

### 2. Install Browsers
```bash
npx playwright install
```

### 3. Install Browser Dependencies (Linux)
```bash
npx playwright install-deps
```

## Running Tests

### Development Server
Start the development server:
```bash
pnpm dev
```

### Run Visual Tests
```bash
# Run all visual tests
npx playwright test visual-regression-playwright.spec.js

# Run tests in headed mode (see browser)
npx playwright test visual-regression-playwright.spec.js --headed

# Run tests for specific browser
npx playwright test visual-regression-playwright.spec.js --project=chromium

# Update screenshots (when UI changes are intentional)
npx playwright test visual-regression-playwright.spec.js --update-snapshots
```

## Test Configuration

### Viewports Tested
- **Desktop**: 1920x1080
- **Tablet**: 768x1024  
- **Mobile**: 375x667
- **Wide**: 2560x1440

### Browsers Tested
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

### Pages Tested
- **Homepage layout and navigation**: /
- **Portuguese homepage**: /pt/
- **English homepage**: /en/
- **Portuguese docs navigation**: /pt/docs
- **English docs navigation**: /en/docs
- **Framework documentation page PT**: /pt/docs/frameworks/mef
- **Framework documentation page EN**: /en/docs/frameworks/mef

## Understanding Results

### Test Reports
- **HTML Report**: `tests/reports/playwright-html/index.html`
- **JSON Report**: `tests/reports/playwright-results.json`
- **Screenshots**: `test-results/` directory

### When Tests Fail
1. **Review Screenshots**: Check actual vs expected in test results
2. **Analyze Differences**: Look for unintended visual changes
3. **Update Baselines**: If changes are intentional, update snapshots

### Common Issues
- **Flaky Tests**: Add proper wait conditions
- **Font Differences**: Ensure consistent font loading
- **Animation Issues**: Disable animations in tests
- **Timing Issues**: Add appropriate waits

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Visual Regression Tests
on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: pnpm install
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run visual tests
        run: npx playwright test visual-regression-playwright.spec.js
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-results
          path: test-results/
```

## Best Practices

### Writing Visual Tests
1. **Wait for Content**: Always wait for key elements to load
2. **Disable Animations**: Use `animations: 'disabled'`
3. **Consistent Timing**: Add appropriate timeouts
4. **Meaningful Names**: Use descriptive test and screenshot names

### Maintaining Tests  
1. **Regular Updates**: Update baselines when UI changes intentionally
2. **Review Changes**: Always review visual differences before updating
3. **Cross-Browser**: Test across all supported browsers
4. **Performance**: Keep test suite execution time reasonable

### Debugging Failed Tests
1. **Run in Headed Mode**: See what the browser sees
2. **Check Network**: Ensure all resources load correctly
3. **Verify Selectors**: Make sure wait selectors are correct
4. **Review Timing**: Adjust timeouts if needed

## Troubleshooting

### Common Commands
```bash
# Debug specific test
npx playwright test visual-regression-playwright.spec.js:50 --debug

# Generate test code
npx playwright codegen localhost:3000

# Show test trace
npx playwright show-trace test-results/path/to/trace.zip
```

### Performance Tips
- Use `test.describe.configure({ mode: 'parallel' })` for speed
- Consider `workers` configuration in playwright.config.js
- Use `--shard` for distributed testing

## Integration with Performance Testing
Visual regression tests complement performance benchmarks by ensuring UI consistency while maintaining performance standards.

---

**Generated**: 2025-10-25T21:46:44.041Z  
**Version**: Matrix Protocol Website v2  
**Framework**: Playwright + Visual Regression
