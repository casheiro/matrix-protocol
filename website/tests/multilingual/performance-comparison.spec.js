import { test, expect } from '@playwright/test';

test.describe('Performance Comparison Tests', () => {
  
  test('Core Web Vitals consistency across languages', async ({ page }) => {
    const performanceData = {};
    
    for (const locale of ['pt', 'en']) {
      await page.goto(`/${locale}/`);
      
      // Measure Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'navigation') {
                vitals.loadComplete = entry.loadEventEnd - entry.loadEventStart;
                vitals.domInteractive = entry.domInteractive - entry.fetchStart;
              }
              if (entry.entryType === 'paint') {
                vitals[entry.name] = entry.startTime;
              }
            });
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['navigation', 'paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });
      
      performanceData[locale] = metrics;
    }
    
    // Compare performance between languages
    if (performanceData.pt.loadComplete && performanceData.en.loadComplete) {
      const ptLoad = performanceData.pt.loadComplete;
      const enLoad = performanceData.en.loadComplete;
      const difference = Math.abs(ptLoad - enLoad);
      const average = (ptLoad + enLoad) / 2;
      const differencePercentage = (difference / average) * 100;
      
      // Load times should be within 30% of each other
      expect(differencePercentage).toBeLessThan(30);
    }
  });

  test('Bundle size impact of multilingual content', async ({ page }) => {
    const bundleData = {};
    
    for (const locale of ['pt', 'en']) {
      await page.goto(`/${locale}/`);
      await page.waitForLoadState('networkidle');
      
      // Get resource sizes
      const resourceSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        let totalJS = 0;
        let totalCSS = 0;
        let totalImages = 0;
        
        resources.forEach(resource => {
          if (resource.name.includes('.js')) {
            totalJS += resource.transferSize || 0;
          } else if (resource.name.includes('.css')) {
            totalCSS += resource.transferSize || 0;
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)/)) {
            totalImages += resource.transferSize || 0;
          }
        });
        
        return { totalJS, totalCSS, totalImages };
      });
      
      bundleData[locale] = resourceSizes;
    }
    
    // Bundle sizes should be similar between languages
    const jsGrowth = Math.abs(bundleData.pt.totalJS - bundleData.en.totalJS);
    const cssGrowth = Math.abs(bundleData.pt.totalCSS - bundleData.en.totalCSS);
    
    // JS bundle size difference should be minimal (<10KB)
    expect(jsGrowth).toBeLessThan(10000);
    
    // CSS bundle size should be identical (no localized CSS)
    expect(cssGrowth).toBeLessThan(1000);
  });
});