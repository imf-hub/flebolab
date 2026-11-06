const { chromium } = require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1104-1290-0_26.1104.1290.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '../..');
  const out = path.join(root, 'docs/content/verification');
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, reducedMotion: 'reduce' });
  const clipped = [];
  const movingVisible = [];
  for (const folder of ['plates', 'animations']) {
    for (const file of fs.readdirSync(path.join(root, 'public/media', folder)).filter(x => x.endsWith('.svg'))) {
      await page.goto(pathToFileURL(path.join(root, 'public/media', folder, file)).href);
      const check = await page.evaluate(() => ({
        clipped: [...document.querySelectorAll('text')].filter(x => {
          const box = x.getBBox();
          return box.x < 0 || box.y < 0 || box.x + box.width > 1200 || box.y + box.height > 800;
        }).map(x => x.textContent),
        moving: [...document.querySelectorAll('.moving')].filter(x => getComputedStyle(x).display !== 'none').length,
      }));
      if (check.clipped.length) clipped.push({ file, text: check.clipped });
      if (folder === 'animations' && check.moving) movingVisible.push(file);
    }
  }
  await page.setViewportSize({ width: 1800, height: 3850 });
  await page.goto(pathToFileURL(path.join(out, 'contact-sheet.html')).href);
  await page.screenshot({ path: path.join(out, 'contact-sheet.png'), fullPage: true });
  fs.writeFileSync(path.join(out, 'layout.json'), JSON.stringify({ clipped, movingVisibleWithReducedMotion: movingVisible }, null, 2));
  await browser.close();
  console.log(JSON.stringify({ clipped, movingVisibleWithReducedMotion: movingVisible }, null, 2));
  process.exitCode = clipped.length || movingVisible.length ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
