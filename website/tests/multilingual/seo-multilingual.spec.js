import { test, expect } from '@playwright/test';

const SEO_PAGES = [
  { pt: '/pt/', en: '/en/' },
  { pt: '/pt/frameworks/mef', en: '/en/frameworks/mef' },
  { pt: '/pt/docs', en: '/en/docs' },
  { pt: '/pt/protocol', en: '/en/protocol' }
];

test.describe('SEO Multilingual Tests', () => {
  
  SEO_PAGES.forEach(({ pt, en }) => {
    test(`SEO compliance: ${pt} vs ${en}`, async ({ page }) => {
      // Test Portuguese SEO
      await page.goto(pt);
      await page.waitForLoadState('networkidle');
      
      const ptSeo = await extractSEOData(page);
      
      // Test English SEO
      await page.goto(en);
      await page.waitForLoadState('networkidle');
      
      const enSeo = await extractSEOData(page);
      
      // Verify both have required SEO elements
      expect(ptSeo.title).toBeTruthy();
      expect(enSeo.title).toBeTruthy();
      expect(ptSeo.description).toBeTruthy();
      expect(enSeo.description).toBeTruthy();
      
      // Titles should be different (localized)
      expect(ptSeo.title).not.toBe(enSeo.title);
      expect(ptSeo.description).not.toBe(enSeo.description);
      
      // Language meta should be correct
      expect(ptSeo.lang).toBe('pt');
      expect(enSeo.lang).toBe('en');
      
      // Hreflang alternates should exist
      expect(ptSeo.hreflang).toContain('en');
      expect(enSeo.hreflang).toContain('pt');
      
      // Open Graph should be localized
      if (ptSeo.ogTitle) {
        expect(ptSeo.ogTitle).not.toBe(enSeo.ogTitle);
      }
    });
  });

  test('Sitemap includes all localized URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response.status()).toBe(200);
    
    const sitemapContent = await page.textContent('body');
    
    // Should contain both PT and EN URLs
    expect(sitemapContent).toContain('/pt/');
    expect(sitemapContent).toContain('/en/');
    
    // Should contain framework pages in both languages
    expect(sitemapContent).toContain('/pt/frameworks/mef');
    expect(sitemapContent).toContain('/en/frameworks/mef');
  });
});

async function extractSEOData(page) {
  return {
    title: await page.title(),
    description: await page.getAttribute('meta[name="description"]', 'content'),
    lang: await page.getAttribute('html', 'lang'),
    hreflang: await page.$$eval('link[rel="alternate"]', links => 
      links.map(link => link.getAttribute('hreflang')).filter(Boolean)
    ),
    ogTitle: await page.getAttribute('meta[property="og:title"]', 'content'),
    ogDescription: await page.getAttribute('meta[property="og:description"]', 'content'),
    canonicalUrl: await page.getAttribute('link[rel="canonical"]', 'href')
  };
}