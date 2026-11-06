// Génère src/game/classics.js à partir de data/joueurs-classiques.txt (Nom;Poste;Club;Décennie;Force).
// Styles et looks sont tirés d'un hachage du nom : stables d'une génération à l'autre.
import fs from 'fs';
const h = s => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x; };
const STY = { GAR: ['Leader', 'Technique', 'Spécialiste'], DEF: ['Physique', 'Vitesse', 'Pressing', 'Leader'], MIL: ['Technique', 'Pressing', 'Spécialiste', 'Physique'], ATT: ['Vitesse', 'Physique', 'Technique', 'Spécialiste'] };
// teinte de peau probable par nation (0 clair à 4 foncé) : une tendance, pas une règle
const SKIN = {
  'Sénégal': [4, 4, 3], 'Cameroun': [4, 4, 3], "Côte d'Ivoire": [4, 4, 3], 'Nigéria': [4, 4, 3], 'Ghana': [4, 4, 3],
  'Maroc': [1, 2, 2], 'Algérie': [1, 2, 2], 'Égypte': [2, 2, 1], 'Turquie': [1, 1, 2],
  'Brésil': [0, 1, 2, 3, 4], 'Colombie': [1, 2, 2, 3], 'Mexique': [1, 2, 2], 'Uruguay': [0, 1, 1], 'Argentine': [0, 1, 1],
  'États-Unis': [0, 0, 1, 3, 4], 'Japon': [0, 1], 'Corée du Sud': [0, 1],
  'France': [0, 0, 1, 2, 3, 4, 4], 'Angleterre': [0, 0, 0, 1, 3, 4], 'Pays-Bas': [0, 0, 0, 2, 4], 'Belgique': [0, 0, 1, 3, 4], 'Portugal': [0, 1, 1, 2],
  'Suisse': [0, 0, 1, 2], 'Suède': [0, 0, 0, 1],
};
const CUTS = ['court', 'court', 'court', 'long', 'degarni', 'boucle', 'chauve', 'afro'];
const FACES = ['rien', 'rien', 'rien', 'barbe', 'moustache', 'bouc'];
const NAT = { 'URSS / Russie': 'URSS' };
const out = [];
let nat = null;
for (const l of fs.readFileSync('data/joueurs-classiques.txt', 'utf8').split('\n')) {
  if (!l.trim() || l.startsWith('# ')) continue;
  if (l.startsWith('#')) { nat = NAT[l.slice(1)] || l.slice(1); continue; }
  const [name, pos, club, dec, f] = l.split(';');
  const s = STY[pos], k = h(name + 's');
  const styles = [s[k % s.length]];
  if (k % 3 === 0) { const t = s[(k >>> 3) % s.length]; if (t !== styles[0]) styles.push(t); }
  const q = h(name), skins = SKIN[nat] || [0, 0, 1];
  const skin = skins[q % skins.length];
  const dark = skin >= 3;
  let cut = CUTS[(q >>> 4) % CUTS.length];
  if (cut === 'afro' && !dark) cut = 'boucle';
  const hair = dark || ['Japon', 'Corée du Sud'].includes(nat) ? 0 : [0, 1, 1, 2, 3, 4, 0, 1][(q >>> 7) % 8];
  const face = FACES[(q >>> 10) % FACES.length];
  out.push([name, pos, club, nat, +dec, +f, styles, { skin, hair, cut, face }]);
}
fs.writeFileSync('src/game/classics.js', '// Généré par scripts/classics.mjs, ne pas modifier à la main.\n// [nom, poste, club, nation, décennie, force, styles, look]\nexport const CLASSICS = [\n' + out.map(r => '  ' + JSON.stringify(r)).join(',\n') + ',\n];\n');
console.log(out.length, 'joueurs');
