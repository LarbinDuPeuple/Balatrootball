// Simulation d'équilibrage : node scripts/sim.mjs [N]
// Taux de victoire d'un bot glouton à chaque match, pour des effectifs typiques de début, milieu et fin de saison.
const L = await import('../src/game/logic.js');
const N = +(process.argv[2] || 150);
function subsets(a) { const r = []; const n = a.length; for (let mask = 1; mask < (1 << n); mask++) { const s = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) s.push(a[i]); if (s.length <= 5) r.push(s); } return r; }
function playMatch(G) {
  const m = L.newMatch(G);
  while (!m.over) {
    const hand = m.hand.filter(id => L.playable(m, G, id));
    if (!hand.length) { m.over = 'loss'; break; }
    let best = null;
    for (const s of subsets(hand)) { const e = L.evaluate(s, m, G); const score = e.goals * 1e6 + e.danger; if (!best || score > best.score) best = { s, score }; }
    L.playAction(best.s, m, G);
  }
  return m;
}
const P = Object.values(L.PLAYERS);
const need = { GAR: 2, DEF: 4, MIL: 4, ATT: 4 };
/** Effectif : 14 classiques dans [lo, hi], dont nStars remplacés par des stars (force <= sMax). */
function squad(lo, hi, nStars = 0, sMax = 80, extra = 0) {
  const out = [];
  for (const pos in need) {
    const c = L.shuffle(P.filter(p => p.classic && p.pos === pos && p.f >= lo && p.f <= hi)).slice(0, need[pos] + (pos === 'GAR' ? 0 : Math.ceil(extra / 3)));
    out.push(...c.map(p => p.id));
  }
  const st = L.shuffle(P.filter(p => p.star && p.f <= sMax && p.pos !== 'GAR')).slice(0, nStars);
  for (const s of st) { const i = out.findIndex(id => L.PLAYERS[id].pos === s.pos && !L.PLAYERS[id].star); if (i >= 0) out[i] = s.id; }
  return out;
}
const cs = () => L.shuffle(Object.keys(L.MOVES).filter(k => L.MOVES[k].tier === 'commun'));
const rs = () => L.shuffle(Object.keys(L.MOVES).filter(k => L.MOVES[k].tier === 'rare'));
const es = () => L.shuffle(Object.keys(L.MOVES).filter(k => L.MOVES[k].tier === 'epique'));
const commons = () => L.shuffle(Object.keys(L.STAFF).filter(k => L.STAFF[k].tier === 'commun' && !L.STAFF[k].unlock && !L.STAFF[k].group));
const PROFILES = {
  // match 1 à 3 : départ, un mouvement commun et un ou deux achats
  debut: { sq: () => squad(10, 30), setup: G => { L.addMove(G, cs()[0]); } },
  debut2: { sq: () => squad(10, 30, 0, 0, 2).concat(squad(30, 50).slice(0, 2)), setup: G => { cs().slice(0, 2).forEach(k => L.addMove(G, k)); G.staff = commons().slice(0, 1); } },
  // match 4 à 6 : quelques classiques solides, une star, 2 entraîneurs, un rare
  milieu: { sq: () => squad(25, 60, 1, 75, 3), setup: G => { cs().slice(0, 2).forEach(k => L.addMove(G, k)); L.addMove(G, rs()[0]); G.levels[G.moves[3]] = 1; G.staff = commons().slice(0, 2); } },
  // match 7 à 9 : bons classiques, 3 stars, 4 entraîneurs, mouvements montés
  fin: { sq: () => squad(45, 85, 3, 95, 4), setup: G => { L.addMove(G, cs()[0]); L.addMove(G, rs()[0]); L.addMove(G, es()[0]); G.moves.slice(3).forEach(k => G.levels[k] = 2); G.staff = [...commons().slice(0, 3), 'mental']; } },
};
const campaign = process.argv[3] || 'saison';
function rate(prof, stage) {
  let w = 0;
  for (let i = 0; i < N; i++) {
    const G = L.newGame(campaign); G.squad = PROFILES[prof].sq(); PROFILES[prof].setup(G); G.stage = stage;
    if (playMatch(G).over === 'win') w++;
  }
  return Math.round(w / N * 100);
}
console.log('campagne', campaign, '| murs', L.CAMPAIGNS.find(c => c.id === campaign).stages.map(s => s.wall).join(' '));
console.log('profil   ' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => String(s).padStart(4)).join(''));
for (const k of Object.keys(PROFILES)) console.log(k.padEnd(9) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(s => String(rate(k, s)).padStart(4)).join(''));
