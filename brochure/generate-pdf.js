const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const fileUrl = 'file:///' + path.join(__dirname, 'brochure.html').replace(/\\/g, '/');
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    
    // Go to the HTML file and wait until network is idle so all images load
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: path.join(__dirname, 'Tarapore_Summer_Camp_Brochure.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    console.log('PDF generated successfully!');
    await browser.close();
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
})();
