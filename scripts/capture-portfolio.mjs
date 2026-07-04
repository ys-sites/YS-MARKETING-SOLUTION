import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const sites = [
  { slug: 'allball',      url: 'https://www.centreallball.com' },
  { slug: 'mevoyages',    url: 'https://www.mevoyages.com' },
  { slug: '1001nuits',    url: 'https://www.1001nuit.com' }, // User verified: 1001nuit.com is correct
  { slug: 'ironfuellab',  url: 'https://www.ironfuellab.com' },
  { slug: 'jannette',     url: 'https://www.jannettecaribbean.ca' },
  { slug: 'mannypainter', url: 'https://www.mannypainter.ca' },
  { slug: 'tierexotics',  url: 'https://a-tier-exotics.vercel.app' },
  { slug: 'pressurewash', url: 'https://pressure-wash-pro-elite.vercel.app' },
  { slug: 'autoruby',     url: 'https://auto-ruby.vercel.app' },
];

mkdirSync('public/portfolio', { recursive: true });
const browser = await chromium.launch();

for (const { slug, url } of sites) {
  // Start with a standard laptop viewport so document scrollHeight measures accurately
  const page = await browser.newPage({ 
    viewport: { width: 1440, height: 900 }, 
    deviceScaleFactor: 1 
  });
  
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 50000 });
    await page.waitForTimeout(2000); // Wait for page to initialize

    // Hide common overlays, popups, cookie consent banners, and newsletter modal dialogs
    await page.addStyleTag({
      content: `
        /* Cookie consent, banners, modals, and newsletter signups */
        .cookie-banner, .cookie-consent, #cookie-law, .modal, .popup, 
        .newsletter-popup, [class*="cookie" i], [class*="popup" i], 
        [id*="cookie" i], [id*="popup" i], [class*="modal" i], [id*="modal" i],
        .sq-modal, .sq-popup, .newsletter-modal, #newsletter, .pop-up,
        .consent-banner, .banner-cookie, [class*="overlay" i] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }
        body, html {
          overflow: auto !important;
        }
      `
    });

    // Smooth scroll to bottom and back up to trigger lazy-loaded assets
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

    await page.waitForTimeout(2000); // Wait for scroll-back-to-top to settle

    // Measure the actual layout content height, capped at 5000px
    const actualHeight = await page.evaluate(() => {
      // Find the maximum of various height elements
      return Math.min(5000, Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ));
    });

    console.log(`Setting viewport size to 1440x${actualHeight} for ${slug}...`);
    await page.setViewportSize({ width: 1440, height: actualHeight });
    await page.waitForTimeout(2000); // Allow layout engines to recalculate

    await page.screenshot({ 
      path: `public/portfolio/${slug}.jpg`, 
      type: 'jpeg', 
      quality: 75
    });
    console.log(`Captured ${slug} successfully (${actualHeight}px tall).`);
  } catch (error) {
    console.error(`Failed to capture full page for ${url}, trying fallback...`, error);
    try {
      await page.setViewportSize({ width: 1440, height: 1600 });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `public/portfolio/${slug}.jpg`, type: 'jpeg', quality: 75 });
    } catch (fallbackError) {
      console.error(`Fallback failed for ${url}:`, fallbackError);
    }
  } finally {
    await page.close();
  }
}
await browser.close();
console.log('Done — 9 screenshots in public/portfolio/');
