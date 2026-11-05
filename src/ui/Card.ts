// Carte joueur façon vignette rétro, avec balancement, survol et reflets pour les raretés hautes.
import Phaser from 'phaser';
import { PLAYERS, CLUBS } from '../game/logic.js';
import { portraitKey, flagKey } from '../game/art';
import { C, txt, big, fmt } from './theme';
import { styleBadge, STYLE_DESC } from './icons';
import type { TipContent } from './Tooltip';

export const CARD_W = 120, CARD_H = 180;

export function rarity(r: number) { return r >= 92 ? 'legende' : r >= 88 ? 'or' : r >= 80 ? 'argent' : 'bronze'; }
const FRAME: Record<string, number> = { bronze: C.bronze, argent: C.silver, or: C.goldcard, legende: C.purple };
export function shortName(p: any) { const parts = p.name.split(' '); return parts.length === 1 ? p.name : parts.slice(1).join(' '); }

export class CardView extends Phaser.GameObjects.Container {
  id: string; p: any; selected = false; homeX = 0; homeY = 0; phase = Math.random() * 6;
  pips: Phaser.GameObjects.Graphics; glow: Phaser.GameObjects.Graphics; sway = true; hovered = false;
  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y);
    this.id = id; const p = this.p = (PLAYERS as any)[id];
    const rar = rarity(p.r), w = CARD_W, h = CARD_H, x0 = -w / 2, y0 = -h / 2;
    const g = scene.add.graphics();
    g.fillStyle(C.edge, 0.55).fillRect(x0 + 5, y0 + 7, w, h);
    g.fillStyle(C.edge, 1).fillRect(x0 - 3, y0 - 3, w + 6, h + 6);
    g.fillStyle(FRAME[rar], 1).fillRect(x0, y0, w, h);
    g.fillStyle(rar === 'legende' ? 0xf7ecff : C.cream, 1).fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
    const club = (CLUBS as any)[p.club] || ['#456'];
    const clubC = club[0] === '#f4f4f4' ? 0x3d3a48 : parseInt(club[0].slice(1), 16);
    g.fillStyle(clubC, 1).fillRect(x0 + 6, y0 + 6, w - 12, 16);
    g.fillStyle(C.edge, 1).fillRect(x0 + 8, y0 + 24, w - 16, w - 16);
    this.glow = scene.add.graphics();
    const head = txt(scene, x0 + 30, y0 + 7, p.club.toUpperCase(), 11, C.cream).setFixedSize(w - 38, 14);
    const flag = scene.add.image(x0 + 18, y0 + 14, flagKey(scene, p.nat)).setScale(1.5);
    const pic = scene.add.image(0, y0 + 25 + (w - 18) / 2, portraitKey(scene, id)).setDisplaySize(w - 18, w - 18);
    const note = scene.add.graphics();
    const nx = x0 + 22, ny = y0 + 24 + w - 38;
    note.fillStyle(C.edge, 1).fillCircle(nx, ny, 17);
    note.fillStyle(rar === 'or' || rar === 'legende' ? C.gold : C.green, 1).fillCircle(nx, ny, 14);
    const noteT = big(scene, nx + 1, ny + 1, String(p.f), p.f >= 100 ? 8 : 11, C.ink).setOrigin(0.5);
    const nm = txt(scene, x0 + 8, y0 + w + 10, `${p.pos} · ${shortName(p).toUpperCase()}`, 14, C.ink).setFixedSize(w - 14, 20);
    const badges = p.styles.map((st: string, i: number) => scene.add.image(x0 + 16 + i * 20, y0 + h - 18, styleBadge(scene, st, 18)));
    this.pips = scene.add.graphics();
    this.add([g, this.glow, head, flag, pic, note, noteT, nm, ...badges, this.pips]);
    if (p.star) {
      const sb = scene.add.graphics(); sb.fillStyle(C.edge, 1).fillRect(x0 + 9, y0 + 26, 38, 15); sb.fillStyle(C.red, 1).fillRect(x0 + 10, y0 + 27, 36, 13);
      this.add([sb, big(scene, x0 + 28, y0 + 34, 'STAR', 7, C.cream).setOrigin(0.5)]);
    }
    if (rar === 'legende' || rar === 'or') this.shine(rar === 'legende');
    this.setSize(w, h);
    scene.add.existing(this);
  }
  /** Reflet qui traverse la carte (or) ou halo arc-en-ciel (légende). */
  shine(holo: boolean) {
    const w = CARD_W, h = CARD_H;
    const band = this.scene.add.graphics().setBlendMode(Phaser.BlendModes.ADD);
    band.fillStyle(0xffffff, holo ? 0.22 : 0.16);
    band.fillPoints([new Phaser.Math.Vector2(-10, -h / 2), new Phaser.Math.Vector2(10, -h / 2), new Phaser.Math.Vector2(40, h / 2), new Phaser.Math.Vector2(20, h / 2)], true);
    this.addAt(band, 2);
    // le reflet reste dans la carte (pas de masque sur un conteneur)
    band.x = -w / 2 + 10;
    this.scene.tweens.add({ targets: band, x: w / 2 - 40, duration: 1400, delay: Math.random() * 2000, repeat: -1, repeatDelay: holo ? 900 : 2600, ease: 'Sine.inOut' });
    if (holo) {
      let t = 0; const hue = this.glow;
      const fn = () => { if (!this.active) return; t += 0.02; hue.clear(); const c = Phaser.Display.Color.HSVToRGB((t % 1), 0.5, 1) as any; hue.lineStyle(3, c.color, 0.9).strokeRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2); };
      const sc = this.scene; sc.events.on('update', fn); this.once('destroy', () => sc.events.off('update', fn));
    }
  }
  setFatigue(used: number, limit: number) {
    const g = this.pips; g.clear();
    const start = -CARD_W / 2 + 12 + this.p.styles.length * 20 + 6;
    for (let i = 0; i < limit; i++) { const x = start + i * 11, y = CARD_H / 2 - 22; g.fillStyle(C.edge, 1).fillRect(x - 1, y - 1, 9, 9); g.fillStyle(i < used ? C.red : C.green, 1).fillRect(x, y, 7, 7); }
  }
  setHome(x: number, y: number, rot = 0) { this.homeX = x; this.homeY = y; this.setData('rot', rot); }
  tick(t: number) {
    if (!this.sway) return;
    const lift = this.selected ? -34 : this.hovered ? -10 : 0;
    this.x += (this.homeX - this.x) * 0.25;
    this.y += (this.homeY + lift + Math.sin(t / 700 + this.phase) * 2 - this.y) * 0.25;
    const rot = (this.getData('rot') || 0) + Math.sin(t / 900 + this.phase) * 0.02;
    this.rotation += (rot - this.rotation) * 0.2;
  }
}

/** Contenu de l'info-bulle d'un joueur. */
export function cardTip(id: string, extra: string[] = []): TipContent {
  const p = (PLAYERS as any)[id];
  const lines = [
    `${p.club || 'Sans club'} · ${p.nat} · années ${p.dec}`,
    ...p.styles.map((s: string) => `${s} : ${STYLE_DESC[s]}`),
    ...(p.star ? ['Star : 2 stars sans Leader dans une action = précision x0,7'] : []),
    `Salaire ${fmt(p.salary)} par match · valeur ${fmt(p.price)}`,
    ...extra,
  ];
  return { title: p.name, sub: `${p.pos} · force ${p.f} · note FIFA ${p.r}`, lines, accent: FRAME[rarity(p.r)] };
}
