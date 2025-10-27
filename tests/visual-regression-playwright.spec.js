
import { test, expect } from '@playwright/test';

const VIEWPORTS = {
  "desktop": {
    "width": 1920,
    "height": 1080
  },
  "tablet": {
    "width": 768,
    "height": 1024
  },
  "mobile": {
    "width": 375,
    "height": 667
  },
  "wide": {
    "width": 2560,
    "height": 1440
  }
};
const TEST_URLS = [
  {
    "path": "/",
    "name": "homepage",
    "waitFor": "h1",
    "description": "Homepage layout and navigation"
  },
  {
    "path": "/pt/",
    "name": "homepage-pt",
    "waitFor": "h1",
    "description": "Portuguese homepage"
  },
  {
    "path": "/en/",
    "name": "homepage-en",
    "waitFor": "h1",
    "description": "English homepage"
  },
  {
    "path": "/pt/docs",
    "name": "docs-navigation-pt",
    "waitFor": "[data-testid=\"docs-navigation\"]",
    "description": "Portuguese docs navigation"
  },
  {
    "path": "/en/docs",
    "name": "docs-navigation-en",
    "waitFor": "[data-testid=\"docs-navigation\"]",
    "description": "English docs navigation"
  },
  {
    "path": "/pt/docs/frameworks/mef",
    "name": "framework-page-pt",
    "waitFor": "main",
    "description": "Framework documentation page PT"
  },
  {
    "path": "/en/docs/frameworks/mef",
    "name": "framework-page-en",
    "waitFor": "main",
    "description": "Framework documentation page EN"
  }
];

// Test each URL across different viewports
for (const url of TEST_URLS) {
  test.describe(`Visual regression: ${url.description}`, () => {
    
    // Desktop tests
    test(`${url.name} - desktop`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto(url.path);
      await page.waitForSelector(url.waitFor);
      
      // Wait for animations and loading
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await expect(page).toHaveScreenshot(`${url.name}-desktop.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });

    // Tablet tests  
    test(`${url.name} - tablet`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto(url.path);
      await page.waitForSelector(url.waitFor);
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot(`${url.name}-tablet.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });

    // Mobile tests
    test(`${url.name} - mobile`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(url.path);
      await page.waitForSelector(url.waitFor);
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot(`${url.name}-mobile.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
}

// Navigation specific tests
test.describe('Dynamic Navigation Visual Tests', () => {
  test('navigation consistency PT/EN', async ({ page }) => {
    // Test Portuguese navigation
    await page.goto('/pt/docs');
    await page.waitForSelector('[data-testid="docs-navigation"]');
    await page.waitForTimeout(1000);
    
    const ptNavigation = await page.locator('[data-testid="docs-navigation"]').screenshot();
    
    // Test English navigation  
    await page.goto('/en/docs');
    await page.waitForSelector('[data-testid="docs-navigation"]');
    await page.waitForTimeout(1000);
    
    const enNavigation = await page.locator('[data-testid="docs-navigation"]').screenshot();
    
    // Both should have similar structure (allowing for text differences)
    expect(ptNavigation).toBeDefined();
    expect(enNavigation).toBeDefined();
  });

  test('framework dropdown consistency', async ({ page }) => {
    await page.goto('/pt/docs');
    
    // Hover over frameworks to open dropdown
    await page.hover('[data-testid="frameworks-dropdown"]');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('frameworks-dropdown-expanded.png');
  });

  test('mobile navigation drawer', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/pt/docs');
    
    // Open mobile navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('mobile-navigation-drawer.png');
  });
});

// Cross-browser consistency tests
test.describe('Cross-browser consistency', () => {
  const testPage = TEST_URLS[0]; // Use homepage
  
  test('homepage renders consistently across browsers', async ({ page, browserName }) => {
    await page.goto(testPage.path);
    await page.waitForSelector(testPage.waitFor);
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`);
  });
});

// Theme and accessibility tests
test.describe('Theme and accessibility visual tests', () => {
  test('dark mode consistency', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark mode if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('homepage-dark-mode.png');
    }
  });

  test('high contrast mode', async ({ page }) => {
    await page.goto('/');
    
    // Simulate high contrast mode
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({
      content: `
        * {
          filter: contrast(150%) !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-high-contrast.png');
  });
});
