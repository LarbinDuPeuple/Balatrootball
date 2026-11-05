// Test de bout en bout dans Chromium : node scripts/e2e.mjs (après npm run build)
import { createRequire } from 'module';
import { preview } from 'vite';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
const { chromium } = pw;
const out = process.argv[2] || '/tmp';
const server = await preview({ preview: { port: 4173 } });
const url = 'http://localhost:4173/';
const b = await chromium.launch();
const errs = [];
async function run(vw, vh, tag) {
  const pg = await b.newPage({ viewport: { width: vw, height: vh } });
  pg.on('pageerror', e => errs.push(tag + ': ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push(tag + ': ' + m.text()); });
  await pg.goto(url); await pg.waitForTimeout(1500);
  const box = await pg.locator('canvas').boundingBox();
  const s = box.width / 1280;
  const click = async (x, y, wait = 300) => { await pg.mouse.click(box.x + x * s, box.y + y * s); await pg.waitForTimeout(wait); };
  await pg.screenshot({ path: `${out}/${tag}-1-title.png` });
  await click(640, 570, 3800);
  await click(340, 360, 200); await click(540, 360, 200);
  await pg.screenshot({ path: `${out}/${tag}-2-booster.png` });
  await click(640, 570, 3500);
  await click(640, 402, 500); await click(640, 442, 600); // bouton Jouer de l'intro (avec ou sans règle)
  await pg.screenshot({ path: `${out}/${tag}-3-match.png` });
  await pg.mouse.move(box.x + 552 * s, box.y + 560 * s); await pg.waitForTimeout(400);
  await pg.screenshot({ path: `${out}/${tag}-3b-tip-card.png` });
  await pg.mouse.move(box.x + 1000 * s, box.y + 210 * s); await pg.waitForTimeout(400);
  await pg.screenshot({ path: `${out}/${tag}-3c-tip-move.png` });
  // sélectionne 4 cartes et joue, jusqu'à la fin du match
  for (let k = 0; k < 8; k++) {
    for (const x of [434, 552, 670, 788]) await click(x, 560, 120);
    await pg.screenshot({ path: `${out}/${tag}-4-sel.png` });
    await click(936, 684, 300);
    await pg.waitForTimeout(5500);
    const v = await pg.evaluate(() => 1);
    void v;
  }
  // force la victoire si le bot a perdu, pour tester le mercato
  await pg.evaluate(() => { const sc = game.scene.getScene('match'); if (sc.sys.isActive()) { sc.children.list.filter(o => o.depth >= 499).forEach(o => o.destroy()); sc.busy = false; window.__S.M.goals = window.__S.M.oppGoals + 1; window.__S.M.over = 'win'; sc.endMatch(); } });
  await pg.waitForTimeout(800);
  await pg.screenshot({ path: `${out}/${tag}-5-end.png` });
  await click(640, 570, 3500);
  await pg.screenshot({ path: `${out}/${tag}-6-mercato.png` });
  await pg.mouse.move(box.x + 360 * s, box.y + 668 * s); await pg.waitForTimeout(400);
  await pg.screenshot({ path: `${out}/${tag}-6b-tip-chip.png` });
  await click(156, 594, 800);
  await pg.screenshot({ path: `${out}/${tag}-7-squad.png` });
  await pg.close();
}
await run(1280, 720, 'pc');
await run(844, 390, 'phone');
console.log('errors', errs);
await b.close(); server.httpServer.close();
