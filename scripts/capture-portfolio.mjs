import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const sites = [
  { slug: 'allball',      url: 'https://www.centreallball.com' },
  { slug: 'mevoyages',    url: 'https://www.mevoyages.com' },
  { slug: '1001nuits',    url: 'https://www.1001nuit.com' },
  { slug: 'ironfuellab',  url: 'https://www.ironfuellab.com' },
  { slug: 'jannette',     url: 'https://www.jannettecaribbean.ca' },
  { slug: 'mannypainter', url: 'https://www.mannypainter.ca' },
  { slug: 'atierexotics',  url: 'https://a-tier-exotics.vercel.app' },
  { slug: 'pressurewash', url: 'https://pressure-wash-pro-elite.vercel.app' },
  { slug: 'autoruby',     url: 'https://auto-ruby.vercel.app' },
  { slug: 'villagrecque', url: 'https://villa-gercque.vercel.app' },
  { slug: 'kingpeinture', url: 'https://kingpeinture.vercel.app' },
  { slug: 'marchesaveurs', url: 'https://marchesaveurs.vercel.app' },
];

mkdirSync('public/portfolio', { recursive: true });
const browser = await chromium.launch();

for (const { slug, url } of sites) {
  // Keep the viewport at standard desktop size to prevent 100vh elements from stretching
  const page = await browser.newPage({ 
    viewport: { width: 1440, height: 900 }, 
    deviceScaleFactor: 1 
  });
  
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 50000 });
    await page.waitForTimeout(3000); // Wait for page to settle

    // Attempt to dismiss overlays via Escape keys
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    // Advanced dynamic script to hide large overlays/popups/modals
    await page.evaluate(() => {
      const selectors = [
        '.cookie-banner', '.cookie-consent', '#cookie-law', '.modal', '.popup', 
        '.newsletter-popup', '[class*="cookie" i]', '[class*="popup" i]', 
        '[id*="cookie" i]', '[id*="popup" i]', '[class*="modal" i]', '[id*="modal" i]',
        '.sq-modal', '.sq-popup', '.newsletter-modal', '#newsletter', '.pop-up',
        '.consent-banner', '.banner-cookie', '[class*="overlay" i]', '.sqs-announcement-bar-dropzone',
        '.age-gate', '.agegate', '.verification-modal', '#age-gate-modal'
      ];
      
      selectors.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
          });
        } catch (e) {}
      });

      // Scan all DOM elements to find and hide elements covering the viewport
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        const zIndex = parseInt(style.zIndex, 10);
        const isFixedOrAbsolute = style.position === 'fixed' || style.position === 'absolute';
        
        if (isFixedOrAbsolute && zIndex >= 50) {
          const rect = el.getBoundingClientRect();
          const coversViewport = rect.width > window.innerWidth * 0.7 && rect.height > window.innerHeight * 0.7;
          const hasPopupKeyword = /popup|modal|cookie|consent|banner|overlay|dialog|age|gate/i.test(el.className || '') || 
                                  /popup|modal|cookie|consent|banner|overlay|dialog|age|gate/i.test(el.id || '');
          
          if (coversViewport || hasPopupKeyword) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
          }
        }
      }

      // Force scrolling to be allowed on the page
      document.body.style.setProperty('overflow', 'auto', 'important');
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
    });

    // Scroll to the bottom and back to top to trigger lazy load assets
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight || totalHeight > 5000) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000); // Allow scrolling to settle

    // Take screenshot using native fullPage mode for perfect aspect ratio and elements rendering
    await page.screenshot({ 
      path: `public/portfolio/${slug}.jpg`, 
      type: 'jpeg', 
      quality: 75,
      fullPage: true
    });
    console.log(`Captured ${slug} successfully using fullPage mode.`);
  } catch (error) {
    console.error(`Failed to capture full page for ${url}:`, error);
  } finally {
    await page.close();
  }
}
await browser.close();
console.log('Done — 9 screenshots in public/portfolio/');
