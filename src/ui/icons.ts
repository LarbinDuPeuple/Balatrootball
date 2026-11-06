// Petits logos pixel : un badge coloré avec un sigle, pour les mouvements, styles, staff et consignes.
import Phaser from 'phaser';
import { C, hex, BIG_FONT } from './theme';
import { MOVES, STAFF, ITEMS, unlockText } from '../game/logic.js';
import { coachKey } from '../game/art';
import { TIER_COLOR } from './tiles';

export const MOVE_CODE: Record<string, string> = {
  frappe: 'FR', passe: 'PC', unedeux: '12', cpa: 'CF', centre: 'CT', triangle: 'TR', relance: 'RP',
  recup: 'RH', long: 'JL', contre: 'CE', solo: 'EX', tiki: 'TK', montee: 'MC', totale: 'AT',
  tete: 'TP', loin: 'FL', duo: 'DA', charniere: 'CC', relais: 'RM', degagement: 'DG', debord: 'DB', compat: 'CP', coequip: 'CQ', libero: 'GL',
  panenka: 'PK', chevauchee: 'CH', indirect: 'CI', quatuor: 'Q4', generation: 'GD', selnat: 'SN', blocclub: 'BC', brassard: 'BR', duel: 'DP', contrepress: 'CX',
  carre: 'C4', vieille: 'VG', vague: 'NV', dream: 'DT', melting: 'MP', beton: 'BA', clubleg: 'CL', onzenat: 'ON',
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
export const ITEM_CODE: Record<string, string> = {
  pressing: 'PH', blocbas: 'BB', coaching: 'CG', tactique: 'CH', remontada: 'R!', recup: 'RC', ballonlong: 'BL', profondeur: 'AP', defhaute: 'DH',
  losange: 'ML', volant: 'GV', rotation: 'RO', derby: 'JD', hymne: 'HN', prime: '€', videoadv: 'VA', tab: 'TB', presstout: 'PT', double: 'x2',
  sangfroid: 'SF', douzieme: '12', capitaine: 'CA', chapeau: 'CP', causerie: 'CM', vestiaire: 'VS', pluie: 'PL', additionnel: '+T', horsjeu: 'HJ', faute: 'FT', express: 'EX',
};

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
/** Vignette d'entraîneur : portrait pixel encadré de la couleur de sa rareté. */
export function staffBadge(scene: Phaser.Scene, k: string, size = 32) {
  const tier = (STAFF as any)[k]?.tier || 'commun';
  const key = `sb_${k}_${size}`;
  if (scene.textures.exists(key)) return key;
  const src = scene.textures.get(coachKey(scene, k, tier)).getSourceImage() as HTMLCanvasElement;
  const t = scene.textures.createCanvas(key, size, size)!, ctx = t.getContext();
  const u = Math.max(2, Math.round(size / 16));
  ctx.fillStyle = hex(C.edge); ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = hex(STAFF_TIER_COLOR[tier]); ctx.fillRect(u, u, size - 2 * u, size - 2 * u);
  ctx.imageSmoothingEnabled = false; ctx.drawImage(src, 2 * u, 2 * u, size - 4 * u, size - 4 * u);
  t.refresh();
  return key;
}
export const STAFF_TIER_COLOR: Record<string, number> = { commun: C.green, rare: C.sky, epique: C.purple, legende: C.gold };
export const STAFF_TIER_NAME: Record<string, string> = { commun: 'Commun', rare: 'Rare', epique: 'Épique', legende: 'Légendaire' };
export const itemBadge = (scene: Phaser.Scene, k: string, size = 32) => badgeKey(scene, ITEM_CODE[k] || '?', C.sky, size);

export function moveTip(k: string, lv: number) {
  const mv = (MOVES as any)[k];
  return { title: mv.name + (lv ? ` niv.${lv + 1}` : ''), sub: { base: 'Mouvement de base', commun: 'Mouvement commun', rare: 'Mouvement rare', epique: 'Mouvement épique' }[mv.tier as string], lines: [mv.desc, ...(mv.ex ? [mv.ex] : []), `${mv.base + 10 * lv} base × ${String(mv.prec + 0.5 * lv).replace('.', ',')} précision`], accent: TIER_COLOR[mv.tier] };
}
export function staffTip(k: string, locked = false, cost?: number) {
  const s = (STAFF as any)[k], c = cost ?? s.cost;
  return { title: s.name, sub: `${s.role} · ${STAFF_TIER_NAME[s.tier].toLowerCase()}`, lines: [s.desc, locked ? `Verrouillé : ${unlockText(k)}` : `Prix : ${c} M€ · revente ${Math.floor(c / 2)} M€`], accent: STAFF_TIER_COLOR[s.tier] };
}
export function itemTip(k: string, inMatch = false) { const s = (ITEMS as any)[k]; return { title: s.name, sub: 'Consigne à usage unique', lines: [s.desc, inMatch ? 'Touche pour l\'utiliser maintenant' : `Prix : ${s.cost} M€`], accent: C.sky }; }
