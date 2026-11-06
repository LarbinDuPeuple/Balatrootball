// Sauvegarde de la partie en cours (sur l'appareil), séparée du profil (collection, déblocages).
// SAVE_VERSION monte quand le format de la partie change : une ancienne partie est alors effacée,
// mais le profil, lui, n'est jamais touché.
import { PLAYERS, MOVES, STAFF, ITEMS, CAMPAIGNS } from './logic.js';

const KEY = 'mercato-partie';
export const SAVE_VERSION = 1;
export type Where = 'match' | 'mercato';

export function saveRun(G: any, where: Where) {
  try { localStorage.setItem(KEY, JSON.stringify({ v: SAVE_VERSION, where, at: Date.now(), G })); } catch { /* stockage plein ou bloqué */ }
}
export function clearRun() { try { localStorage.removeItem(KEY); } catch { /* rien */ } }

/** La partie en cours est-elle encore jouable avec cette version du jeu ? */
function valid(G: any) {
  const P = PLAYERS as any, Mv = MOVES as any, St = STAFF as any, It = ITEMS as any;
  const camp = (CAMPAIGNS as any[]).find(c => c.id === G?.campaign);
  return !!camp && Number.isInteger(G.stage) && G.stage >= 0 && G.stage < camp.stages.length
    && Array.isArray(G.squad) && G.squad.length >= 8 && G.squad.every((id: string) => P[id])
    && Array.isArray(G.moves) && G.moves.length > 0 && G.moves.every((k: string) => Mv[k])
    && Array.isArray(G.staff) && G.staff.every((k: string) => St[k])
    && Array.isArray(G.items) && G.items.every((k: string) => It[k])
    && typeof G.budget === 'number' && G.levels && G.goals
    && (!G.offer || ((G.offer.staff || []).every((k: string | null) => !k || St[k]) && (G.offer.moves || []).every((o: any) => !o || Mv[o.k])));
}

/** Partie sauvegardée, ou null (et la sauvegarde est effacée si elle n'est plus compatible). */
export function loadRun(): { G: any; where: Where; at: number } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.v !== SAVE_VERSION || !valid(s.G)) { clearRun(); return null; }
    Object.keys(MOVES).forEach(k => { if (s.G.levels[k] === undefined) s.G.levels[k] = 0; });
    return { G: s.G, where: s.where === 'mercato' ? 'mercato' : 'match', at: s.at || 0 };
  } catch { clearRun(); return null; }
}
