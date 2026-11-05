// ===== Données et règles (aucun accès au DOM) =====
const LINES = { GAR: 0, DEF: 1, MIL: 2, ATT: 3 };

const NATIONS = {
  'France': { t: 'v', c: ['#2b4fa8', '#f4f4f4', '#d8232a'] },
  'Italie': { t: 'v', c: ['#1d8a43', '#f4f4f4', '#d8232a'] },
  'Allemagne': { t: 'h', c: ['#111111', '#d8232a', '#f2c14e'] },
  'Espagne': { t: 'h', c: ['#c8102e', '#f2c14e', '#f2c14e', '#c8102e'] },
  'Brésil': { t: 'd', c: ['#1d8a43', '#f2d22e', '#2b4fa8'] },
  'Argentine': { t: 'h', c: ['#7cc0ea', '#f4f4f4', '#7cc0ea'] },
  'Pays-Bas': { t: 'h', c: ['#c8102e', '#f4f4f4', '#2b4fa8'] },
  'Angleterre': { t: 'x', c: ['#f4f4f4', '#c8102e'] },
  'Portugal': { t: 'v', c: ['#1d7a3a', '#c8102e', '#c8102e'] },
  'URSS': { t: 'h', c: ['#c8102e'] },
  'Croatie': { t: 'h', c: ['#c8102e', '#f4f4f4', '#2b4fa8'] },
  'Belgique': { t: 'v', c: ['#111111', '#f2d22e', '#d8232a'] },
  'Colombie': { t: 'h', c: ['#f2d22e', '#f2d22e', '#2b4fa8', '#c8102e'] },
  'Danemark': { t: 'x', c: ['#c8102e', '#f4f4f4'] },
  'Suède': { t: 'x', c: ['#2b6cb0', '#f2d22e'] },
  'Norvège': { t: 'x', c: ['#c8102e', '#f4f4f4'] },
  'Cameroun': { t: 'v', c: ['#1d7a3a', '#c8102e', '#f2d22e'] },
  "Côte d'Ivoire": { t: 'v', c: ['#f08a24', '#f4f4f4', '#1d8a43'] },
  'Libéria': { t: 'h', c: ['#c8102e', '#f4f4f4', '#c8102e', '#f4f4f4'] },
  'Pologne': { t: 'h', c: ['#f4f4f4', '#d8232a'] },
  'Égypte': { t: 'h', c: ['#c8102e', '#f4f4f4', '#111111'] },
  'Sénégal': { t: 'v', c: ['#1d8a43', '#f2d22e', '#c8102e'] },
  'Maroc': { t: 'h', c: ['#c1272d'] },
};

// maillot, liseré
const CLUBS = {
  'Juventus': ['#f4f4f4', '#111111'], 'AC Milan': ['#c8102e', '#111111'],
  'Real Madrid': ['#f4f4f4', '#d4af37'], 'FC Barcelone': ['#a50044', '#004d98'],
  'Bayern Munich': ['#dc052d', '#f4f4f4'], 'Manchester United': ['#da291c', '#111111'],
  'Liverpool': ['#c8102e', '#f6eb61'], 'Chelsea': ['#034694', '#f4f4f4'],
  'Arsenal': ['#ef0107', '#f4f4f4'], 'Inter Milan': ['#0068a8', '#111111'],
  'Naples': ['#12a0d7', '#f4f4f4'], 'Santos': ['#f4f4f4', '#111111'],
  'Ajax': ['#f4f4f4', '#d2122e'], 'PSG': ['#1b2a4a', '#da291c'],
  'Manchester City': ['#6cabdd', '#f4f4f4'], 'Marseille': ['#f4f4f4', '#2faee0'],
  'AS Roma': ['#8e1f2f', '#f0bc42'], 'Dynamo Moscou': ['#1b4f9c', '#f4f4f4'],
  'Montpellier': ['#f47b20', '#1b2a4a'], 'Newcastle': ['#111111', '#f4f4f4'],
  'Dortmund': ['#fde100', '#111111'], 'Atlético Madrid': ['#cb3524', '#f4f4f4'],
  'Olympique': ['#5a8fd0', '#f4f4f4'],
};

// look : [peau 0-4, cheveux 0-6, coupe, pilosité]
// coupes : court, long, chauve, boucle, afro, queue, casquette, crete, degarni
// pilosité : rien, moustache, barbe, bouc
const L = (skin, hair, cut, face) => ({ skin, hair, cut, face: face || 'rien' });

const STARS = [
  // GARDIENS
  ['Lev Yachine', 'GAR', 89, 'Dynamo Moscou', 'URSS', 1960, ['Leader', 'Spécialiste'], 0, L(1, 0, 'casquette')],
  ['Gianluigi Buffon', 'GAR', 91, 'Juventus', 'Italie', 2000, ['Leader'], 0, L(1, 1, 'court', 'barbe')],
  ['Manuel Neuer', 'GAR', 90, 'Bayern Munich', 'Allemagne', 2010, ['Technique'], 0, L(0, 3, 'court')],
  ['Iker Casillas', 'GAR', 88, 'Real Madrid', 'Espagne', 2000, ['Leader'], 0, L(1, 0, 'court')],
  ['Fabien Barthez', 'GAR', 84, 'Manchester United', 'France', 1990, ['Technique'], 0, L(0, 0, 'chauve')],
  ['Peter Schmeichel', 'GAR', 87, 'Manchester United', 'Danemark', 1990, ['Leader', 'Physique'], 0, L(0, 3, 'court')],
  // DÉFENSEURS
  ['Franz Beckenbauer', 'DEF', 93, 'Bayern Munich', 'Allemagne', 1970, ['Leader', 'Technique'], 1, L(0, 2, 'court')],
  ['Paolo Maldini', 'DEF', 92, 'AC Milan', 'Italie', 1990, ['Leader', 'Vitesse'], 1, L(1, 1, 'long')],
  ['Franco Baresi', 'DEF', 89, 'AC Milan', 'Italie', 1980, ['Leader', 'Pressing'], 0, L(1, 1, 'degarni')],
  ['Cafu', 'DEF', 87, 'AS Roma', 'Brésil', 2000, ['Vitesse', 'Pressing'], 0, L(3, 0, 'chauve')],
  ['Roberto Carlos', 'DEF', 87, 'Real Madrid', 'Brésil', 2000, ['Vitesse', 'Spécialiste'], 0, L(3, 0, 'chauve')],
  ['Sergio Ramos', 'DEF', 88, 'Real Madrid', 'Espagne', 2010, ['Leader', 'Physique'], 0, L(1, 1, 'long', 'barbe')],
  ['Lilian Thuram', 'DEF', 86, 'Juventus', 'France', 1990, ['Physique', 'Vitesse'], 0, L(4, 0, 'court')],
  ['Marcel Desailly', 'DEF', 86, 'Chelsea', 'France', 1990, ['Physique', 'Leader'], 0, L(4, 0, 'chauve')],
  ['Virgil van Dijk', 'DEF', 89, 'Liverpool', 'Pays-Bas', 2020, ['Physique', 'Leader'], 0, L(3, 0, 'court', 'barbe')],
  ['Carles Puyol', 'DEF', 87, 'FC Barcelone', 'Espagne', 2000, ['Pressing', 'Leader'], 0, L(1, 1, 'boucle')],
  ['Alessandro Nesta', 'DEF', 87, 'AC Milan', 'Italie', 2000, ['Technique'], 0, L(1, 0, 'long')],
  ['Philipp Lahm', 'DEF', 86, 'Bayern Munich', 'Allemagne', 2010, ['Technique', 'Pressing'], 0, L(0, 2, 'court')],
  ['Kalidou Koulibaly', 'DEF', 85, 'Naples', 'Sénégal', 2010, ['Physique'], 0, L(4, 0, 'court', 'barbe')],
  // MILIEUX
  ['Zinédine Zidane', 'MIL', 94, 'Real Madrid', 'France', 2000, ['Technique', 'Leader'], 1, L(1, 1, 'degarni')],
  ['Michel Platini', 'MIL', 91, 'Juventus', 'France', 1980, ['Technique', 'Spécialiste'], 1, L(1, 2, 'boucle')],
  ['Xavi', 'MIL', 90, 'FC Barcelone', 'Espagne', 2010, ['Technique'], 0, L(1, 0, 'court', 'barbe')],
  ['Andrés Iniesta', 'MIL', 91, 'FC Barcelone', 'Espagne', 2010, ['Technique', 'Vitesse'], 0, L(0, 2, 'chauve')],
  ['Andrea Pirlo', 'MIL', 89, 'Juventus', 'Italie', 2010, ['Technique', 'Spécialiste'], 0, L(1, 1, 'long', 'barbe')],
  ['Steven Gerrard', 'MIL', 88, 'Liverpool', 'Angleterre', 2000, ['Leader', 'Physique'], 0, L(0, 2, 'court')],
  ['Frank Lampard', 'MIL', 87, 'Chelsea', 'Angleterre', 2000, ['Spécialiste', 'Physique'], 0, L(0, 2, 'court')],
  ['Luka Modrić', 'MIL', 90, 'Real Madrid', 'Croatie', 2010, ['Technique', 'Pressing'], 0, L(0, 3, 'long')],
  ['Patrick Vieira', 'MIL', 87, 'Arsenal', 'France', 2000, ['Physique', 'Pressing'], 0, L(4, 0, 'court')],
  ["N'Golo Kanté", 'MIL', 86, 'Chelsea', 'France', 2010, ['Pressing', 'Vitesse'], 0, L(4, 0, 'court')],
  ['Carlos Valderrama', 'MIL', 85, 'Montpellier', 'Colombie', 1990, ['Technique'], 0, L(2, 3, 'afro', 'moustache')],
  ['Gennaro Gattuso', 'MIL', 84, 'AC Milan', 'Italie', 2000, ['Pressing', 'Physique'], 0, L(1, 0, 'court', 'barbe')],
  ['Kevin De Bruyne', 'MIL', 90, 'Manchester City', 'Belgique', 2020, ['Technique', 'Spécialiste'], 0, L(0, 4, 'court')],
  ['Lothar Matthäus', 'MIL', 89, 'Bayern Munich', 'Allemagne', 1990, ['Leader', 'Physique'], 0, L(0, 2, 'long')],
  ['Clarence Seedorf', 'MIL', 86, 'AC Milan', 'Pays-Bas', 2000, ['Physique', 'Technique'], 0, L(4, 0, 'court')],
  // ATTAQUANTS
  ['Pelé', 'ATT', 96, 'Santos', 'Brésil', 1960, ['Technique', 'Vitesse'], 1, L(4, 0, 'court')],
  ['Diego Maradona', 'ATT', 96, 'Naples', 'Argentine', 1980, ['Technique', 'Spécialiste'], 1, L(2, 0, 'boucle')],
  ['Johan Cruyff', 'ATT', 94, 'Ajax', 'Pays-Bas', 1970, ['Technique', 'Vitesse'], 1, L(0, 2, 'long')],
  ['Ronaldo', 'ATT', 94, 'Inter Milan', 'Brésil', 1990, ['Vitesse', 'Technique'], 1, L(3, 0, 'chauve')],
  ['Lionel Messi', 'ATT', 96, 'FC Barcelone', 'Argentine', 2010, ['Technique', 'Vitesse'], 1, L(1, 2, 'court', 'barbe')],
  ['Cristiano Ronaldo', 'ATT', 95, 'Real Madrid', 'Portugal', 2010, ['Physique', 'Vitesse'], 1, L(1, 0, 'court')],
  ['Thierry Henry', 'ATT', 91, 'Arsenal', 'France', 2000, ['Vitesse', 'Technique'], 0, L(4, 0, 'chauve')],
  ['Marco van Basten', 'ATT', 91, 'AC Milan', 'Pays-Bas', 1980, ['Technique', 'Physique'], 0, L(0, 3, 'court')],
  ['Roberto Baggio', 'ATT', 90, 'Juventus', 'Italie', 1990, ['Technique', 'Spécialiste'], 0, L(1, 0, 'queue', 'bouc')],
  ['Ronaldinho', 'ATT', 92, 'FC Barcelone', 'Brésil', 2000, ['Technique'], 1, L(3, 0, 'long')],
  ['Kylian Mbappé', 'ATT', 92, 'PSG', 'France', 2020, ['Vitesse'], 1, L(4, 0, 'court')],
  ['Erling Haaland', 'ATT', 91, 'Manchester City', 'Norvège', 2020, ['Physique'], 0, L(0, 3, 'queue')],
  ['Karim Benzema', 'ATT', 90, 'Real Madrid', 'France', 2020, ['Technique'], 0, L(2, 0, 'court', 'barbe')],
  ['Zlatan Ibrahimović', 'ATT', 89, 'AC Milan', 'Suède', 2010, ['Physique', 'Technique'], 1, L(2, 0, 'queue', 'barbe')],
  ['Jean-Pierre Papin', 'ATT', 87, 'Marseille', 'France', 1990, ['Spécialiste', 'Physique'], 0, L(0, 2, 'court')],
  ['Didier Drogba', 'ATT', 88, 'Chelsea', "Côte d'Ivoire", 2000, ['Physique', 'Leader'], 0, L(4, 0, 'court')],
  ["Samuel Eto'o", 'ATT', 88, 'FC Barcelone', 'Cameroun', 2000, ['Vitesse'], 0, L(4, 0, 'court')],
  ['George Weah', 'ATT', 88, 'AC Milan', 'Libéria', 1990, ['Vitesse', 'Physique'], 0, L(4, 0, 'court')],
  ['Eric Cantona', 'ATT', 88, 'Manchester United', 'France', 1990, ['Leader', 'Technique'], 1, L(0, 1, 'court')],
  ['Robert Lewandowski', 'ATT', 90, 'Bayern Munich', 'Pologne', 2020, ['Physique', 'Spécialiste'], 0, L(0, 2, 'court')],
  ['Alan Shearer', 'ATT', 87, 'Newcastle', 'Angleterre', 1990, ['Physique'], 0, L(0, 2, 'court')],
  ['Mohamed Salah', 'ATT', 89, 'Liverpool', 'Égypte', 2020, ['Vitesse'], 0, L(2, 0, 'afro', 'barbe')],
  ['Antoine Griezmann', 'ATT', 88, 'Atlético Madrid', 'France', 2010, ['Technique', 'Pressing'], 0, L(0, 3, 'court')],
  ['Achraf Hakimi', 'DEF', 86, 'PSG', 'Maroc', 2020, ['Vitesse'], 0, L(2, 0, 'court')],
].filter(p => p[2] > 0);

// Effectif de départ : jeunes du centre de formation (noms fictifs)
const YOUTH = [
  ['K. Lemoine', 'GAR', 64, 'France', 1, ['Technique']], ['T. Brandt', 'GAR', 60, 'Allemagne', 1, []],
  ['Y. Diallo', 'DEF', 66, 'Sénégal', 0, ['Physique']], ['M. Rossi', 'DEF', 63, 'Italie', 0, ['Vitesse']],
  ['L. Perrin', 'DEF', 65, 'France', 0, ['Pressing']], ['J. Costa', 'DEF', 61, 'Portugal', 0, ['Vitesse']],
  ['A. Dupont', 'MIL', 67, 'France', 0, ['Technique']], ['S. Ortega', 'MIL', 64, 'Espagne', 0, ['Technique']],
  ['P. Novak', 'MIL', 62, 'Croatie', 0, ['Physique']], ['R. Benali', 'MIL', 65, 'Maroc', 0, ['Technique', 'Pressing']],
  ['N. Mendy', 'ATT', 68, 'France', 0, ['Vitesse']], ['D. Silva', 'ATT', 64, 'Brésil', 0, ['Technique']],
  ['B. Hansen', 'ATT', 63, 'Norvège', 0, ['Physique']], ['E. Moreau', 'ATT', 62, 'France', 0, ['Vitesse']],
];

function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-'); }
function price(r) { return Math.max(1, Math.round(((r - 55) ** 2) / 60 * 2) / 2); }
function salary(r) { return Math.max(0.2, Math.round(price(r) * 0.035 * 10) / 10); }

const PLAYERS = {};
STARS.forEach(([name, pos, r, club, nat, dec, styles, star, look]) => {
  const id = slug(name);
  PLAYERS[id] = { id, name, pos, r, club, nat, dec, styles, star: !!star, look, price: price(r), salary: salary(r) };
});
YOUTH.forEach(([name, pos, r, nat, , styles], i) => {
  const id = 'jeune-' + slug(name);
  const seed = i * 7 + 3;
  PLAYERS[id] = {
    id, name, pos, r, club: 'Olympique', nat, dec: 2020, styles, star: false, youth: true,
    look: L(seed % 5, (seed * 3) % 6, ['court', 'long', 'boucle', 'court', 'degarni', 'afro'][seed % 6], ['rien', 'rien', 'moustache', 'barbe'][seed % 4]),
    price: price(r), salary: salary(r),
  };
});

// tier : base (départ), commun (booster), rare, epique
const MOVES = {
  frappe: { name: 'Frappe isolée', base: 10, prec: 1, tier: 'base', desc: '1 joueur seul', test: c => c.n === 1 },
  passe: { name: 'Passe courte', base: 15, prec: 1.2, tier: 'base', desc: '2 joueurs ou plus', test: c => c.n >= 2 },
  unedeux: { name: 'Une-deux', base: 25, prec: 1.5, tier: 'base', desc: '2 joueurs du même poste', test: c => c.n === 2 && c.ps[0].pos === c.ps[1].pos },
  cpa: { name: 'Coup de pied arrêté', base: 60, prec: 2, tier: 'commun', desc: '1 Spécialiste seul', test: c => c.n === 1 && c.has(c.ps[0], 'Spécialiste') },
  centre: { name: 'Centre-tête', base: 30, prec: 2, tier: 'commun', desc: '2 joueurs, dont un ATT Physique', test: c => c.n === 2 && c.ps.some(p => p.pos === 'ATT' && c.has(p, 'Physique')) },
  triangle: { name: 'Triangle', base: 35, prec: 2.2, tier: 'commun', desc: '3 joueurs de 3 postes différents', test: c => c.n === 3 && new Set(c.ps.map(p => p.pos)).size === 3 },
  relance: { name: 'Relance propre', base: 30, prec: 2, tier: 'commun', desc: '2 joueurs ou plus, que des GAR et DEF', test: c => c.n >= 2 && !c.line.MIL && !c.line.ATT },
  recup: { name: 'Récupération haute', base: 40, prec: 2.2, tier: 'commun', desc: '2 joueurs Pressing ou plus', test: c => (c.style.Pressing || 0) >= 2 },
  long: { name: 'Jeu long', base: 35, prec: 2, tier: 'commun', desc: 'GAR ou DEF + ATT Physique, sans MIL', test: c => (c.line.GAR || c.line.DEF) && !c.line.MIL && c.ps.some(p => p.pos === 'ATT' && c.has(p, 'Physique')) },
  contre: { name: 'Contre éclair', base: 45, prec: 2.5, tier: 'rare', desc: 'DEF + 2 ATT, dont 2 Vitesse', test: c => c.line.DEF >= 1 && c.line.ATT >= 2 && (c.style.Vitesse || 0) >= 2 },
  solo: { name: 'Exploit individuel', base: 50, prec: 2.5, tier: 'rare', desc: '1 Star seule', test: c => c.n === 1 && c.ps[0].star },
  tiki: { name: 'Tiki-taka', base: 55, prec: 3, tier: 'rare', desc: '3 MIL Technique ou plus', test: c => { const m = c.ps.filter(p => p.pos === 'MIL'); return m.length >= 3 && m.every(p => c.has(p, 'Technique')); } },
  montee: { name: 'Montée complète', base: 70, prec: 3.5, tier: 'epique', desc: 'GAR, DEF, MIL et ATT', test: c => c.line.GAR && c.line.DEF && c.line.MIL && c.line.ATT },
  totale: { name: 'Attaque totale', base: 60, prec: 3.2, tier: 'epique', desc: '5 joueurs dont 3 ATT', test: c => c.n === 5 && c.line.ATT >= 3 },
};
const MOVE_SLOTS = 6;
const TIER_PRICE = { commun: 5, rare: 9, epique: 14 };
function movePrice(k, lv) { return TIER_PRICE[MOVES[k].tier] + 4 * lv; }


const STAFF = {
  prepa: { name: 'Préparateur physique', desc: 'Fatigue : 3 actions par match au lieu de 2', cost: 8 },
  adjoint: { name: 'Adjoint défensif', desc: '+0,5 précision si un DEF est dans l\'action', cost: 6 },
  coachatt: { name: 'Coach des attaquants', desc: '+20 base par ATT dans l\'action', cost: 7 },
  comm: { name: 'Directeur commercial', desc: '+3 M€ à chaque victoire', cost: 6 },
  psy: { name: 'Psychologue', desc: 'Annule la règle Ego', cost: 5 },
  gk: { name: 'Entraîneur des gardiens', desc: '+1 précision si un GAR est dans l\'action', cost: 7 },
  kine: { name: 'Kiné', desc: '+1 changement par match', cost: 6 },
  video: { name: 'Analyste vidéo', desc: 'Le mur adverse baisse de 10 %', cost: 10 },
  mental: { name: 'Préparateur mental', desc: '+1 possession par match', cost: 12 },
  scout: { name: 'Recruteur malin', desc: 'Relancer le mercato coûte 1 M€ de moins', cost: 4 },
};

const ITEMS = {
  pressing: { name: 'Pressing haut', desc: 'Mur -20 % pour la prochaine action', cost: 3 },
  blocbas: { name: 'Bloc bas', desc: 'L\'adversaire marque 1 but de moins, tu perds 2 possessions', cost: 4 },
  coaching: { name: 'Coaching gagnant', desc: '+1 possession', cost: 4 },
  tactique: { name: 'Changement tactique', desc: '+1 changement', cost: 2 },
  remontada: { name: 'Remontada', desc: 'Précision x2 pour la prochaine action', cost: 5 },
  recup: { name: 'Récupération', desc: 'Tous les joueurs fatigués reviennent', cost: 3 },
};

const RULES = {
  catenaccio: { name: 'Catenaccio', desc: 'Les attaquants ne comptent que la moitié de leur note' },
  gelee: { name: 'Pelouse gelée', desc: 'Le style Technique ne compte pas' },
  arbitre: { name: 'Arbitre tatillon', desc: 'Une action à 5 joueurs : le mieux noté est exclu du match' },
  derby: { name: 'Derby bouillant', desc: 'Synergies de club doublées, mais mur +20 %' },
  grace: { name: 'Gardien en état de grâce', desc: 'Ton premier but est annulé' },
};

const OPP_CLUBS = Object.keys(CLUBS).filter(c => c !== 'Olympique');

const SEASON = [
  { comp: 'Championnat', label: 'Journée 1', wall: 350, opp: 1, prime: 6 },
  { comp: 'Championnat', label: 'Journée 2', wall: 500, opp: 1, prime: 7 },
  { comp: 'Championnat', label: 'Grande affiche', wall: 700, opp: 2, prime: 10, boss: true },
  { comp: 'Coupe nationale', label: 'Huitième', wall: 900, opp: 2, prime: 10 },
  { comp: 'Coupe nationale', label: 'Demi-finale', wall: 1200, opp: 2, prime: 12 },
  { comp: 'Coupe nationale', label: 'Finale', wall: 1800, opp: 2, prime: 15, boss: true },
  { comp: 'Coupe d\'Europe', label: 'Quart de finale', wall: 2400, opp: 2, prime: 16 },
  { comp: 'Coupe d\'Europe', label: 'Demi-finale', wall: 3000, opp: 3, prime: 18 },
  { comp: 'Coupe d\'Europe', label: 'Finale', wall: 3700, opp: 3, prime: 25, boss: true },
];

// ===== Aléatoire =====
let rng = Math.random;
function setRng(f) { rng = f; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(a) { return a[Math.floor(rng() * a.length)]; }

// ===== Partie =====
function newGame() {
  const G = {
    budget: 12, squad: Object.values(PLAYERS).filter(p => p.youth).map(p => p.id),
    goals: {}, staff: [], items: [], levels: {}, moves: ['frappe', 'passe', 'unedeux'], stage: 0, rerolls: 0, offer: null, history: [],
  };
  Object.keys(MOVES).forEach(k => G.levels[k] = 0);
  return G;
}
function hasStaff(G, k) { return G.staff.includes(k); }

function newMatch(G) {
  const s = SEASON[G.stage];
  const natCount = {};
  G.squad.forEach(id => { const n = PLAYERS[id].nat; natCount[n] = (natCount[n] || 0) + 1; });
  const ossature = Object.entries(natCount).find(([, c]) => c >= 5);
  let poss = 6 + (hasStaff(G, 'mental') ? 1 : 0) + (ossature ? 1 : 0);
  const m = {
    stage: G.stage, opp: pick(OPP_CLUBS), wall: s.wall, oppGoals: s.opp, goals: 0,
    poss, possStart: poss, changes: 2 + (hasStaff(G, 'kine') ? 1 : 0),
    deck: shuffle(G.squad.slice()), hand: [], discard: [], out: [], fatigue: {},
    rule: s.boss ? pick(Object.keys(RULES)) : null, pressing: 0, nextWall: 1, nextPrec: 1,
    techUsed: false, graceUsed: false, played: 0, over: null, ossature: ossature ? ossature[0] : null, log: [],
  };
  draw(m);
  return m;
}

function fatigueLimit(G) { return hasStaff(G, 'prepa') ? 3 : 2; }

function draw(m) {
  while (m.hand.length < 8) {
    if (!m.deck.length) { if (!m.discard.length) break; m.deck = shuffle(m.discard); m.discard = []; }
    m.hand.push(m.deck.pop());
  }
  sortHand(m);
}
function sortHand(m) { m.hand.sort((a, b) => LINES[PLAYERS[a].pos] - LINES[PLAYERS[b].pos] || PLAYERS[b].r - PLAYERS[a].r); }

function stylesOf(p, m) {
  return m && m.rule === 'gelee' ? p.styles.filter(s => s !== 'Technique') : p.styles;
}

function evaluate(ids, m, G) {
  if (!ids.length) return null;
  const ps = ids.map(id => PLAYERS[id]).sort((a, b) => LINES[a.pos] - LINES[b.pos]);
  const syn = [];
  const n = ps.length;
  // notes
  const decCount = {};
  ps.forEach(p => decCount[p.dec] = (decCount[p.dec] || 0) + 1);
  let sum = 0;
  ps.forEach(p => {
    let r = p.r;
    if (m.rule === 'catenaccio' && p.pos === 'ATT') r = Math.floor(r / 2);
    if (decCount[p.dec] >= 2 && !p.youth) r += 5;
    sum += r;
  });
  const gen = Object.entries(decCount).filter(([d, c]) => c >= 2 && ps.some(p => p.dec == d && !p.youth));
  gen.forEach(([d, c]) => syn.push(`Génération ${d}s : +5 note x${c}`));

  const line = { GAR: 0, DEF: 0, MIL: 0, ATT: 0 };
  ps.forEach(p => line[p.pos]++);
  const st = p => stylesOf(p, m);
  const styleCount = {};
  ps.forEach(p => st(p).forEach(s => styleCount[s] = (styleCount[s] || 0) + 1));

  // mouvements possibles
  const ctx = { n, ps, line, style: styleCount, has: (p, x) => st(p).includes(x) };
  const cands = G.moves.filter(k => MOVES[k].test(ctx));
  // synergies communes
  let addBase = 0, addPrec = 0, multPrec = 1, wallMult = 1;
  const fatigueFree = new Set();
  const clubCount = {};
  ps.forEach(p => { if (p.club) clubCount[p.club] = (clubCount[p.club] || 0) + 1; });
  const derby = m.rule === 'derby' ? 2 : 1;
  Object.entries(clubCount).forEach(([c, k]) => {
    if (c === 'Olympique') return; // les jeunes du centre ne créent pas d'automatismes
    if (k === 2) { addPrec += 0.5 * derby; syn.push(`Automatismes ${c} : +${0.5 * derby} préc.`); }
    if (k >= 3) { addPrec += 1.5 * derby; ps.filter(p => p.club === c).forEach(p => fatigueFree.add(p.id)); syn.push(`Bloc ${c} : +${1.5 * derby} préc., sans fatigue`); }
  });
  const natCount = {};
  ps.forEach(p => natCount[p.nat] = (natCount[p.nat] || 0) + 1);
  Object.entries(natCount).forEach(([nat, k]) => {
    if (k >= 2) { addBase += 15 * k; syn.push(`Sélection ${nat} : +${15 * k} base`); }
  });
  let techBonus = false, pressingAdd = false;
  if ((styleCount.Vitesse || 0) >= 3) { const v = m.played === 0 ? 2 : 1; addPrec += v; syn.push(`Trio Vitesse : +${v} préc.`); }
  if ((styleCount.Physique || 0) >= 3) { wallMult *= 0.85; syn.push('Trio Physique : mur -15 %'); }
  if ((styleCount.Pressing || 0) >= 3) { pressingAdd = true; syn.push('Trio Pressing : mur -10 % jusqu\'à la fin'); }
  if ((styleCount.Technique || 0) >= 3 && !m.techUsed) { techBonus = true; syn.push('Trio Technique : +1 changement'); }
  const stars = ps.filter(p => p.star).length;
  const leader = ps.some(p => st(p).includes('Leader'));
  if (stars >= 2) {
    if (leader || hasStaff(G, 'psy')) syn.push('Ego calmé par un Leader');
    else { multPrec *= 0.7; syn.push('Ego : 2 stars sans Leader, préc. x0,7'); }
  }
  // staff
  if (hasStaff(G, 'adjoint') && line.DEF) { addPrec += 0.5; syn.push('Adjoint défensif : +0,5 préc.'); }
  if (hasStaff(G, 'coachatt') && line.ATT) { addBase += 20 * line.ATT; syn.push(`Coach des attaquants : +${20 * line.ATT} base`); }
  if (hasStaff(G, 'gk') && line.GAR) { addPrec += 1; syn.push('Entraîneur des gardiens : +1 préc.'); }
  if (hasStaff(G, 'video')) wallMult *= 0.9;
  if (m.nextPrec !== 1) { multPrec *= m.nextPrec; syn.push('Remontada : préc. x2'); }
  if (m.nextWall !== 1) { wallMult *= m.nextWall; syn.push('Pressing haut : mur -20 %'); }
  if (m.rule === 'derby') wallMult *= 1.2;
  wallMult *= Math.pow(0.9, m.pressing);

  let best = null;
  if (!cands.length) best = { move: null, base: 0, prec: 0, danger: 0, lv: 0 };
  cands.forEach(k => {
    const mv = MOVES[k], lv = G.levels[k] || 0;
    const base = mv.base + 10 * lv + addBase;
    const prec = Math.round((mv.prec + 0.5 * lv + addPrec) * multPrec * 100) / 100;
    const danger = Math.round((sum + base) * prec);
    if (!best || danger > best.danger) best = { move: k, base, prec, danger, lv };
  });
  const wall = Math.round(m.wall * wallMult);
  const goals = best.danger >= 2 * wall ? 2 : best.danger >= wall ? 1 : 0;
  return { ...best, sum, wall, goals, syn, fatigueFree, techBonus, pressingAdd, ordered: ps.map(p => p.id) };
}

function playable(m, G, id) {
  return (m.fatigue[id] || 0) < fatigueLimit(G);
}

function playAction(ids, m, G) {
  const ev = evaluate(ids, m, G);
  const res = { ...ev, cancelled: false, sentOff: null, scorer: null };
  let goals = ev.goals;
  if (goals > 0 && m.rule === 'grace' && !m.graceUsed) { m.graceUsed = true; goals -= 1; res.cancelled = true; }
  res.scored = goals;
  if (goals > 0) {
    const scorer = ev.ordered[ev.ordered.length - 1];
    res.scorer = scorer;
    G.goals[scorer] = (G.goals[scorer] || 0) + goals;
  }
  m.goals += goals;
  if (ev.pressingAdd) m.pressing++;
  if (ev.techBonus) { m.changes++; m.techUsed = true; }
  m.nextWall = 1; m.nextPrec = 1;
  let sentOff = null;
  if (m.rule === 'arbitre' && ids.length === 5) {
    sentOff = ids.slice().sort((a, b) => PLAYERS[b].r - PLAYERS[a].r)[0];
    res.sentOff = sentOff;
  }
  ids.forEach(id => {
    m.hand.splice(m.hand.indexOf(id), 1);
    if (!ev.fatigueFree.has(id)) m.fatigue[id] = (m.fatigue[id] || 0) + 1;
    if (id === sentOff) m.fatigue[id] = 99;
    if (m.fatigue[id] >= fatigueLimit(G)) m.out.push(id); else m.discard.push(id);
  });
  m.poss--; m.played++;
  draw(m);
  m.log.push(res);
  checkEnd(m);
  return res;
}

function changeCards(ids, m) {
  if (m.changes <= 0 || !ids.length || ids.length > 4) return false;
  ids.forEach(id => { m.hand.splice(m.hand.indexOf(id), 1); m.discard.push(id); });
  m.changes--;
  draw(m);
  return true;
}

function checkEnd(m) {
  if (m.goals > m.oppGoals) m.over = 'win';
  else if (m.poss <= 0 || !m.hand.length) m.over = 'loss';
}

function useItem(k, m, G) {
  const i = G.items.indexOf(k);
  if (i < 0) return false;
  if (k === 'pressing') m.nextWall = 0.8;
  if (k === 'blocbas') { if (m.poss <= 2) return false; m.oppGoals = Math.max(0, m.oppGoals - 1); m.poss -= 2; }
  if (k === 'coaching') m.poss++;
  if (k === 'tactique') m.changes++;
  if (k === 'remontada') m.nextPrec = 2;
  if (k === 'recup') { m.out.forEach(id => { m.fatigue[id] = 0; m.discard.push(id); }); m.out = []; Object.keys(m.fatigue).forEach(id => m.fatigue[id] = 0); draw(m); }
  G.items.splice(i, 1);
  checkEnd(m);
  return true;
}

function settle(m, G) {
  const s = SEASON[m.stage];
  const wage = Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10;
  const r = { wage, prime: 0, diff: 0, ticket: 0, comm: 0 };
  if (m.over === 'win') {
    r.prime = s.prime; r.diff = 2 * (m.goals - m.oppGoals); r.ticket = m.poss; r.comm = hasStaff(G, 'comm') ? 3 : 0;
  }
  r.total = Math.round((r.prime + r.diff + r.ticket + r.comm - wage) * 10) / 10;
  G.budget = Math.round((G.budget + r.total) * 10) / 10;
  return r;
}

function sellValue(G, id) { return Math.round((PLAYERS[id].price * 0.5 + (G.goals[id] || 0)) * 2) / 2; }

function rerollCost(G) { return Math.max(0, 2 + G.rerolls - (hasStaff(G, 'scout') ? 1 : 0)); }

function booster() { return shuffle(Object.keys(MOVES).filter(k => MOVES[k].tier === 'commun')).slice(0, 4); }
function addMove(G, k, lv) { if (G.moves.length >= MOVE_SLOTS || G.moves.includes(k)) return false; G.moves.push(k); G.levels[k] = Math.max(G.levels[k] || 0, lv || 0); return true; }
function removeMove(G, k) { const i = G.moves.indexOf(k); if (i < 0) return false; G.moves.splice(i, 1); G.levels[k] = 0; return true; }

function makeOffer(G) {
  const cap = 84 + G.stage * 2;
  const pool = Object.values(PLAYERS).filter(p => !p.youth && !G.squad.includes(p.id) && p.r <= cap);
  const players = shuffle(pool.slice()).slice(0, 4).map(p => p.id);
  const staff = shuffle(Object.keys(STAFF).filter(k => !G.staff.includes(k))).slice(0, 2);
  const items = shuffle(Object.keys(ITEMS)).slice(0, 2);
  const train = shuffle(G.moves.slice()).slice(0, 2);
  const tiers = G.stage < 3 ? ['commun', 'commun', 'rare'] : G.stage < 6 ? ['commun', 'rare', 'rare', 'epique'] : ['rare', 'epique'];
  const pool2 = Object.keys(MOVES).filter(k => MOVES[k].tier !== 'base' && !G.moves.includes(k));
  const moves = [];
  for (let i = 0; i < 6 && moves.length < 2; i++) {
    const t = pick(tiers); const opts = pool2.filter(k => (MOVES[k].tier === t || i > 3) && !moves.some(m => m.k === k));
    if (opts.length) { const lv = rng() < 0.25 + G.stage * 0.05 ? 1 + Math.floor(rng() * 2) : 0; moves.push({ k: pick(opts), lv }); }
  }
  G.offer = { players, staff, items, train, moves };
}


function wageTotal(G) { return Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10; }
function wallNow(m, G) { return Math.round(m.wall * (m.rule === 'derby' ? 1.2 : 1) * Math.pow(0.9, m.pressing) * (hasStaff(G, 'video') ? 0.9 : 1)); }

export {
  LINES, NATIONS, CLUBS, PLAYERS, MOVES, MOVE_SLOTS, TIER_PRICE, STAFF, ITEMS, RULES, SEASON,
  setRng, shuffle, newGame, newMatch, evaluate, playAction, changeCards, settle, makeOffer, playable, useItem,
  sellValue, rerollCost, price, booster, addMove, removeMove, movePrice, hasStaff, fatigueLimit, wageTotal, wallNow,
};
