// Tuiles d'information : mouvements, staff, consignes, entraînement.
import Phaser from 'phaser';
import { MOVES } from '../game/logic.js';
import { C, txt, dec } from './theme';

export const TIER_NAME: Record<string, string> = { base: 'Base', commun: 'Commun', rare: 'Rare', epique: 'Épique' };
export const TIER_COLOR: Record<string, number> = { base: C.silver, commun: C.green, rare: C.sky, epique: C.purple };

export class Tile extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Graphics; w: number; h: number; accent: number; picked = false;
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, kind: string, name: string, desc: string, foot: string, accent: number) {
    super(scene, x, y);
    this.w = w; this.h = h; this.accent = accent;
    this.bg = scene.add.graphics();
    const k = txt(scene, -w / 2 + 16, -h / 2 + 8, kind.toUpperCase(), 11, 0x6b6478);
    const n = txt(scene, -w / 2 + 16, -h / 2 + 24, name.toUpperCase(), 15, C.ink, { wordWrap: { width: w - 28 } });
    const d = txt(scene, -w / 2 + 16, n.y + n.height + 4, desc, 13, 0x3a3444, { fontStyle: '400', wordWrap: { width: w - 28 } });
    const f = txt(scene, -w / 2 + 16, h / 2 - 24, foot, 13, C.ink);
    this.add([this.bg, k, n, d, f]);
    this.setSize(w, h);
    this.draw();
    scene.add.existing(this);
  }
  draw() {
    const { w, h } = this, g = this.bg;
    g.clear();
    g.fillStyle(C.edge, 0.5).fillRect(-w / 2 + 4, -h / 2 + 6, w, h);
    g.fillStyle(this.picked ? C.gold : C.edge, 1).fillRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
    g.fillStyle(C.cream, 1).fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle(this.accent, 1).fillRect(-w / 2, -h / 2, 8, h);
  }
  setOn(v: boolean) { this.picked = v; this.draw(); return this; }
}

export function moveTile(scene: Phaser.Scene, x: number, y: number, w: number, h: number, k: string, lv: number) {
  const mv = (MOVES as any)[k];
  return new Tile(scene, x, y, w, h, TIER_NAME[mv.tier] + (lv ? ` · niv. ${lv + 1}` : ''), mv.name, mv.desc,
    `${mv.base + 10 * lv} base × ${dec(mv.prec + 0.5 * lv)}`, TIER_COLOR[mv.tier]);
}
