import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'brochure.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  
  console.log(`📄 Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts and images to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 2000));

  const outputPath = path.resolve(__dirname, 'Tarapore_Robotics_Camp_Brochure.pdf');
  
  console.log('📝 Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`✅ PDF saved to: ${outputPath}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
