// Capture d'écran de vérification : overlay + panel.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5173';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext();

// Overlay ouvert en premier pour recevoir les intents du panel (BroadcastChannel).
const overlay = await ctx.newPage();
await overlay.setViewportSize({ width: 1920, height: 1080 });
await overlay.goto(`${BASE}/overlay.html`, { waitUntil: 'networkidle' });

const panel = await ctx.newPage();
await panel.setViewportSize({ width: 1600, height: 1040 });
await panel.goto(`${BASE}/panel.html`, { waitUntil: 'networkidle' });
await panel.waitForTimeout(1200);

// Épingle les 4 modules (les toggles role=switch de la liste Modules sont les 4 premiers).
const toggles = panel.locator('button[role="switch"]');
const count = await toggles.count();
for (let i = 0; i < Math.min(4, count); i++) {
  await toggles.nth(i).click();
  await panel.waitForTimeout(150);
}
await panel.waitForTimeout(1200);

await panel.screenshot({ path: 'screenshots/panel.png', fullPage: true });

// L'overlay a reçu les intents d'épinglage → modules affichés.
await overlay.bringToFront();
await overlay.waitForTimeout(1200);
await overlay.screenshot({ path: 'screenshots/overlay.png' });

// Capture aussi le launcher.
const home = await ctx.newPage();
await home.setViewportSize({ width: 1280, height: 800 });
await home.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
await home.waitForTimeout(400);
await home.screenshot({ path: 'screenshots/index.png' });

await browser.close();
console.log('OK — screenshots/{overlay,panel,index}.png');
