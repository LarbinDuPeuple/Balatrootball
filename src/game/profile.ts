// Progression permanente (sur l'appareil) : joueurs débloqués et campagnes gagnées.
const KEY = 'mercato-profil-v1';
export interface Profile { unlocked: string[]; won: Record<string, number>; runs: number }

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const p = JSON.parse(raw); return { unlocked: p.unlocked || [], won: p.won || {}, runs: p.runs || 0 }; }
  } catch { /* stockage indisponible : profil vide */ }
  return { unlocked: [], won: {}, runs: 0 };
}

export function saveProfile(p: Profile) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* tant pis, la partie continue */ }
}
