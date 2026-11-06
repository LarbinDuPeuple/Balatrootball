// Dessin pixel art procédural : portraits, drapeaux, terrain et sprites.
import Phaser from 'phaser';
import { NATIONS, CLUBS, PLAYERS } from './logic.js';

export const SKIN = ['#f2c9a0', '#e0aa7e', '#c68a5a', '#9c6a43', '#6b4426'];
const SKIN_SH = ['#d9a982', '#c48d62', '#a86f43', '#7f5333', '#53331b'];
export const HAIR = ['#1a1410', '#3b2516', '#6b4426', '#e3c063', '#b5512a', '#9a9a9a', '#f0e0a0'];
export const POS_BG: Record<string, string> = { GAR: '#f0d36a', DEF: '#8ec5e8', MIL: '#9fd38a', ATT: '#f0a08a' };

type Ctx = CanvasRenderingContext2D;
function px(ctx: Ctx, x: number, y: number, w: number, h: number, c: string) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

export function drawFlag(ctx: Ctx, nat: string) {
  const f = (NATIONS as any)[nat] || { t: 'h', c: ['#888'] };
  const W = 12, H = 8;
  if (f.t === 'v') { const w = W / f.c.length; f.c.forEach((c: string, i: number) => px(ctx, Math.round(i * w), 0, Math.ceil(w), H, c)); }
  else if (f.t === 'h') { const h = H / f.c.length; f.c.forEach((c: string, i: number) => px(ctx, 0, Math.round(i * h), W, Math.ceil(h), c)); }
  else if (f.t === 'x') { px(ctx, 0, 0, W, H, f.c[0]); px(ctx, 4, 0, 2, H, f.c[1]); px(ctx, 0, 3, W, 2, f.c[1]); }
  else if (f.t === 'd') { px(ctx, 0, 0, W, H, f.c[0]); px(ctx, 3, 2, 6, 4, f.c[1]); px(ctx, 2, 3, 8, 2, f.c[1]); px(ctx, 5, 3, 2, 2, f.c[2]); }
}

export function drawPortrait(ctx: Ctx, p: any) {
  const lk = p.look, sk = SKIN[lk.skin], sh = SKIN_SH[lk.skin], hc = HAIR[lk.hair];
  const [shirt, trim] = p.kit || (CLUBS as any)[p.club] || ['#5a8fd0', '#fff'];
  const bg = p.bg || POS_BG[p.pos];
  px(ctx, 0, 0, 20, 20, bg);
  for (let i = 0; i < 14; i++) px(ctx, (i * 7) % 20, (i * 5) % 9, 1, 1, 'rgba(0,0,0,.08)');
  const body = p.pos === 'GAR' ? '#2f9e5a' : shirt;
  px(ctx, 2, 16, 16, 4, body); px(ctx, 3, 15, 14, 1, body);
  px(ctx, 8, 15, 4, 1, trim); px(ctx, 9, 16, 2, 1, trim);
  px(ctx, 8, 13, 4, 2, sh);
  if (lk.cut === 'afro') { px(ctx, 3, 1, 14, 9, hc); px(ctx, 2, 3, 16, 7, hc); px(ctx, 3, 10, 2, 3, hc); px(ctx, 15, 10, 2, 3, hc); }
  if (lk.cut === 'long') px(ctx, 5, 4, 10, 10, hc);
  if (lk.cut === 'queue') { px(ctx, 14, 5, 3, 3, hc); px(ctx, 15, 8, 2, 3, hc); }
  px(ctx, 6, 4, 8, 10, sk); px(ctx, 7, 3, 6, 1, sk);
  px(ctx, 6, 4, 1, 1, bg); px(ctx, 13, 4, 1, 1, bg);
  px(ctx, 5, 8, 1, 2, sk); px(ctx, 14, 8, 1, 2, sk);
  px(ctx, 13, 5, 1, 8, sh); px(ctx, 7, 13, 6, 1, sh);
  px(ctx, 8, 8, 1, 1, '#111'); px(ctx, 11, 8, 1, 1, '#111');
  const brow = lk.hair === 3 || lk.hair === 6 ? '#a78a4a' : hc;
  px(ctx, 7, 7, 2, 1, brow); px(ctx, 11, 7, 2, 1, brow);
  px(ctx, 10, 9, 1, 2, sh);
  px(ctx, 9, 12, 3, 1, '#8a3b2c');
  const c = lk.cut;
  if (c === 'court' || c === 'queue') { px(ctx, 6, 3, 8, 2, hc); px(ctx, 7, 2, 6, 1, hc); px(ctx, 6, 5, 1, 2, hc); px(ctx, 13, 5, 1, 2, hc); }
  if (c === 'long') { px(ctx, 6, 3, 8, 2, hc); px(ctx, 7, 2, 6, 1, hc); px(ctx, 5, 5, 2, 8, hc); px(ctx, 13, 5, 2, 8, hc); }
  if (c === 'boucle') { px(ctx, 5, 2, 10, 3, hc); px(ctx, 5, 5, 2, 4, hc); px(ctx, 13, 5, 2, 4, hc); [6, 9, 12].forEach(x => px(ctx, x, 1, 2, 1, hc)); }
  if (c === 'afro') px(ctx, 6, 3, 8, 1, hc);
  if (c === 'degarni') { px(ctx, 6, 5, 1, 3, hc); px(ctx, 13, 5, 1, 3, hc); px(ctx, 5, 6, 1, 2, hc); px(ctx, 14, 6, 1, 2, hc); px(ctx, 9, 3, 2, 1, sh); }
  if (c === 'crete') { px(ctx, 9, 0, 2, 4, hc); px(ctx, 8, 1, 4, 2, hc); }
  if (c === 'chauve') px(ctx, 8, 4, 2, 1, 'rgba(255,255,255,.4)');
  if (c === 'casquette') { px(ctx, 6, 2, 8, 3, '#2a2a2a'); px(ctx, 5, 4, 10, 1, '#2a2a2a'); px(ctx, 4, 5, 8, 1, '#111'); }
  if (lk.face === 'moustache') px(ctx, 8, 11, 4, 1, hc);
  if (lk.face === 'barbe') { px(ctx, 6, 10, 1, 3, hc); px(ctx, 13, 10, 1, 3, hc); px(ctx, 7, 12, 6, 2, hc); px(ctx, 8, 11, 4, 1, hc); px(ctx, 9, 12, 3, 1, '#8a3b2c'); }
  if (lk.face === 'bouc') px(ctx, 9, 13, 2, 1, hc);
}

/** Texture du portrait (20x20) d'un joueur, créée à la demande. */
export function portraitKey(scene: Phaser.Scene, id: string) {
  const key = 'pt_' + id;
  if (!scene.textures.exists(key)) {
    const t = scene.textures.createCanvas(key, 20, 20)!;
    drawPortrait(t.getContext(), (PLAYERS as any)[id]);
    t.refresh();
  }
  return key;
}
export function flagKey(scene: Phaser.Scene, nat: string) {
  const key = 'fl_' + nat;
  if (!scene.textures.exists(key)) {
    const t = scene.textures.createCanvas(key, 12, 8)!;
    drawFlag(t.getContext(), nat);
    t.refresh();
  }
  return key;
}

// ===== Terrain (240x136) =====
export const PITCH_W = 240, PITCH_H = 136;
const HOME = [[12, 68], [40, 40], [40, 96], [70, 54], [70, 84], [100, 68], [120, 44], [120, 92]];
const CROWD_COLORS = ['#e8573a', '#f4c34f', '#7fc3ea', '#f3e7c9', '#9aa3c0', '#5a8fd0'];
const crowd: [number, number, string][] = [];
for (let i = 0; i < 520; i++) crowd.push([Math.floor(Math.random() * 240), Math.random() < .5 ? Math.floor(Math.random() * 12) : 124 + Math.floor(Math.random() * 12), CROWD_COLORS[i % 6]]);

export interface Actor { x: number; y: number; shirt: string; hair: string; skin: number; gk: string | null }

export function sprite(ctx: Ctx, x: number, y: number, shirt: string, hair: string, skin: number | string, t: number, gk: string | null) {
  const s = typeof skin === 'number' ? SKIN[skin] : skin;
  const step = Math.floor(t / 8) % 2;
  px(ctx, x - 2, y - 8, 4, 1, hair);
  px(ctx, x - 2, y - 7, 4, 3, s);
  px(ctx, x - 3, y - 4, 6, 3, gk || shirt);
  px(ctx, x - 2, y - 1, 4, 1, '#f3f3f3');
  px(ctx, x - 2 + step, y, 1, 2, s); px(ctx, x + 1 - step, y, 1, 2, s);
}

export function drawField(ctx: Ctx, oppColor: string, actors: Actor[] | null, ball: { x: number; y: number } | null, t: number, flash = 0) {
  px(ctx, 0, 0, 240, 136, '#1b1f2e');
  crowd.forEach(([x, y, c], i) => { if ((i + Math.floor(t / 12)) % 9) px(ctx, x, y, 1, 1, c); });
  for (let i = 0; i < 12; i++) px(ctx, i * 20, 14, 20, 108, i % 2 ? '#3f8f3a' : '#4a9c43');
  ctx.strokeStyle = '#e8f2e0'; ctx.lineWidth = 1;
  ctx.strokeRect(4.5, 16.5, 231, 103);
  ctx.beginPath(); ctx.moveTo(120.5, 16.5); ctx.lineTo(120.5, 119.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(120.5, 68, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeRect(4.5, 44.5, 24, 47); ctx.strokeRect(211.5, 44.5, 24, 47);
  ctx.strokeRect(4.5, 56.5, 8, 23); ctx.strokeRect(227.5, 56.5, 8, 23);
  px(ctx, 0, 58, 4, 20, '#dfe7ef'); px(ctx, 236, 58, 4, 20, '#dfe7ef');
  for (let y = 59; y < 77; y += 2) px(ctx, 237, y, 2, 1, '#9aa3c0');
  HOME.forEach(([x, y], i) => sprite(ctx, 240 - x, y + Math.round(Math.sin(t / 20 + i)), oppColor, '#111', 1, t + i * 5, i === 0 ? '#2f9e5a' : null));
  if (actors) actors.forEach(a => sprite(ctx, Math.round(a.x), Math.round(a.y), a.shirt, a.hair, a.skin, t + a.x, a.gk));
  else HOME.forEach(([x, y], i) => sprite(ctx, x, y + Math.round(Math.cos(t / 20 + i)), '#5a8fd0', HAIR[i % 5], i % 5, t + i * 3, i === 0 ? '#2f9e5a' : null));
  if (ball) { px(ctx, Math.round(ball.x) - 1, Math.round(ball.y) - 1, 3, 3, '#111'); px(ctx, Math.round(ball.x) - 1, Math.round(ball.y) - 1, 2, 2, '#fff'); }
  if (flash > 0) { ctx.fillStyle = `rgba(255,240,180,${flash})`; ctx.fillRect(0, 0, 240, 136); }
}

export function actorsFor(ids: string[]): Actor[] {
  const lineX: Record<string, number> = { GAR: 14, DEF: 50, MIL: 105, ATT: 170 };
  return ids.map((id, i) => {
    const p = (PLAYERS as any)[id];
    return { x: lineX[p.pos] + i * 6, y: 30 + ((i * 37 + p.r) % 76), shirt: ((CLUBS as any)[p.club] || ['#5a8fd0'])[0], hair: HAIR[p.look.hair], skin: p.look.skin, gk: p.pos === 'GAR' ? '#2f9e5a' : null };
  });
}

/** Portrait pixel d'un entraîneur (staff) : survêtement à la couleur de sa rareté, accessoire selon le rôle. */
const TIER_BG: Record<string, string> = { commun: '#bfe3a8', rare: '#a9d4f2', epique: '#d6b8f0', legende: '#f4d77a' };
const TIER_KIT: Record<string, string> = { commun: '#2f8f3a', rare: '#2b6cb0', epique: '#7a3fb0', legende: '#b8860b' };
// Traits signature des entraîneurs célèbres : [peau, cheveux, coupe, visage, accessoire, costume].
// Accessoires : lunettes, casquette, carnet, sifflet, cigare, echarpe, doudoune.
const SIGN: Record<string, [number, number, string, string, string, string?]> = {
  prepa: [0, 5, 'court', 'rien', 'sifflet'], kine: [1, 5, 'court', 'rien', 'lunettes'], comm: [0, 5, 'court', 'rien', 'casquette', '#1c3f8a'],
  adjoint: [1, 0, 'court', 'rien', 'rien', '#111111'], gk: [0, 5, 'degarni', 'rien', 'lunettes', '#2a2a2a'], coachatt: [0, 5, 'court', 'rien', 'cigare'],
  video: [0, 5, 'degarni', 'rien', 'lunettes', '#3a3a3a'], psy: [0, 1, 'court', 'rien', 'echarpe', '#c8102e'], scout: [0, 5, 'degarni', 'rien', 'carnet'],
  domenech: [0, 5, 'court', 'moustache', 'carnet', '#1c3f8a'], houllier: [0, 5, 'chauve', 'rien', 'lunettes', '#c8102e'], rehhagel: [0, 3, 'court', 'rien', 'rien', '#1d5fbf'],
  hodgson: [0, 5, 'degarni', 'rien', 'carnet'], aragones: [0, 5, 'degarni', 'rien', 'lunettes', '#c8102e'], bora: [1, 0, 'boucle', 'rien', 'rien'],
  eriksson: [0, 6, 'degarni', 'rien', 'lunettes', '#1c2a5a'], deschamps: [1, 5, 'court', 'rien', 'doudoune', '#1c3f8a'], herrera: [1, 0, 'court', 'rien', 'rien', '#0a1f5c'],
  mental: [0, 5, 'court', 'rien', 'rien', '#f4f4f4'], cf: [0, 3, 'court', 'rien', 'rien', '#a50044'], jeunes: [0, 5, 'degarni', 'rien', 'carnet', '#c8102e'],
  kop: [0, 3, 'court', 'barbe', 'lunettes', '#c8102e'], stat: [0, 3, 'court', 'rien', 'rien', '#111111'], tacticien: [0, 5, 'chauve', 'rien', 'rien', '#fb090b'],
  hitzfeld: [0, 5, 'court', 'rien', 'rien', '#dc052d'], lippi: [0, 5, 'boucle', 'rien', 'cigare', '#111111'], benitez: [0, 1, 'degarni', 'bouc', 'carnet', '#c8102e'],
  heynckes: [0, 5, 'court', 'rien', 'rien', '#dc052d'], conte: [1, 0, 'court', 'rien', 'rien', '#034694'], luisenrique: [1, 5, 'chauve', 'barbe', 'rien', '#a50044'],
  emery: [1, 0, 'court', 'rien', 'rien', '#f4f4f4'], selection: [0, 5, 'degarni', 'rien', 'lunettes', '#1c3f8a'], mecene: [1, 5, 'court', 'rien', 'doudoune', '#111111'],
  ultras: [0, 5, 'degarni', 'rien', 'carnet', '#111111'], ds: [0, 5, 'chauve', 'moustache', 'rien', '#f4f4f4'], michels: [0, 0, 'court', 'rien', 'rien', '#d2122e'],
  trapattoni: [0, 5, 'degarni', 'rien', 'sifflet', '#111111'], paisley: [0, 5, 'degarni', 'rien', 'casquette', '#c8102e'], happel: [0, 5, 'court', 'rien', 'cigare', '#2a2a2a'],
  mister: [1, 5, 'chauve', 'barbe', 'echarpe', '#6cabdd'], monde: [0, 5, 'court', 'rien', 'doudoune', '#ef0107'], lobanovski: [0, 5, 'court', 'rien', 'carnet', '#f4f4f4'],
};
export function coachKey(scene: Phaser.Scene, k: string, tier: string) {
  const key = 'cp_' + k;
  if (scene.textures.exists(key)) return key;
  let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const cuts = ['court', 'degarni', 'chauve', 'court', 'long', 'boucle'], faces = ['rien', 'moustache', 'barbe', 'rien', 'bouc'];
  const accs = ['lunettes', 'casquette', 'carnet', 'sifflet'];
  const sg = SIGN[k];
  const look = sg ? { skin: sg[0], hair: sg[1], cut: sg[2], face: sg[3] } : { skin: h % 5, hair: (h >> 2) % 7, cut: cuts[(h >> 3) % cuts.length], face: faces[(h >> 4) % faces.length] };
  const suit = sg?.[5] || TIER_KIT[tier];
  const fake = { pos: 'MIL', bg: TIER_BG[tier], kit: [suit, '#f4f4f4'], look };
  const t = scene.textures.createCanvas(key, 20, 20)!, ctx = t.getContext();
  drawPortrait(ctx, fake);
  const acc = sg ? sg[4] : accs[h % 4];
  if (acc === 'lunettes') { px(ctx, 7, 8, 2, 1, '#111'); px(ctx, 11, 8, 2, 1, '#111'); px(ctx, 9, 8, 2, 1, '#555'); }
  if (acc === 'casquette') { px(ctx, 5, 2, 10, 2, suit); px(ctx, 5, 4, 12, 1, suit); }
  if (acc === 'carnet') { px(ctx, 15, 16, 2, 3, '#f4f4f4'); px(ctx, 14, 15, 4, 1, '#c9c9c9'); }
  if (acc === 'sifflet') { px(ctx, 9, 15, 2, 3, '#d4af37'); }
  if (acc === 'cigare') { px(ctx, 11, 12, 3, 1, '#7a4a22'); px(ctx, 14, 12, 1, 1, '#ff7a2a'); px(ctx, 15, 10, 1, 1, '#cfcfcf'); }
  if (acc === 'echarpe') { px(ctx, 6, 14, 8, 2, '#e8e8e8'); px(ctx, 7, 16, 2, 3, '#e8e8e8'); }
  if (acc === 'doudoune') { px(ctx, 3, 15, 14, 1, '#111'); px(ctx, 3, 17, 14, 1, '#111'); }
  if (tier === 'legende') { px(ctx, 1, 1, 3, 1, '#fff7c2'); px(ctx, 2, 0, 1, 3, '#fff7c2'); }
  t.refresh();
  return key;
}
