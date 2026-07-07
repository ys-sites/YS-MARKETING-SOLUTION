import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

try {
  let content = fs.readFileSync(sitemapPath, 'utf8');
  // Match all <lastmod>YYYY-MM-DD</lastmod> tags and replace them with the current date
  const updatedContent = content.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(sitemapPath, updatedContent, 'utf8');
  console.log(`Successfully updated sitemap.xml lastmod dates to ${today}.`);
} catch (error) {
  console.error('Error updating sitemap.xml:', error);
  process.exit(1);
}
