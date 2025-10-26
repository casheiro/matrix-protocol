import { test, expect } from '@playwright/test';

const CONTENT_PAGES = [
  {
    pt: '/pt/frameworks/mef',
    en: '/en/frameworks/mef',
    contentSelectors: ['h1', 'main', '[data-testid="framework-content"]']
  },
  {
    pt: '/pt/frameworks/zof', 
    en: '/en/frameworks/zof',
    contentSelectors: ['h1', 'main', '[data-testid="framework-content"]']
  },
  {
    pt: '/pt/docs',
    en: '/en/docs',
    contentSelectors: ['h1', '[data-testid="docs-navigation"]', 'main']
  },
  {
    pt: '/pt/protocol',
    en: '/en/protocol',
    contentSelectors: ['h1', 'main', '.protocol-content']
  }
];

test.describe('Content Parity Tests', () => {
  
  CONTENT_PAGES.forEach(({ pt, en, contentSelectors }) => {
    test(`Content parity: ${pt} vs ${en}`, async ({ page }) => {
      // Test Portuguese version
      await page.goto(pt);
      await page.waitForLoadState('networkidle');
      
      const ptContent = {};
      for (const selector of contentSelectors) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible()) {
            ptContent[selector] = {
              exists: true,
              text: await element.textContent(),
              html: await element.innerHTML()
            };
          } else {
            ptContent[selector] = { exists: false };
          }
        } catch (error) {
          ptContent[selector] = { exists: false, error: error.message };
        }
      }
      
      // Test English version
      await page.goto(en);
      await page.waitForLoadState('networkidle');
      
      const enContent = {};
      for (const selector of contentSelectors) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible()) {
            enContent[selector] = {
              exists: true,
              text: await element.textContent(),
              html: await element.innerHTML()
            };
          } else {
            enContent[selector] = { exists: false };
          }
        } catch (error) {
          enContent[selector] = { exists: false, error: error.message };
        }
      }
      
      // Verify content parity
      for (const selector of contentSelectors) {
        // Both versions should exist or both should not exist
        expect(ptContent[selector].exists).toBe(enContent[selector].exists);
        
        if (ptContent[selector].exists && enContent[selector].exists) {
          // Content should not be identical (different languages)
          expect(ptContent[selector].text).not.toBe(enContent[selector].text);
          
          // But structure should be similar (similar length ranges)
          const ptLength = ptContent[selector].text.length;
          const enLength = enContent[selector].text.length;
          const lengthDifference = Math.abs(ptLength - enLength);
          const averageLength = (ptLength + enLength) / 2;
          const differencePercentage = (lengthDifference / averageLength) * 100;
          
          // Allow up to 50% length difference between languages
          expect(differencePercentage).toBeLessThan(50);
        }
      }
    });
  });

  test('Navigation consistency across languages', async ({ page }) => {
    // Test Portuguese navigation
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    
    const ptNavItems = await page.locator('[data-testid="main-navigation"] a').count();
    
    // Test English navigation  
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    
    const enNavItems = await page.locator('[data-testid="main-navigation"] a').count();
    
    // Should have same number of navigation items
    expect(ptNavItems).toBe(enNavItems);
    expect(ptNavItems).toBeGreaterThan(0);
  });
});