import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const sites = [
  { slug: 'allball',      url: 'https://www.centreallball.com' },
  { slug: 'mevoyages',    url: 'https://www.mevoyages.com' },
  { slug: '1001nuits',    url: 'https://www.1001nuits.com' },
  { slug: 'ironfuellab',  url: 'https://www.ironfuellab.com' },
  { slug: 'jannette',     url: 'https://www.jannettecaribbean.ca' },
  { slug: 'mannypainter', url: 'https://www.mannypainter.ca' },
  { slug: 'tierexotics',  url: 'https://a-tier-exotics.vercel.app' },
  { slug: 'pressurewash', url: 'https://pressure-wash-pro-elite.vercel.app' },
  { slug: 'autoruby',     url: 'https://auto-ruby.vercel.app' },
];

mkdirSync('public/portfolio', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

for (const { slug, url } of sites) {
  console.log(`Capturing ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(async () => {
      console.log(`Retrying ${url} with domcontentloaded...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    });
    
    // Trigger lazy-loaded content: scroll to bottom, then back to top
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 600;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 150);
          else { window.scrollTo(0, 0); setTimeout(resolve, 800); }
        };
        step();
      });
    });
    
    await page.waitForTimeout(1500); // let animations/heroes settle
    
    // Cap height to max 6000px to keep images optimized
    const docHeight = await page.evaluate(() => document.body.scrollHeight);
    if (docHeight > 6000) {
      await page.screenshot({ 
        path: `public/portfolio/${slug}.jpg`, 
        clip: { x: 0, y: 0, width: 1440, height: 6000 },
        type: 'jpeg', 
        quality: 72 
      });
    } else {
      await page.screenshot({ 
        path: `public/portfolio/${slug}.jpg`, 
        fullPage: true, 
        type: 'jpeg', 
        quality: 72 
      });
    }
  } catch (error) {
    console.error(`Failed to capture full page for ${url}, attempting viewport fallback...`, error);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 });
      await page.screenshot({ path: `public/portfolio/${slug}.jpg`, type: 'jpeg', quality: 72 });
    } catch (fallbackError) {
      console.error(`Fallback failed for ${url}:`, fallbackError);
    }
  }
}
await browser.close();
console.log('Done — 9 screenshots in public/portfolio/');
