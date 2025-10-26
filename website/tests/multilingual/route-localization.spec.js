import { test, expect } from '@playwright/test';

const ROUTES_TO_TEST = [
  '/',
  '/frameworks',
  '/frameworks/mef',
  '/frameworks/zof', 
  '/frameworks/oif',
  '/frameworks/moc',
  '/frameworks/mal',
  '/docs',
  '/docs/getting-started',
  '/docs/implementation',
  '/protocol'
];

const LOCALES = ['pt', 'en'];

test.describe('Route Localization Tests', () => {
  
  ROUTES_TO_TEST.forEach(route => {
    LOCALES.forEach(locale => {
      test(`Route ${route} - ${locale} locale accessibility`, async ({ page }) => {
        const localizedRoute = `/${locale}${route === '/' ? '' : route}`;
        
        // Navigate to localized route
        await page.goto(localizedRoute);
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Verify response is successful
        const response = await page.goto(localizedRoute);
        expect(response.status()).toBe(200);
        
        // Verify HTML lang attribute matches locale
        const htmlLang = await page.getAttribute('html', 'lang');
        expect(htmlLang).toBe(locale);
        
        // Verify content exists (no empty pages)
        const bodyText = await page.textContent('body');
        expect(bodyText.length).toBeGreaterThan(100);
        
        // Verify navigation elements exist
        const navigation = await page.locator('[data-testid="main-navigation"]');
        await expect(navigation).toBeVisible();
      });
    });
  });

  test('Language switching functionality', async ({ page }) => {
    // Start on Portuguese homepage
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Portuguese version
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('pt');
    
    // Find and click language switcher
    const languageSwitcher = await page.locator('[data-testid="language-selector"]');
    await expect(languageSwitcher).toBeVisible();
    
    // Switch to English
    await languageSwitcher.click();
    await page.locator('[data-testid="language-option-en"]').click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify we're now on English version
    const newHtmlLang = await page.getAttribute('html', 'lang');
    expect(newHtmlLang).toBe('en');
    
    // Verify URL changed correctly
    expect(page.url()).toMatch(/\/en\//);
  });

  test('URL preservation during language switching', async ({ page }) => {
    const testRoute = '/pt/frameworks/mef';
    
    // Navigate to specific page
    await page.goto(testRoute);
    await page.waitForLoadState('networkidle');
    
    // Switch language
    const languageSwitcher = await page.locator('[data-testid="language-selector"]');
    await languageSwitcher.click();
    await page.locator('[data-testid="language-option-en"]').click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify correct English equivalent URL
    expect(page.url()).toMatch(/\/en\/frameworks\/mef/);
  });
});