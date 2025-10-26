import { test, expect } from '@playwright/test';

test.describe('User Experience Multilingual Tests', () => {
  
  test('Language persistence across navigation', async ({ page }) => {
    // Start on English homepage
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to different section
    await page.click('[data-testid="frameworks-link"]');
    await page.waitForLoadState('networkidle');
    
    // Should still be in English
    expect(page.url()).toMatch(/\/en\//);
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');
    
    // Navigate to specific framework
    await page.click('[data-testid="mef-link"]');
    await page.waitForLoadState('networkidle');
    
    // Should still be in English
    expect(page.url()).toMatch(/\/en\/frameworks\/mef/);
  });

  test('Language selector accessibility', async ({ page }) => {
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    
    const languageSelector = page.locator('[data-testid="language-selector"]');
    
    // Should be keyboard accessible
    await languageSelector.focus();
    await expect(languageSelector).toBeFocused();
    
    // Should have proper ARIA attributes
    const ariaLabel = await languageSelector.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    
    // Should be announced to screen readers
    const role = await languageSelector.getAttribute('role');
    expect(role).toBeTruthy();
  });

  test('Error pages are localized', async ({ page }) => {
    // Test Portuguese 404
    const ptResponse = await page.goto('/pt/non-existent-page');
    expect(ptResponse.status()).toBe(404);
    
    const ptErrorText = await page.textContent('body');
    expect(ptErrorText).toMatch(/não encontrada|erro|página/i);
    
    // Test English 404
    const enResponse = await page.goto('/en/non-existent-page'); 
    expect(enResponse.status()).toBe(404);
    
    const enErrorText = await page.textContent('body');
    expect(enErrorText).toMatch(/not found|error|page/i);
    
    // Error messages should be different
    expect(ptErrorText).not.toBe(enErrorText);
  });

  test('Search functionality is localized', async ({ page }) => {
    // Test if search exists and is localized
    await page.goto('/pt/docs');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      const ptPlaceholder = await searchInput.getAttribute('placeholder');
      
      await page.goto('/en/docs');
      await page.waitForLoadState('networkidle');
      
      const enPlaceholder = await searchInput.getAttribute('placeholder');
      
      // Placeholders should be different if localized
      if (ptPlaceholder && enPlaceholder) {
        expect(ptPlaceholder).not.toBe(enPlaceholder);
      }
    }
  });

  test('Consistent branding across languages', async ({ page }) => {
    // Test Portuguese branding
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    
    const ptLogo = page.locator('[data-testid="site-logo"]');
    await expect(ptLogo).toBeVisible();
    
    // Test English branding
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    
    const enLogo = page.locator('[data-testid="site-logo"]');
    await expect(enLogo).toBeVisible();
    
    // Logo should be consistent (same image/text)
    const ptLogoSrc = await ptLogo.getAttribute('src');
    const enLogoSrc = await enLogo.getAttribute('src');
    
    if (ptLogoSrc && enLogoSrc) {
      expect(ptLogoSrc).toBe(enLogoSrc);
    }
  });

  test('Content loading performance is consistent', async ({ page }) => {
    // Measure Portuguese page load
    const ptStartTime = Date.now();
    await page.goto('/pt/frameworks/mef');
    await page.waitForLoadState('networkidle');
    const ptLoadTime = Date.now() - ptStartTime;
    
    // Measure English page load
    const enStartTime = Date.now();
    await page.goto('/en/frameworks/mef');
    await page.waitForLoadState('networkidle');
    const enLoadTime = Date.now() - enStartTime;
    
    // Load times should be similar (within 50% of each other)
    const timeDifference = Math.abs(ptLoadTime - enLoadTime);
    const averageTime = (ptLoadTime + enLoadTime) / 2;
    const differencePercentage = (timeDifference / averageTime) * 100;
    
    expect(differencePercentage).toBeLessThan(50);
  });
});