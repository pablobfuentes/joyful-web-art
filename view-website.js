import { chromium } from 'playwright';

const TARGET_URL = 'http://localhost:8080/';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log(`🌐 Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  
  console.log(`📄 Page title: ${await page.title()}`);
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'website-screenshot.png', 
    fullPage: true 
  });
  console.log('📸 Full page screenshot saved to website-screenshot.png');
  
  // Wait a bit so user can see the page
  console.log('👀 Browser will stay open for 15 seconds so you can see option 2...');
  await page.waitForTimeout(15000);
  
  await browser.close();
  console.log('✅ Done!');
})();
