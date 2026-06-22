// Captures de vérification (SPA HashRouter) : launcher, vues du panel, overlay.
// Prérequis : `npm run dev` (http://localhost:5173) dans un autre terminal.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
// Contexte partagé : l'overlay reçoit les intents du panel via BroadcastChannel (même origine).
const ctx = await browser.newContext();

// Overlay ouvert d'abord pour capter les changements de config publiés par le panel.
const overlay = await ctx.newPage();
await overlay.setViewportSize({ width: 1920, height: 1080 });
await overlay.goto(`${BASE}/#/overlay`, { waitUntil: 'networkidle' });

const panel = await ctx.newPage();
await panel.setViewportSize({ width: 1440, height: 960 });

// Épingle les modules implémentés depuis leurs pages de config (toggles role=switch).
// Best-effort : si la structure change, on continue sans bloquer les captures.
for (const route of [
  '/#/panel/modules/dofusdex',
  '/#/panel/modules/etendard',
  '/#/panel/modules/fiche',
  '/#/panel/modules/generique',
]) {
  await panel.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await panel.waitForTimeout(500);
  const switches = panel.locator('button[role="switch"][aria-checked="false"]');
  const n = Math.min(2, await switches.count());
  for (let i = 0; i < n; i++) {
    try {
      await switches.nth(i).click();
      await panel.waitForTimeout(150);
    } catch {
      /* tolérant */
    }
  }
}

// Captures des vues du panel.
for (const [route, name] of [
  ['/#/', 'index'],
  ['/#/panel/general', 'panel-general'],
  ['/#/panel/profils', 'panel-profils'],
  ['/#/panel/modules/dofusdex', 'panel-dofusdex'],
  ['/#/panel/modules/etendard', 'panel-etendard'],
  ['/#/panel/modules/fiche', 'panel-fiche'],
  ['/#/panel/modules/generique', 'panel-generique'],
]) {
  await panel.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await panel.waitForTimeout(700);
  await panel.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}

// L'overlay a reçu les intents d'épinglage → modules affichés.
await overlay.bringToFront();
await overlay.waitForTimeout(1000);
await overlay.screenshot({ path: `${OUT}/overlay.png` });

await browser.close();
console.log(`OK — captures dans ${OUT}/`);
