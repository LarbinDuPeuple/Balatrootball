// Petits logos pixel : un badge coloré avec un sigle, pour les mouvements, styles, staff et consignes.
import Phaser from 'phaser';
import { C, hex, BIG_FONT } from './theme';
import { MOVES, STAFF, ITEMS } from '../game/logic.js';
import { TIER_COLOR } from './tiles';

export const MOVE_CODE: Record<string, string> = {
  frappe: 'FR', passe: 'PC', unedeux: '12', cpa: 'CF', centre: 'CT', triangle: 'TR', relance: 'RP',
  recup: 'RH', long: 'JL', contre: 'CE', solo: 'EX', tiki: 'TK', montee: 'MC', totale: 'AT',
};
export const STYLE_ICON: Record<string, [string, number]> = {
  Vitesse: ['V', C.sky], Technique: ['T', C.purple], Physique: ['P', C.red],
  Leader: ['L', C.gold], Pressing: ['PR', C.green], 'Spécialiste': ['S', 0xf08a24],
};
export const STYLE_DESC: Record<string, string> = {
  Vitesse: '3 dans l\'action : +1 précision (+2 à la première possession)',
  Technique: '3 dans l\'action : +1 changement (une fois par match)',
  Physique: '3 dans l\'action : mur -15 %',
  Leader: 'Calme la règle Ego quand 2 stars jouent ensemble',
  Pressing: '3 dans l\'action : mur -10 % jusqu\'à la fin du match',
  'Spécialiste': 'Permet le Coup de pied arrêté (joueur seul)',
};
export const STAFF_CODE: Record<string, string> = { prepa: 'PP', adjoint: 'AD', coachatt: 'CA', comm: '€', psy: 'PS', gk: 'EG', kine: 'K', video: 'AV', mental: 'PM', scout: 'RM' };
export const ITEM_CODE: Record<string, string> = { pressing: 'PH', blocbas: 'BB', coaching: 'CG', tactique: 'CH', remontada: 'R!', recup: 'RC' };

/** Texture de badge carré (taille en pixels écran), mise en cache par sigle, couleur et taille. */
export function badgeKey(scene: Phaser.Scene, code: string, color: number, size = 32) {
  const key = `bd_${code}_${color}_${size}`;
  if (scene.textures.exists(key)) return key;
  const t = scene.textures.createCanvas(key, size, size)!; const ctx = t.getContext();
  const u = Math.max(2, Math.round(size / 16));
  ctx.fillStyle = hex(C.edge); ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = hex(color); ctx.fillRect(u, u, size - 2 * u, size - 2 * u);
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(u, u, size - 2 * u, u);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(u, size - 2 * u, size - 2 * u, u);
  const fs = Math.round(size * (code.length > 1 ? 0.34 : 0.5));
  ctx.font = `${fs}px ${BIG_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = hex(C.edge); ctx.fillText(code, size / 2 + u / 2, size / 2 + u);
  ctx.fillStyle = '#ffffff'; ctx.fillText(code, size / 2, size / 2 + u / 2);
  t.refresh();
  return key;
}

export const moveBadge = (scene: Phaser.Scene, k: string, size = 32) => badgeKey(scene, MOVE_CODE[k] || '?', TIER_COLOR[(MOVES as any)[k].tier], size);
export const styleBadge = (scene: Phaser.Scene, s: string, size = 16) => badgeKey(scene, STYLE_ICON[s][0], STYLE_ICON[s][1], size);
export const staffBadge = (scene: Phaser.Scene, k: string, size = 32) => badgeKey(scene, STAFF_CODE[k] || '?', C.green, size);
export const itemBadge = (scene: Phaser.Scene, k: string, size = 32) => badgeKey(scene, ITEM_CODE[k] || '?', C.sky, size);

export function moveTip(k: string, lv: number) {
  const mv = (MOVES as any)[k];
  return { title: mv.name + (lv ? ` niv.${lv + 1}` : ''), sub: { base: 'Mouvement de base', commun: 'Mouvement commun', rare: 'Mouvement rare', epique: 'Mouvement épique' }[mv.tier as string], lines: [mv.desc, `${mv.base + 10 * lv} base × ${String(mv.prec + 0.5 * lv).replace('.', ',')} précision`], accent: TIER_COLOR[mv.tier] };
}
export function staffTip(k: string) { const s = (STAFF as any)[k]; return { title: s.name, sub: 'Staff permanent', lines: [s.desc, `Prix : ${s.cost} M€`], accent: C.green }; }
export function itemTip(k: string, inMatch = false) { const s = (ITEMS as any)[k]; return { title: s.name, sub: 'Consigne à usage unique', lines: [s.desc, inMatch ? 'Touche pour l\'utiliser maintenant' : `Prix : ${s.cost} M€`], accent: C.sky }; }
