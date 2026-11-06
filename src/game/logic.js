// ===== Données et règles (aucun accès au DOM) =====
import { CLASSICS } from "./classics.js";
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
  'Mexique': { t: 'v', c: ['#1d7a3a', '#f4f4f4', '#c8102e'] },
  'Nigéria': { t: 'v', c: ['#1d8a43', '#f4f4f4', '#1d8a43'] },
  'Mali': { t: 'v', c: ['#1d8a43', '#f2d22e', '#c8102e'] },
  'Ukraine': { t: 'h', c: ['#2b6cb0', '#f2d22e'] },
  'Hongrie': { t: 'h', c: ['#c8102e', '#f4f4f4', '#1d7a3a'] },
  'Irlande du Nord': { t: 'x', c: ['#f4f4f4', '#c8102e'] },
  'Uruguay': { t: 'h', c: ['#f4f4f4', '#5aa0dc', '#f4f4f4', '#5aa0dc'] },
  'Serbie': { t: 'h', c: ['#c8102e', '#1b4f9c', '#f4f4f4'] },
  'Écosse': { t: 'x', c: ['#1b4f9c', '#f4f4f4'] },
  'Irlande': { t: 'v', c: ['#1d8a43', '#f4f4f4', '#f08a24'] },
  'Turquie': { t: 'd', c: ['#c8102e', '#f4f4f4', '#c8102e'] },
  'Tchéquie': { t: 'h', c: ['#f4f4f4', '#c8102e'] },
  'Suisse': { t: 'x', c: ['#c8102e', '#f4f4f4'] },
  'États-Unis': { t: 'h', c: ['#c8102e', '#f4f4f4', '#c8102e', '#f4f4f4', '#1b2a4a'] },
  'Ghana': { t: 'h', c: ['#c8102e', '#f2c14e', '#1d8a43'] },
  'Algérie': { t: 'v', c: ['#1d8a43', '#f4f4f4'] },
  'Japon': { t: 'd', c: ['#f4f4f4', '#c8102e', '#c8102e'] },
  'Corée du Sud': { t: 'd', c: ['#f4f4f4', '#c8102e', '#1b4f9c'] },
  'Grèce': { t: 'h', c: ['#1b6fc0', '#f4f4f4', '#1b6fc0', '#f4f4f4'] },
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
  'Nantes': ['#f2d22e', '#1d8a43'], 'Lyon': ['#f4f4f4', '#1b4f9c'], 'Bordeaux': ['#1b2a4a', '#f4f4f4'],
  'Lille': ['#c8102e', '#1b2a4a'], 'Auxerre': ['#f4f4f4', '#2b6cb0'], 'Sochaux': ['#f2c14e', '#1b4f9c'],
  'Porto': ['#1b4f9c', '#f4f4f4'], 'Ajaccio': ['#c8102e', '#f4f4f4'], 'Atlético Nacional': ['#1d8a43', '#f4f4f4'],
  'Pumas': ['#1b2a4a', '#d4af37'], 'Benfica': ['#c8102e', '#f4f4f4'],
  'Tottenham': ['#f4f4f4', '#132257'], 'Lazio': ['#87ceeb', '#f4f4f4'], 'Aston Villa': ['#670e36', '#95bfe5'],
  'Valence': ['#f4f4f4', '#f08a24'], 'Monaco': ['#e5202c', '#f4f4f4'], 'Galatasaray': ['#a90432', '#fdb912'],
  'Celtic': ['#1d8a43', '#f4f4f4'], 'Botafogo': ['#111111', '#f4f4f4'], 'Anderlecht': ['#5b2c83', '#f4f4f4'],
  'Al Ahly': ['#c8102e', '#f4f4f4'], 'West Ham': ['#7a263a', '#1bb1e7'], 'Rangers': ['#1b4f9c', '#f4f4f4'],
  'Fenerbahçe': ['#1b2a4a', '#f2d22e'], 'Everton': ['#274488', '#f4f4f4'], 'Villarreal': ['#f2d22e', '#1b4f9c'],
  'Séville': ['#f4f4f4', '#d8232a'], 'Spartak Moscou': ['#c8102e', '#f4f4f4'], 'Schalke': ['#1b4f9c', '#f4f4f4'],
  'River Plate': ['#f4f4f4', '#c8102e'], 'Real Sociedad': ['#1b4f9c', '#f4f4f4'], 'Parme': ['#f2d22e', '#1b4f9c'],
  'Mönchengladbach': ['#f4f4f4', '#111111'], 'Leicester': ['#1b4f9c', '#f4f4f4'], 'Leeds': ['#f4f4f4', '#f2d22e'],
  'Dynamo Kiev': ['#f4f4f4', '#1b4f9c'], 'Dukla Prague': ['#a50021', '#f2d22e'], 'CSKA Moscou': ['#a50021', '#1b4f9c'],
  'Betis': ['#1d8a43', '#f4f4f4'], 'Wolverhampton': ['#f2a900', '#111111'], 'Udinese': ['#f4f4f4', '#111111'],
  'Swansea': ['#f4f4f4', '#111111'], 'Sporting': ['#1d8a43', '#f4f4f4'], 'Reims': ['#c8102e', '#f4f4f4'],
  'RB Leipzig': ['#f4f4f4', '#dd0741'], 'Peñarol': ['#f2d22e', '#111111'], 'Nottingham Forest': ['#c8102e', '#f4f4f4'],
  'Leverkusen': ['#e32221', '#111111'], 'La Corogne': ['#1b4f9c', '#f4f4f4'], 'Fulham': ['#f4f4f4', '#111111'],
  'Fiorentina': ['#5b2c83', '#f4f4f4'], 'Corinthians': ['#f4f4f4', '#111111'], 'Celta Vigo': ['#8ac3ee', '#f4f4f4'],
  'Brighton': ['#0057b8', '#f4f4f4'], 'Bologne': ['#a50021', '#1b2a4a'], 'Boca Juniors': ['#1b4f9c', '#f2c14e'],
  'Atalanta': ['#1b2a4a', '#111111'], 'Hambourg': ['#f4f4f4', '#c8102e'], 'Flamengo': ['#c8102e', '#111111'],
  'Cruzeiro': ['#1b4f9c', '#f4f4f4'], 'Cagliari': ['#a50021', '#1b2a4a'], 'Feyenoord': ['#c8102e', '#f4f4f4'],
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
  ['Kaká', 'MIL', 91, 'AC Milan', 'Brésil', 2000, ['Vitesse', 'Technique'], 1, L(1, 1, 'court')],
  ['Andriy Shevchenko', 'ATT', 91, 'AC Milan', 'Ukraine', 2000, ['Vitesse', 'Physique'], 1, L(0, 2, 'court')],
  ['Luís Figo', 'MIL', 90, 'Real Madrid', 'Portugal', 2000, ['Technique', 'Vitesse'], 1, L(1, 1, 'long')],
  ['Rivaldo', 'ATT', 91, 'FC Barcelone', 'Brésil', 1990, ['Technique', 'Spécialiste'], 1, L(3, 0, 'court')],
  ['Romário', 'ATT', 91, 'FC Barcelone', 'Brésil', 1990, ['Vitesse'], 1, L(3, 0, 'court')],
  ['Eusébio', 'ATT', 92, 'Benfica', 'Portugal', 1960, ['Vitesse', 'Physique'], 1, L(4, 0, 'court')],
  ['Gerd Müller', 'ATT', 92, 'Bayern Munich', 'Allemagne', 1970, ['Spécialiste'], 1, L(0, 1, 'court')],
  ['George Best', 'ATT', 90, 'Manchester United', 'Irlande du Nord', 1960, ['Vitesse', 'Technique'], 1, L(0, 0, 'long', 'barbe')],
  ['Raúl', 'ATT', 89, 'Real Madrid', 'Espagne', 2000, ['Leader', 'Technique'], 1, L(1, 0, 'court')],
  ['Francesco Totti', 'ATT', 91, 'AS Roma', 'Italie', 2000, ['Technique', 'Leader'], 1, L(0, 3, 'court')],
  ['Alessandro Del Piero', 'ATT', 90, 'Juventus', 'Italie', 2000, ['Technique', 'Spécialiste'], 1, L(1, 0, 'court')],
  ['Ferenc Puskás', 'ATT', 93, 'Real Madrid', 'Hongrie', 1960, ['Spécialiste', 'Technique'], 1, L(1, 0, 'court')],
  ['Alfredo Di Stéfano', 'ATT', 94, 'Real Madrid', 'Argentine', 1960, ['Leader', 'Technique'], 1, L(1, 0, 'degarni')],
  ['Neymar', 'ATT', 90, 'PSG', 'Brésil', 2020, ['Technique', 'Vitesse'], 1, L(1, 0, 'crete')],
].filter(p => p[2] > 0);

// Indice de force : courbe qui accélère avec la note FIFA (62 → 10, 72 → 20, 85 → 47, 96 → 100).
function force(r) { return Math.max(5, Math.round(10 * Math.pow(10, (r - 62) / 34))); }

// ===== Pouvoirs de stars : un effet unique par star (symbole étoile sur la carte) =====
// c : { p, ps, n, line, style, m, G, fx } ; fx regroupe les effets (base, préc., multiplicateurs, mur...)
const mulF = (c, q, k) => { c.fx.force[q.id] = (c.fx.force[q.id] || 1) * k; };
const POWERS = {
  'Pelé': ['Le Roi', '+1 précision par but déjà marqué dans le match (max +3)', c => { c.fx.prec += Math.min(3, c.m.goals); }],
  'Diego Maradona': ['Main de Dieu', '1re action du match : mur -40 %', c => { if (c.m.played === 0) c.fx.wall *= 0.6; }],
  'Lionel Messi': ['La Pulga', 'Précision x1,5 avec au moins 2 coéquipiers', c => { if (c.n >= 3) c.fx.mult *= 1.5; }],
  'Cristiano Ronaldo': ['Siuuu', 'Précision x2 s\'il est le seul ATT de l\'action', c => { if (c.line.ATT === 1) c.fx.mult *= 2; }],
  'Zinédine Zidane': ['Roulette', '+1,5 précision s\'il est le seul MIL de l\'action', c => { if (c.line.MIL === 1) c.fx.prec += 1.5; }],
  'Johan Cruyff': ['Football total', '+0,5 précision par poste différent dans l\'action', c => { c.fx.prec += 0.5 * Object.values(c.line).filter(Boolean).length; }],
  'Ronaldo': ['Phénomène', 'Sa force est doublée', c => mulF(c, c.p, 2)],
  'Franz Beckenbauer': ['Kaiser', 'Les DEF de l\'action ont force x2', c => c.ps.filter(q => q.pos === 'DEF').forEach(q => mulF(c, q, 2))],
  'Michel Platini': ['Coup franc', '+2,5 précision s\'il joue seul', c => { if (c.n === 1) c.fx.prec += 2.5; }],
  'Ronaldinho': ['Sourire', 'Ne se fatigue jamais', c => c.fx.fresh.add(c.p.id)],
  'Kylian Mbappé': ['Turbo', '1re action du match : +3 précision', c => { if (c.m.played === 0) c.fx.prec += 3; }],
  'Eric Cantona': ['Kung-fu', '+2 précision, mais 1 chance sur 8 d\'être exclu', c => { c.fx.prec += 2; c.fx.red.push(c.p.id); }],
  'Zlatan Ibrahimović': ['Ibracadabra', 'Précision x2,5 s\'il joue seul', c => { if (c.n === 1) c.fx.mult *= 2.5; }],
  'Paolo Maldini': ['Il Capitano', 'Les joueurs de son club dans l\'action ne se fatiguent pas', c => c.ps.filter(q => q.club === c.p.club).forEach(q => c.fx.fresh.add(q.id))],
  'Thierry Henry': ['Va-va-voom', '+40 base par joueur Vitesse dans l\'action', c => { c.fx.base += 40 * (c.style.Vitesse || 0); }],
  'Andrea Pirlo': ['Maestro', '+1 précision par MIL dans l\'action', c => { c.fx.prec += c.line.MIL; }],
  'Lev Yachine': ['Araignée noire', 'Mur -25 %', c => { c.fx.wall *= 0.75; }],
  'Gianluigi Buffon': ['Gigi', '+60 base si un ATT est aussi dans l\'action', c => { if (c.line.ATT) c.fx.base += 60; }],
  'Manuel Neuer': ['Libéro', 'Compte aussi comme DEF et MIL pour les mouvements', c => { c.fx.lines.push('DEF', 'MIL'); }],
  'Steven Gerrard': ['Istanbul', 'Précision x2 si tu es mené de 2 buts ou plus', c => { if (c.m.oppGoals - c.m.goals >= 2) c.fx.mult *= 2; }],
  'Xavi': ['Métronome', '+0,5 précision par joueur Technique dans l\'action', c => { c.fx.prec += 0.5 * (c.style.Technique || 0); }],
  'Andrés Iniesta': ['Iniestazo', '+1 changement après chaque action où il joue', c => { c.fx.changes += 1; }],
  'Luka Modrić': ['Trivela', '+30 base par joueur dans l\'action', c => { c.fx.base += 30 * c.n; }],
  'Roberto Baggio': ['Divin codino', 'Dernière possession : sa force x4', c => { if (c.m.poss === 1) mulF(c, c.p, 4); }],
  'Erling Haaland': ['Cyborg', '+3 force par but qu\'il a marqué cette saison', c => { c.fx.addF[c.p.id] = (c.fx.addF[c.p.id] || 0) + 3 * (c.G.goals[c.p.id] || 0); }],
  'Gerd Müller': ['Der Bomber', '+1 force par but de ton équipe cette saison', c => { c.fx.addF[c.p.id] = (c.fx.addF[c.p.id] || 0) + Object.values(c.G.goals).reduce((a, b) => a + b, 0); }],
  'Karim Benzema': ['Nueve', '+1,5 précision s\'il y a exactement 2 ATT', c => { if (c.line.ATT === 2) c.fx.prec += 1.5; }],
  "N'Golo Kanté": ['Partout', 'Compte comme DEF, MIL et ATT pour les mouvements', c => { c.fx.lines.push('DEF', 'ATT'); }],
  'Virgil van Dijk': ['Tour de contrôle', 'Mur -20 %', c => { c.fx.wall *= 0.8; }],
  'Kevin De Bruyne': ['Caviar', '+2 précision si un ATT est dans l\'action', c => { if (c.line.ATT) c.fx.prec += 2; }],
  'Mohamed Salah': ['Pharaon', '+3 M€ par but marqué avec lui', c => { c.fx.money += 3; }],
  'Robert Lewandowski': ['Lewy', 'Les ATT de l\'action ont force x1,5', c => c.ps.filter(q => q.pos === 'ATT').forEach(q => mulF(c, q, 1.5))],
  'Lothar Matthäus': ['Panzer', 'Les Allemands de l\'action ont force x1,5', c => c.ps.filter(q => q.nat === 'Allemagne').forEach(q => mulF(c, q, 1.5))],
  'Marco van Basten': ['Volée de 88', '+80 base avec un autre Néerlandais', c => { if (c.ps.filter(q => q.nat === 'Pays-Bas').length >= 2) c.fx.base += 80; }],
  'Kaká': ['Contre éclair', '+1,5 précision avec un autre joueur Vitesse', c => { if ((c.style.Vitesse || 0) >= 2) c.fx.prec += 1.5; }],
  'Andriy Shevchenko': ['Sheva', '+1 précision par joueur de l\'AC Milan dans l\'action', c => { c.fx.prec += c.ps.filter(q => q.club === 'AC Milan').length; }],
  'Luís Figo': ['Transfert du siècle', '+0,1 précision par M€ en banque (max +3)', c => { c.fx.prec += Math.min(3, Math.max(0, Math.floor(c.G.budget)) / 10); }],
  'Rivaldo': ['Ciseau', 'Frappe isolée : précision x3', c => { c.fx.moveMult.frappe = (c.fx.moveMult.frappe || 1) * 3; }],
  'Romário': ['Baixinho', 'Force x2 si l\'action a 2 joueurs ou moins', c => { if (c.n <= 2) mulF(c, c.p, 2); }],
  'Eusébio': ['Panthère noire', '+50 base par joueur des années 60 ou 70', c => { c.fx.base += 50 * c.ps.filter(q => q.dec <= 1970).length; }],
  'George Best': ['Cinquième Beatle', '+3 précision, mais épuisé après 1 action', c => { c.fx.prec += 3; c.fx.tired.add(c.p.id); }],
  'Raúl': ['Ange de Madrid', '+40 base par joueur du Real Madrid dans l\'action', c => { c.fx.base += 40 * c.ps.filter(q => q.club === 'Real Madrid').length; }],
  'Francesco Totti': ['Il Pupone', 'Précision x2 si l\'action ne compte que des Italiens', c => { if (c.ps.every(q => q.nat === 'Italie')) c.fx.mult *= 2; }],
  'Alessandro Del Piero': ['Zona Del Piero', '+2 précision si l\'action a exactement 2 joueurs', c => { if (c.n === 2) c.fx.prec += 2; }],
  'Ferenc Puskás': ['Major galopant', '+1 précision par Spécialiste dans l\'action', c => { c.fx.prec += c.style.Spécialiste || 0; }],
  'Alfredo Di Stéfano': ['Flèche blonde', '+0,3 précision par victoire de la saison', c => { c.fx.prec += 0.3 * c.G.history.filter(h => h.won).length; }],
  'Iker Casillas': ['San Iker', 'Les tirs arrêtés avec lui usent le mur 1,5 fois plus', c => { c.fx.wear *= 1.5; }],
  'Fabien Barthez': ['Bisou sur le crâne', '+1 précision par Français dans l\'action', c => { c.fx.prec += c.ps.filter(q => q.nat === 'France').length; }],
  'Peter Schmeichel': ['Étoile de mer', 'Mur -15 % si un DEF est dans l\'action', c => { if (c.line.DEF) c.fx.wall *= 0.85; }],
  'Franco Baresi': ['Libero', '+1 précision par DEF dans l\'action', c => { c.fx.prec += c.line.DEF; }],
  'Cafu': ['Pendolino', '+60 base si un DEF et un ATT jouent ensemble', c => { if (c.line.DEF && c.line.ATT) c.fx.base += 60; }],
  'Roberto Carlos': ['Coup franc impossible', 'Coup de pied arrêté : précision x2', c => { c.fx.moveMult.cpa = (c.fx.moveMult.cpa || 1) * 2; }],
  'Sergio Ramos': ['Minute 93', 'Dernière possession : +3 précision', c => { if (c.m.poss === 1) c.fx.prec += 3; }],
  'Lilian Thuram': ['Doublé de 98', 'Compte aussi comme ATT pour les mouvements', c => { c.fx.lines.push('ATT'); }],
  'Marcel Desailly': ['Le Roc', 'Les DEF de l\'action ne se fatiguent pas', c => c.ps.filter(q => q.pos === 'DEF').forEach(q => c.fx.fresh.add(q.id))],
  'Carles Puyol': ['Capitaine', '+0,7 précision par joueur du FC Barcelone dans l\'action', c => { c.fx.prec += 0.7 * c.ps.filter(q => q.club === 'FC Barcelone').length; }],
  'Alessandro Nesta': ['Tacle parfait', 'Mur -15 %', c => { c.fx.wall *= 0.85; }],
  'Philipp Lahm': ['Polyvalent', 'Compte aussi comme MIL pour les mouvements', c => { c.fx.lines.push('MIL'); }],
  'Kalidou Koulibaly': ['Mur de Naples', '+40 base par DEF dans l\'action', c => { c.fx.base += 40 * c.line.DEF; }],
  'Frank Lampard': ['Super Frank', '+1,5 précision si un MIL et un ATT jouent ensemble', c => { if (c.line.MIL && c.line.ATT) c.fx.prec += 1.5; }],
  'Patrick Vieira': ['Invincibles', 'Les joueurs d\'Arsenal de l\'action ont force x1,5', c => c.ps.filter(q => q.club === 'Arsenal').forEach(q => mulF(c, q, 1.5))],
  'Carlos Valderrama': ['El Pibe', 'Précision x1,5 si l\'action a 4 joueurs ou plus', c => { if (c.n >= 4) c.fx.mult *= 1.5; }],
  'Gennaro Gattuso': ['Ringhio', '+25 base par joueur Pressing, ne se fatigue jamais', c => { c.fx.base += 25 * (c.style.Pressing || 0); c.fx.fresh.add(c.p.id); }],
  'Clarence Seedorf': ['Quatre étoiles', '+0,5 précision par club différent dans l\'action', c => { c.fx.prec += 0.5 * new Set(c.ps.map(q => q.club)).size; }],
  'Jean-Pierre Papin': ['Papinade', 'Centre-tête : précision x2', c => { c.fx.moveMult.centre = (c.fx.moveMult.centre || 1) * 2; }],
  'Didier Drogba': ['Munich 2012', 'Dernière possession : sa force x3', c => { if (c.m.poss === 1) mulF(c, c.p, 3); }],
  "Samuel Eto'o": ['Triplé', '+3 force par victoire de la saison', c => { c.fx.addF[c.p.id] = (c.fx.addF[c.p.id] || 0) + 3 * c.G.history.filter(h => h.won).length; }],
  'George Weah': ['Mister George', '+70 base s\'il est le seul ATT de l\'action', c => { if (c.line.ATT === 1) c.fx.base += 70; }],
  'Alan Shearer': ['Bras levé', '+1 précision par Anglais dans l\'action', c => { c.fx.prec += c.ps.filter(q => q.nat === 'Angleterre').length; }],
  'Antoine Griezmann': ['Célébration', '+0,7 précision par Français ou joueur de l\'Atlético', c => { c.fx.prec += 0.7 * c.ps.filter(q => q.nat === 'France' || q.club === 'Atlético Madrid').length; }],
  'Achraf Hakimi': ['Fusée', '1re action du match : sa force x3', c => { if (c.m.played === 0) mulF(c, c.p, 3); }],
  'Neymar': ['Simulation', 'Mur -10 % et +1 changement après l\'action', c => { c.fx.wall *= 0.9; c.fx.changes += 1; }],
};

function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function price(r) { return Math.max(1, Math.round(((r - 55) ** 2) / 60 * 2) / 2); }
function salary(r) { return Math.max(0.2, Math.round(price(r) * 0.035 * 10) / 10); }

const PLAYERS = {}, POWER_FX = {};
// Stars : force de 100 à 60 selon leur note, rares et puissantes grâce à leur pouvoir.
const starRank = STARS.map(x => x[2]).map((r, i) => [r, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).map(x => x[1]);
STARS.forEach(([name, pos, r, club, nat, dec, styles, , look], i) => {
  const id = slug(name);
  const pw = POWERS[name];
  const f = Math.round(100 - starRank.indexOf(i) * 40 / (STARS.length - 1));
  PLAYERS[id] = { id, name, pos, r, f, club, nat, dec, styles, star: !!pw, look, price: price(r), salary: salary(r), power: pw ? { name: pw[0], desc: pw[1] } : null };
  if (pw) POWER_FX[id] = pw[2];
});
// Joueurs classiques : force de 10 à 90, répartie à parts à peu près égales.
const rOf = f => Math.round(62 + 34 * Math.log10(f / 10));
CLASSICS.forEach(([name, pos, club, nat, dec, f, styles, look]) => {
  let id = slug(name);
  if (PLAYERS[id]) id += '-' + slug(nat);
  const pr = Math.max(1, Math.round(f / 4) / 1);
  PLAYERS[id] = { id, name, pos, r: rOf(f), f, club, nat, dec, styles, star: false, classic: true, look, price: pr, salary: f <= 30 ? 0.1 : Math.round(pr * 0.035 * 10) / 10 };
});

// ===== Paliers de nations (nombre de joueurs connus) =====
const NATION_TIER = {};
['France', 'Angleterre', 'Espagne', 'Italie', 'Brésil'].forEach(n => NATION_TIER[n] = 'top');
['Allemagne', 'Pays-Bas', 'Portugal', 'Argentine', 'Belgique', 'Croatie', 'Uruguay', 'URSS', 'Pologne'].forEach(n => NATION_TIER[n] = 't20');
['Suède', 'Danemark', 'Turquie', 'Tchéquie', 'Colombie', 'Mexique', 'Sénégal', 'Cameroun', "Côte d'Ivoire", 'Nigéria'].forEach(n => NATION_TIER[n] = 't15');
['Serbie', 'Écosse', 'Irlande', 'Suisse', 'États-Unis', 'Ghana', 'Maroc', 'Algérie', 'Égypte', 'Japon', 'Corée du Sud',
  'Norvège', 'Hongrie', 'Libéria', 'Ukraine', 'Irlande du Nord', 'Mali'].forEach(n => NATION_TIER[n] = 't10');
const TOP_NATIONS = Object.keys(NATION_TIER).filter(n => NATION_TIER[n] === 'top');
const CONTINENTS = {
  afrique: { name: 'Afrique', nats: ['Sénégal', 'Cameroun', "Côte d'Ivoire", 'Nigéria', 'Ghana', 'Maroc', 'Algérie', 'Égypte', 'Libéria', 'Mali'] },
  amsud: { name: 'Amérique du Sud', nats: ['Brésil', 'Argentine', 'Uruguay', 'Colombie'] },
  est: { name: 'Europe de l\'Est', nats: ['URSS', 'Ukraine', 'Pologne', 'Tchéquie', 'Serbie', 'Croatie', 'Hongrie'] },
  asie: { name: 'Asie', nats: ['Japon', 'Corée du Sud', 'Turquie'] },
  amnord: { name: 'Amérique du Nord', nats: ['États-Unis', 'Mexique'] },
};

// ===== Tirage de départ : 14 classiques de force 10 à 30 =====
const STARTER = { GAR: 2, DEF: 4, MIL: 4, ATT: 4 };
const isStarterPick = p => p.classic && p.f <= 30;
/** Contexte d'un groupe de joueurs pour tester un mouvement. */
function moveCtx(ps, m, extraLines) {
  const st = p => stylesOf(p, m);
  const line = { GAR: 0, DEF: 0, MIL: 0, ATT: 0 }, style = {}, nat = {}, club = {}, dec = {};
  ps.forEach(p => {
    line[p.pos]++; st(p).forEach(x => style[x] = (style[x] || 0) + 1);
    nat[p.nat] = (nat[p.nat] || 0) + 1; club[p.club] = (club[p.club] || 0) + 1; dec[p.dec] = (dec[p.dec] || 0) + 1;
  });
  if (extraLines) extraLines(line);
  const max = o => Math.max(0, ...Object.values(o));
  return { n: ps.length, ps, line, style, nat, club, dec, stars: ps.filter(p => p.star).length, maxNat: max(nat), maxClub: max(club), maxDec: max(dec), has: (p, x) => st(p).includes(x) };
}
function subsetsUpTo(a, k) {
  const out = [];
  const rec = (i, cur) => { if (cur.length) out.push(cur.slice()); if (cur.length === k) return; for (let j = i; j < a.length; j++) { cur.push(a[j]); rec(j + 1, cur); cur.pop(); } };
  rec(0, []);
  return out;
}
/** Le mouvement est-il jouable avec au moins un groupe de 1 à 5 joueurs de l'effectif ? */
function movePlayable(k, ids) {
  const ps = ids.map(id => PLAYERS[id]);
  return subsetsUpTo(ps, 5).some(s => MOVES[k].test(moveCtx(s, null)));
}
/** Effectif de départ tiré au sort ; un joueur de la collection peut remplacer une carte (une chance sur deux). */
function drawStarters(move, unlocked = []) {
  for (let tries = 0; tries < 60; tries++) {
    const out = [];
    Object.entries(STARTER).forEach(([pos, n]) => {
      out.push(...shuffle(Object.values(PLAYERS).filter(p => isStarterPick(p) && p.pos === pos).map(p => p.id)).slice(0, n));
    });
    const mine = shuffle(unlocked.filter(id => PLAYERS[id] && !out.includes(id)));
    if (mine.length && rng() < 0.5) {
      const p = PLAYERS[mine[0]], same = out.filter(id => PLAYERS[id].pos === p.pos);
      out[out.indexOf(pick(same))] = p.id;
    }
    if (!move || movePlayable(move, out)) return out;
  }
  return null;
}
function autoStarter() { return drawStarters(null); }

// ===== Mouvements (42) =====
// tier : base (départ), commun, rare, epique ; pos : la condition demande un poste précis
const MOVES = {
  frappe: { name: 'Frappe isolée', base: 10, prec: 1, tier: 'base', desc: '1 joueur seul', test: c => c.n === 1 },
  passe: { name: 'Passe courte', base: 15, prec: 1.2, tier: 'base', desc: '2 joueurs ou plus', test: c => c.n >= 2 },
  unedeux: { name: 'Une-deux', base: 25, prec: 1.5, tier: 'base', desc: '2 joueurs du même poste', test: c => c.n === 2 && c.ps[0].pos === c.ps[1].pos },
  cpa: { name: 'Coup de pied arrêté', base: 60, prec: 2, tier: 'commun', desc: '1 Spécialiste seul', ex: 'Joue un Spécialiste tout seul', test: c => c.n === 1 && c.has(c.ps[0], 'Spécialiste') },
  centre: { name: 'Centre-tête', base: 30, prec: 2, tier: 'commun', pos: true, desc: '2 joueurs, dont un ATT Physique', ex: 'Un attaquant Physique et un autre joueur', test: c => c.n === 2 && c.ps.some(p => p.pos === 'ATT' && c.has(p, 'Physique')) },
  triangle: { name: 'Triangle', base: 35, prec: 2.2, tier: 'commun', desc: '3 joueurs de 3 postes différents', ex: 'Trois joueurs de trois postes différents', test: c => c.n === 3 && new Set(c.ps.map(p => p.pos)).size === 3 },
  relance: { name: 'Relance propre', base: 30, prec: 2, tier: 'commun', pos: true, desc: '2 joueurs ou plus, que des GAR et DEF', ex: 'Ton gardien et un défenseur, par exemple', test: c => c.n >= 2 && !c.line.MIL && !c.line.ATT },
  recup: { name: 'Récupération haute', base: 40, prec: 2.2, tier: 'commun', desc: '2 joueurs Pressing ou plus', ex: 'Deux joueurs avec le style Pressing', test: c => (c.style.Pressing || 0) >= 2 },
  long: { name: 'Jeu long', base: 35, prec: 2, tier: 'commun', pos: true, desc: 'GAR ou DEF + ATT Physique, sans MIL', ex: 'Un défenseur et un attaquant Physique, sans milieu', test: c => (c.line.GAR || c.line.DEF) && !c.line.MIL && c.ps.some(p => p.pos === 'ATT' && c.has(p, 'Physique')) },
  contre: { name: 'Contre éclair', base: 45, prec: 2.5, tier: 'rare', pos: true, desc: 'DEF + 2 ATT, dont 2 Vitesse', test: c => c.line.DEF >= 1 && c.line.ATT >= 2 && (c.style.Vitesse || 0) >= 2 },
  solo: { name: 'Exploit individuel', base: 50, prec: 2.5, tier: 'rare', desc: '1 Star seule', test: c => c.n === 1 && c.ps[0].star },
  tiki: { name: 'Tiki-taka', base: 55, prec: 3, tier: 'rare', pos: true, desc: '3 MIL Technique ou plus', test: c => { const m = c.ps.filter(p => p.pos === 'MIL'); return m.length >= 3 && m.every(p => c.has(p, 'Technique')); } },
  montee: { name: 'Montée complète', base: 70, prec: 3.5, tier: 'epique', pos: true, desc: 'GAR, DEF, MIL et ATT', test: c => c.line.GAR && c.line.DEF && c.line.MIL && c.line.ATT },
  totale: { name: 'Attaque totale', base: 60, prec: 3.2, tier: 'epique', pos: true, desc: '5 joueurs dont 3 ATT', test: c => c.n === 5 && c.line.ATT >= 3 },
  // nouveaux communs
  tete: { name: 'Tête plongeante', base: 25, prec: 1.8, tier: 'commun', pos: true, desc: '1 ATT Physique seul', ex: 'Joue un attaquant Physique tout seul', test: c => c.n === 1 && c.ps[0].pos === 'ATT' && c.has(c.ps[0], 'Physique') },
  loin: { name: 'Frappe de loin', base: 20, prec: 2, tier: 'commun', pos: true, desc: '1 MIL seul', ex: 'Joue un milieu tout seul', test: c => c.n === 1 && c.ps[0].pos === 'MIL' },
  duo: { name: 'Duo d\'attaque', base: 30, prec: 1.8, tier: 'commun', pos: true, desc: 'Exactement 2 ATT', ex: 'Joue 2 attaquants ensemble', test: c => c.line.ATT === 2 },
  charniere: { name: 'Charnière centrale', base: 30, prec: 1.8, tier: 'commun', pos: true, desc: 'Exactement 2 DEF', ex: 'Joue 2 défenseurs ensemble', test: c => c.line.DEF === 2 },
  relais: { name: 'Relais au milieu', base: 25, prec: 1.8, tier: 'commun', pos: true, desc: 'Exactement 2 MIL', ex: 'Joue 2 milieux ensemble', test: c => c.line.MIL === 2 },
  degagement: { name: 'Dégagement au pied', base: 25, prec: 2, tier: 'commun', pos: true, desc: 'GAR + 1 ATT', ex: 'Joue ton gardien avec un attaquant', test: c => c.n === 2 && c.line.GAR === 1 && c.line.ATT === 1 },
  debord: { name: 'Débordement', base: 30, prec: 2, tier: 'commun', pos: true, desc: 'DEF + ATT, dont au moins un Vitesse', ex: 'Un défenseur et un attaquant, l\'un des deux Vitesse', test: c => c.line.DEF >= 1 && c.line.ATT >= 1 && (c.style.Vitesse || 0) >= 1 },
  compat: { name: 'Compatriotes', base: 25, prec: 2, tier: 'commun', desc: '2 joueurs de la même nation', ex: 'Joue 2 joueurs du même pays', test: c => c.maxNat >= 2 },
  coequip: { name: 'Coéquipiers', base: 25, prec: 2, tier: 'commun', desc: '2 joueurs du même club', ex: 'Joue 2 joueurs du même club', test: c => c.maxClub >= 2 },
  libero: { name: 'Gardien libero', base: 30, prec: 2, tier: 'commun', pos: true, desc: 'GAR + DEF + MIL, sans ATT', ex: 'Gardien, défenseur et milieu, sans attaquant', test: c => c.line.GAR && c.line.DEF && c.line.MIL && !c.line.ATT },
  // nouveaux rares
  panenka: { name: 'Panenka', base: 40, prec: 2.6, tier: 'rare', desc: '1 joueur Technique seul', test: c => c.n === 1 && c.has(c.ps[0], 'Technique') },
  chevauchee: { name: 'Chevauchée', base: 45, prec: 2.5, tier: 'rare', pos: true, desc: '1 DEF Vitesse seul', test: c => c.n === 1 && c.ps[0].pos === 'DEF' && c.has(c.ps[0], 'Vitesse') },
  indirect: { name: 'Coup franc indirect', base: 40, prec: 2.4, tier: 'rare', desc: '1 Spécialiste + 1 autre joueur', test: c => c.n === 2 && (c.style['Spécialiste'] || 0) >= 1 },
  quatuor: { name: 'Quatuor offensif', base: 50, prec: 2.6, tier: 'rare', pos: true, desc: '4 joueurs, seulement des MIL et des ATT', test: c => c.n === 4 && !c.line.GAR && !c.line.DEF },
  generation: { name: 'Génération dorée', base: 45, prec: 2.6, tier: 'rare', desc: '3 joueurs de la même décennie', test: c => c.maxDec >= 3 },
  selnat: { name: 'Sélection nationale', base: 50, prec: 2.8, tier: 'rare', desc: '3 joueurs de la même nation', test: c => c.maxNat >= 3 },
  blocclub: { name: 'Bloc club', base: 55, prec: 2.8, tier: 'rare', desc: '3 joueurs du même club', test: c => c.maxClub >= 3 },
  brassard: { name: 'Brassard', base: 45, prec: 2.5, tier: 'rare', desc: '2 Leader ou plus', test: c => (c.style.Leader || 0) >= 2 },
  duel: { name: 'Duel physique', base: 50, prec: 2.6, tier: 'rare', desc: '3 joueurs Physique ou plus', test: c => (c.style.Physique || 0) >= 3 },
  contrepress: { name: 'Contre-pressing', base: 45, prec: 2.8, tier: 'rare', pos: true, desc: '3 Pressing ou plus, dont un ATT', test: c => (c.style.Pressing || 0) >= 3 && c.ps.some(p => p.pos === 'ATT' && c.has(p, 'Pressing')) },
  // nouveaux épiques
  carre: { name: 'Carré magique', base: 70, prec: 3.5, tier: 'epique', pos: true, desc: '4 MIL', test: c => c.line.MIL >= 4 },
  vieille: { name: 'Vieille garde', base: 65, prec: 3.4, tier: 'epique', desc: '3 joueurs des années 70 ou avant', test: c => c.ps.filter(p => p.dec <= 1970).length >= 3 },
  vague: { name: 'Nouvelle vague', base: 65, prec: 3.4, tier: 'epique', desc: '3 joueurs des années 2020', test: c => c.ps.filter(p => p.dec >= 2020).length >= 3 },
  dream: { name: 'Dream team', base: 80, prec: 3.5, tier: 'epique', desc: '3 stars', test: c => c.stars >= 3 },
  melting: { name: 'Melting-pot', base: 70, prec: 3.6, tier: 'epique', desc: '5 joueurs de 5 nations différentes', test: c => c.n === 5 && Object.keys(c.nat).length === 5 },
  beton: { name: 'Béton armé', base: 60, prec: 3.4, tier: 'epique', pos: true, desc: 'GAR + 3 DEF', test: c => c.line.GAR >= 1 && c.line.DEF >= 3 },
  clubleg: { name: 'Club légendaire', base: 80, prec: 4, tier: 'epique', desc: '4 joueurs du même club', test: c => c.maxClub >= 4 },
  onzenat: { name: 'Onze de rêve national', base: 80, prec: 4, tier: 'epique', desc: '4 joueurs de la même nation', test: c => c.maxNat >= 4 },
};
const MOVE_SLOTS = 6;
const TIER_PRICE = { commun: 5, rare: 9, epique: 14 };
function movePrice(k, lv) { return TIER_PRICE[MOVES[k].tier] + 4 * lv; }

// ===== Entraîneurs célèbres (jokers) =====
// unlock : null = disponible dès le début ; 'boss:<règle>' = battre ce club ; 'feat:<exploit>'
const STAFF = {
  prepa: { tier: 'commun', name: 'Felix Magath', role: 'Préparateur physique', desc: 'Fatigue : 3 actions par match au lieu de 2', cost: 5 },
  kine: { tier: 'commun', name: 'Claudio Ranieri', role: 'Le Tinkerman', desc: '+1 changement par match', cost: 4 },
  comm: { tier: 'commun', name: 'Guy Roux', role: 'Le gestionnaire', desc: '+4 M€ à chaque victoire', cost: 5 },
  adjoint: { tier: 'commun', name: 'Diego Simeone', role: 'Le Cholo', desc: '+1 précision si un DEF est dans l\'action', cost: 5 },
  gk: { tier: 'commun', name: 'Fabio Capello', role: 'Don Fabio', desc: '+1,5 précision si un GAR est dans l\'action', cost: 5 },
  coachatt: { tier: 'commun', name: 'Zdeněk Zeman', role: 'Le 4-3-3 fou', desc: '+30 base par ATT dans l\'action', cost: 6 },
  video: { tier: 'commun', name: 'Marcelo Bielsa', role: 'El Loco', desc: 'Le mur adverse baisse de 10 %', cost: 6 },
  psy: { tier: 'commun', name: 'Bill Shankly', role: 'Le meneur d\'hommes', desc: 'Annule l\'Ego des stars ; +1 précision avec 2 stars ou plus', cost: 4 },
  scout: { tier: 'commun', name: 'Harry Redknapp', role: 'Le roi du mercato', desc: '+10 base par joueur recruté cette saison', cost: 5 },
  domenech: { tier: 'commun', name: 'Raymond Domenech', role: 'L\'astrologue', desc: 'À chaque match, un poste tiré au hasard gagne +1,5 précision', cost: 4 },
  houllier: { tier: 'commun', name: 'Gérard Houllier', role: 'Le professeur', desc: '+15 base par MIL dans l\'action', cost: 5 },
  rehhagel: { tier: 'commun', name: 'Otto Rehhagel', role: 'Rehhakles', desc: 'Première action de chaque match : mur -20 %', cost: 5, unlock: 'boss:grece04' },
  hodgson: { tier: 'commun', name: 'Roy Hodgson', role: 'Le vieux sage', desc: '+40 base si l\'action compte exactement 2 joueurs', cost: 4 },
  aragones: { tier: 'commun', name: 'Luis Aragonés', role: 'Le sage d\'Hortaleza', desc: '+1 précision si 2 MIL Technique sont dans l\'action', cost: 5, unlock: 'boss:espagne08' },
  bora: { tier: 'commun', name: 'Bora Milutinović', role: 'Le globe-trotter', desc: 'Les sélectionneurs et fédérations coûtent 3 M€ de moins', cost: 4 },
  eriksson: { tier: 'commun', name: 'Sven-Göran Eriksson', role: 'Le diplomate', desc: 'Booster Consignes : tu gardes 2 cartes au lieu d\'une', cost: 4 },
  deschamps: { tier: 'commun', name: 'Didier Deschamps', role: 'Le pragmatique', desc: '+25 base par DEF ou MIL dans l\'action', cost: 5 },
  herrera: { tier: 'commun', name: 'Helenio Herrera', role: 'Le Mage', desc: '+1 précision si l\'action compte 2 DEF ou plus', cost: 5, unlock: 'boss:inter65' },
  mental: { tier: 'rare', name: 'Carlo Ancelotti', role: 'Le calme', desc: '+1 possession par match', cost: 8, unlock: 'feat:campagne' },
  cf: { tier: 'rare', name: 'Ronald Koeman', role: 'Le canonnier', desc: 'Précision x1,5 si un Spécialiste est dans l\'action', cost: 8, unlock: 'feat:cpa' },
  jeunes: { tier: 'rare', name: 'Louis van Gaal', role: 'Le formateur', desc: 'Les joueurs du tirage de départ ont force x2', cost: 7, unlock: 'boss:ajax95' },
  kop: { tier: 'rare', name: 'Jürgen Klopp', role: 'Heavy metal', desc: '+0,3 précision par victoire de la saison', cost: 8, unlock: 'boss:klopp' },
  stat: { tier: 'rare', name: 'Thomas Tuchel', role: 'Le data-coach', desc: '+10 base par but marqué cette saison', cost: 8, unlock: 'feat:buts' },
  tacticien: { tier: 'rare', name: 'Arrigo Sacchi', role: 'Le révolutionnaire', desc: '+0,6 précision par poste différent dans l\'action', cost: 9, unlock: 'boss:sacchi' },
  hitzfeld: { tier: 'rare', name: 'Ottmar Hitzfeld', role: 'Le général', desc: 'Booster Entraînement : le mouvement monte de 2 niveaux', cost: 8, unlock: 'boss:bayern01' },
  lippi: { tier: 'rare', name: 'Marcello Lippi', role: 'Le cigare', desc: 'Aux 2 dernières possessions, les joueurs fatigués reviennent', cost: 8, unlock: 'boss:juve96' },
  benitez: { tier: 'rare', name: 'Rafael Benítez', role: 'Istanbul', desc: 'Si tu n\'as pas marqué à la mi-match : +2 possessions', cost: 8, unlock: 'boss:liverpool05' },
  heynckes: { tier: 'rare', name: 'Jupp Heynckes', role: 'Osram', desc: '+0,4 précision par entraîneur dans ton staff', cost: 9, unlock: 'boss:bayern13' },
  conte: { tier: 'rare', name: 'Antonio Conte', role: 'L\'intensité', desc: '+0,7 précision par joueur Pressing dans l\'action', cost: 8, unlock: 'boss:chelsea17' },
  luisenrique: { tier: 'rare', name: 'Luis Enrique', role: 'Le MSN', desc: '+60 base si l\'action compte un ATT Vitesse et un MIL Technique', cost: 9, unlock: 'boss:barca15' },
  emery: { tier: 'rare', name: 'Unai Emery', role: 'Roi de la coupe', desc: 'Murs des matchs de coupe (match 4 et après) -15 %', cost: 8, unlock: 'boss:seville16' },
  selection: { tier: 'epique', name: 'Aimé Jacquet', role: 'Champion 98', desc: 'Précision x1,5 si 2 joueurs de même nation', cost: 12, unlock: 'boss:france98' },
  mecene: { tier: 'epique', name: 'José Mourinho', role: 'The Special One', desc: 'Précision x(1 + budget / 40), jusqu\'à x2', cost: 13, unlock: 'boss:mourinho' },
  ultras: { tier: 'epique', name: 'Alex Ferguson', role: 'Fergie time', desc: 'Dernière possession : précision x2,5', cost: 11, unlock: 'boss:ferguson' },
  ds: { tier: 'epique', name: 'Vicente del Bosque', role: 'Le marquis', desc: 'Précision x1,3 par star dans l\'action', cost: 13, unlock: 'boss:ancelotti' },
  michels: { tier: 'epique', name: 'Rinus Michels', role: 'Football total', desc: 'Les DEF comptent aussi comme MIL et les MIL comme ATT pour les mouvements', cost: 13, unlock: 'boss:ajax71' },
  trapattoni: { tier: 'epique', name: 'Giovanni Trapattoni', role: 'Il Trap', desc: 'Précision x1,5 si l\'action compte 2 DEF ou plus', cost: 12, unlock: 'boss:juve85' },
  paisley: { tier: 'epique', name: 'Bob Paisley', role: 'Le grand-père', desc: 'Tous tes mouvements gagnent +1 niveau', cost: 13, unlock: 'boss:liverpool81' },
  happel: { tier: 'epique', name: 'Ernst Happel', role: 'Le taciturne', desc: 'Première action de chaque match : précision x2', cost: 11, unlock: 'boss:hambourg83' },
  mister: { tier: 'legende', name: 'Pep Guardiola', role: 'Le philosophe', desc: 'Précision x2', cost: 18, unlock: 'boss:guardiola' },
  monde: { tier: 'legende', name: 'Arsène Wenger', role: 'Le professeur', desc: '+1 précision par nationalité différente dans l\'action', cost: 16, unlock: 'boss:arsenal04' },
  lobanovski: { tier: 'legende', name: 'Valeri Lobanovski', role: 'Le scientifique', desc: 'Précision x1,2 par mouvement différent déjà joué dans le match (jusqu\'à x2,4)', cost: 17, unlock: 'boss:kiev86' },
  poucet: { tier: 'epique', name: 'Petit poucet', role: 'Sélectionneur outsider', desc: 'Précision x2 si aucun joueur de l\'action ne vient des 5 grandes nations', cost: 12, group: 'special' },
  mondial: { tier: 'legende', name: 'Coupe du monde', role: 'Sélectionneur mondial', desc: 'Précision x1,5 par nation différente au-delà de 2 dans l\'action', cost: 17, group: 'special' },
};
// Sélectionneurs et fédérations : un par nation, plus rare et plus fort pour les petites nations.
const SEL_TIER = { t20: ['commun', 2, 5], t15: ['rare', 3, 8], t10: ['epique', 4, 12] };
Object.entries(NATION_TIER).forEach(([nat, t]) => {
  if (t === 'top') return;
  const [tier, mult, cost] = SEL_TIER[t], s = slug(nat);
  STAFF['sel-' + s] = { tier, name: 'Sélectionneur ' + nat, role: 'Sélectionneur', desc: `Les joueurs de nationalité ${nat} ont force x${mult}`, cost, group: 'sel', nat, mult };
  STAFF['fed-' + s] = { tier: 'rare', name: 'Fédération ' + nat, role: 'Fédération', desc: `+1 précision par joueur de nationalité ${nat} dans l'action`, cost: 8, group: 'fed', nat };
});
Object.entries(CONTINENTS).forEach(([k, c]) => {
  STAFF['cont-' + k] = { tier: 'rare', name: 'Sélectionneur ' + c.name, role: 'Sélectionneur continental', desc: `+25 base par joueur venu de la zone ${c.name} dans l'action`, cost: 8, group: 'cont', nats: c.nats };
});
Object.values(STAFF).forEach(s => { if (s.unlock === undefined) s.unlock = null; });
const STAFF_SLOTS = 5;
/** Comment débloquer un entraîneur, en clair. */
function unlockText(k) {
  const u = STAFF[k].unlock;
  if (!u) return 'Disponible dès le début';
  if (u.startsWith('boss:')) return 'Battre ' + RULES[u.slice(5)].club;
  return { 'feat:campagne': 'Gagner une campagne', 'feat:cpa': 'Marquer 10 buts sur coup de pied arrêté', 'feat:buts': 'Marquer 30 buts en une saison' }[u];
}
function staffCost(G, k) { const s = STAFF[k]; return s.cost - (hasStaff(G, 'bora') && (s.group === 'sel' || s.group === 'fed') ? 3 : 0); }

// ===== Consignes à usage unique (30) =====
const ITEMS = {
  pressing: { name: 'Pressing haut', desc: 'Mur -20 % pour la prochaine action', cost: 3 },
  blocbas: { name: 'Bloc bas', desc: 'L\'adversaire marque 1 but de moins, tu perds 2 possessions', cost: 4 },
  coaching: { name: 'Coaching gagnant', desc: '+1 possession', cost: 4 },
  tactique: { name: 'Changement tactique', desc: '+1 changement', cost: 2 },
  remontada: { name: 'Remontada', desc: 'Précision x2 pour la prochaine action', cost: 5 },
  recup: { name: 'Récupération', desc: 'Tous les joueurs fatigués reviennent', cost: 3 },
  ballonlong: { name: 'Ballon long', desc: '+50 base pour la prochaine action', cost: 2 },
  profondeur: { name: 'Appel en profondeur', desc: 'Les ATT de la prochaine action ont force x2', cost: 3 },
  defhaute: { name: 'Défense haute', desc: 'Les DEF de la prochaine action ont force x2', cost: 3 },
  losange: { name: 'Milieu en losange', desc: 'Les MIL de la prochaine action ont force x2', cost: 3 },
  volant: { name: 'Gardien volant', desc: 'Le GAR de la prochaine action a force x3', cost: 3 },
  capitaine: { name: 'Capitaine courage', desc: 'Le joueur le plus fort de la prochaine action a force x3', cost: 3 },
  chapeau: { name: 'Coup du chapeau', desc: 'Si la prochaine action marque, elle compte 1 but de plus', cost: 4 },
  causerie: { name: 'Causerie', desc: '+1 précision pour toutes les actions du match', cost: 3 },
  vestiaire: { name: 'Vestiaire soudé', desc: '+0,5 précision par joueur de la prochaine action', cost: 4 },
  pluie: { name: 'Pluie battante', desc: 'Mur -30 % pour la prochaine action, mais -1 précision', cost: 3 },
  additionnel: { name: 'Temps additionnel', desc: '+2 possessions', cost: 5 },
  horsjeu: { name: 'Hors-jeu bien joué', desc: 'L\'adversaire annonce 1 but de moins', cost: 5 },
  faute: { name: 'Faute tactique', desc: 'L\'adversaire annonce 1 but de moins, mais mur +15 % jusqu\'à la fin du match', cost: 2 },
  express: { name: 'Recrutement express', desc: 'Pioche 2 cartes de plus', cost: 2 },
  rotation: { name: 'Rotation', desc: 'Remets ta main dans le paquet et pioche une nouvelle main', cost: 2 },
  derby: { name: 'Jour de derby', desc: 'Synergies de club doublées pour la prochaine action', cost: 3 },
  hymne: { name: 'Hymne national', desc: 'Synergies de nationalité doublées pour la prochaine action', cost: 3 },
  prime: { name: 'Prime de match', desc: 'Si tu gagnes ce match, +6 M€', cost: 1 },
  videoadv: { name: 'Vidéo de l\'adversaire', desc: 'Le mur s\'use deux fois plus jusqu\'à la fin du match', cost: 4 },
  tab: { name: 'Tir au but', desc: 'Si la prochaine action n\'a qu\'un joueur, précision x3', cost: 4 },
  presstout: { name: 'Pressing tout terrain', desc: 'Mur -10 % jusqu\'à la fin du match', cost: 4 },
  double: { name: 'Doublé', desc: 'Précision x1,5 pour les 2 prochaines actions', cost: 6 },
  sangfroid: { name: 'Sang-froid', desc: 'La prochaine action ne fatigue aucun joueur', cost: 3 },
  douzieme: { name: 'Le 12e homme', desc: 'Dernière possession du match : précision x3', cost: 5 },
};

// ===== Règles de match et clubs légendaires à battre =====
const RULES = {
  catenaccio: { name: 'Catenaccio', desc: 'Les attaquants ne comptent que la moitié de leur force' },
  gelee: { name: 'Pelouse gelée', desc: 'Le style Technique ne compte pas' },
  arbitre: { name: 'Arbitre tatillon', desc: 'Une action à 5 joueurs : le mieux noté est exclu du match' },
  derby: { name: 'Derby bouillant', desc: 'Synergies de club doublées, mais mur +20 %' },
  grace: { name: 'Gardien en état de grâce', desc: 'Ton premier but est annulé' },
  // clubs légendaires (boss des campagnes) : les battre débloque leur entraîneur
  ferguson: { club: 'Manchester United 1999', kit: 'Manchester United', unlock: 'ultras', name: 'Fergie time', desc: 'L\'adversaire annonce 1 but de plus' },
  ancelotti: { club: 'Real Madrid 2002', kit: 'Real Madrid', unlock: 'ds', name: 'Galactiques', desc: 'Synergies de club et de nationalité ignorées' },
  sacchi: { club: 'AC Milan 1989', kit: 'AC Milan', unlock: 'tacticien', name: 'Pressing tout terrain', desc: 'Le mur ne s\'use qu\'à moitié' },
  klopp: { club: 'Liverpool 2019', kit: 'Liverpool', unlock: 'kop', name: 'Gegenpressing', desc: 'Fatigue : 1 action de moins par joueur' },
  guardiola: { club: 'FC Barcelone 2011', kit: 'FC Barcelone', unlock: 'mister', name: 'Confiscation du ballon', desc: 'Tu as 2 possessions de moins' },
  mourinho: { club: 'Inter 2010', kit: 'Inter Milan', unlock: 'mecene', name: 'Bus garé', desc: 'Mur +50 %, mais il n\'annonce que 2 buts' },
  simeone: { club: 'Atlético Madrid 2014', kit: 'Atlético Madrid', unlock: 'adjoint', name: 'Cholismo', desc: 'Les attaquants ne comptent que la moitié de leur force' },
  inter65: { club: 'Inter 1965', kit: 'Inter Milan', unlock: 'herrera', name: 'Verrou', desc: 'Ta première action ne peut pas marquer' },
  ajax71: { club: 'Ajax 1971', kit: 'Ajax', unlock: 'michels', name: 'Football total', desc: 'Les mouvements qui demandent un poste précis ont -1 précision' },
  liverpool81: { club: 'Liverpool 1981', kit: 'Liverpool', unlock: 'paisley', name: 'Anfield', desc: 'Le mur ne s\'use pas tant que tu n\'as pas marqué' },
  hambourg83: { club: 'Hambourg 1983', kit: 'Hambourg', unlock: 'happel', name: 'Pressing autrichien', desc: 'Le style Vitesse ne compte pas' },
  juve85: { club: 'Juventus 1985', kit: 'Juventus', unlock: 'trapattoni', name: 'Le Trap', desc: 'Les actions sans DEF ont -1 précision' },
  kiev86: { club: 'Dynamo Kiev 1986', kit: 'Dynamo Kiev', unlock: 'lobanovski', name: 'Football scientifique', desc: 'Tu ne peux pas jouer deux fois le même mouvement dans le match' },
  ajax95: { club: 'Ajax 1995', kit: 'Ajax', unlock: 'jeunes', name: 'Les gamins', desc: 'Les stars ont force divisée par deux' },
  juve96: { club: 'Juventus 1996', kit: 'Juventus', unlock: 'lippi', name: 'Rigueur', desc: 'Aucun changement autorisé' },
  bayern01: { club: 'Bayern 2001', kit: 'Bayern Munich', unlock: 'hitzfeld', name: 'Kahn dans les cages', desc: 'Un tir qui dépasse le mur de moins de 20 % est arrêté' },
  liverpool05: { club: 'Liverpool 2005', kit: 'Liverpool', unlock: 'benitez', name: 'Istanbul', desc: 'Tu dois mener de 2 buts pour gagner' },
  bayern13: { club: 'Bayern 2013', kit: 'Bayern Munich', unlock: 'heynckes', name: 'Triplette', desc: 'Le mur remonte de 10 % après chacun de tes buts' },
  barca15: { club: 'FC Barcelone 2015', kit: 'FC Barcelone', unlock: 'luisenrique', name: 'MSN', desc: 'L\'adversaire annonce 3 buts, mais le mur baisse de 20 %' },
  seville16: { club: 'Séville 2016', kit: 'Séville', unlock: 'emery', name: 'Roi de la coupe', desc: 'Les consignes sont interdites pendant ce match' },
  chelsea17: { club: 'Chelsea 2017', kit: 'Chelsea', unlock: 'conte', name: 'Défense à trois', desc: 'Les actions de moins de 3 joueurs ont -1 précision' },
  arsenal04: { club: 'Arsenal 2004', kit: 'Arsenal', unlock: 'monde', name: 'Invincibles', desc: 'Le mur ne s\'use pas du tout' },
  grece04: { club: 'Grèce 2004', nation: 'Grèce', unlock: 'rehhagel', name: 'Miracle', desc: 'Mur divisé par deux, mais tu n\'as que 3 possessions' },
  espagne08: { club: 'Espagne 2008', nation: 'Espagne', unlock: 'aragones', name: 'Tiki-taka', desc: 'Les actions de 1 ou 2 joueurs ne marquent pas' },
  france98: { club: 'France 1998', nation: 'France', unlock: 'selection', name: 'Stade de France', desc: 'Tes joueurs français ne peuvent pas jouer ce match' },
};
const BASE_RULES = ['catenaccio', 'gelee', 'arbitre', 'derby', 'grace'];

const OPP_CLUBS = Object.keys(CLUBS).filter(c => c !== 'Olympique');

const SEASON = [
  { comp: 'Championnat', label: 'Journée 1', wall: 250, opp: 1, prime: 6 },
  { comp: 'Championnat', label: 'Journée 2', wall: 400, opp: 1, prime: 7 },
  { comp: 'Championnat', label: 'Grande affiche', wall: 550, opp: 2, prime: 10, boss: true },
  { comp: 'Coupe nationale', label: 'Huitième', wall: 900, opp: 2, prime: 10 },
  { comp: 'Coupe nationale', label: 'Demi-finale', wall: 1300, opp: 2, prime: 12 },
  { comp: 'Coupe nationale', label: 'Finale', wall: 1700, opp: 2, prime: 15, boss: true },
  { comp: 'Coupe d\'Europe', label: 'Quart de finale', wall: 2800, opp: 2, prime: 16 },
  { comp: 'Coupe d\'Europe', label: 'Demi-finale', wall: 3200, opp: 3, prime: 18 },
  { comp: 'Coupe d\'Europe', label: 'Finale', wall: 3500, opp: 3, prime: 25, boss: true },
];

// Campagnes : comme les paquets de Balatro, de plus en plus dures, avec des clubs légendaires en boss.
// La finale garde le mur de base : la règle du boss final suffit à la corser.
function stagesFrom(mult, bosses, comps) {
  return SEASON.map((st, i) => {
    const b = i === 2 ? 0 : i === 5 ? 1 : i === 8 ? 2 : -1;
    return { ...st, comp: comps ? comps[Math.floor(i / 3)] : st.comp, wall: Math.round(st.wall * (i === 8 ? 1 : mult) / 50) * 50, coach: b >= 0 && bosses ? bosses[b] : null };
  });
}
const CAMPAIGNS = [
  { id: 'saison', name: 'Saison classique', desc: 'Championnat, coupe nationale puis coupe d\'Europe. Règles surprises aux matchs spéciaux.', budget: 12, req: null, stages: stagesFrom(1, null) },
  { id: 'c1', name: 'Coupe des clubs champions', desc: 'Manchester United 1999, le Real des Galactiques puis le Milan de 1989. Murs +20 %.', budget: 10, req: 'saison',
    stages: stagesFrom(1.2, ['ferguson', 'ancelotti', 'sacchi'], ['Phase de groupes', 'Huitièmes et quarts', 'Dernier carré']) },
  { id: 'ldc', name: 'Ligue des champions mythique', desc: 'Liverpool 2019, le Barça 2011 puis l\'Inter 2010 en finale. Murs +30 %.', budget: 8, req: 'c1',
    stages: stagesFrom(1.3, ['klopp', 'guardiola', 'mourinho'], ['Phase de ligue', 'Huitièmes et quarts', 'Dernier carré']) },
  { id: 'pionniers', name: 'Les pionniers', desc: 'Années 60 à 80 : la Grande Inter, l\'Ajax du football total et le Liverpool de Paisley.', budget: 8, req: 'ldc',
    stages: stagesFrom(1.35, ['inter65', 'ajax71', 'liverpool81'], ['Coupe des champions 1965', 'Coupe des champions 1971', 'Coupe des champions 1981']) },
  { id: 'rideau', name: 'Le rideau de fer et la Serie A', desc: 'Années 80 : Hambourg, la Juve du Trap et le Dynamo Kiev de Lobanovski.', budget: 8, req: 'pionniers',
    stages: stagesFrom(1.4, ['hambourg83', 'juve85', 'kiev86'], ['Coupe des champions 1983', 'Coupe des champions 1985', 'Coupe des coupes 1986']) },
  { id: 'siecle', name: 'Le tournant du siècle', desc: 'Les gamins de l\'Ajax, la Juve de Lippi et le Bayern de Kahn.', budget: 8, req: 'rideau',
    stages: stagesFrom(1.45, ['ajax95', 'juve96', 'bayern01'], ['Ligue des champions 1995', 'Ligue des champions 1996', 'Ligue des champions 2001']) },
  { id: 'moderne', name: 'L\'Europe moderne', desc: 'Istanbul 2005, la triplette du Bayern et le Barça de la MSN.', budget: 8, req: 'siecle',
    stages: stagesFrom(1.5, ['liverpool05', 'bayern13', 'barca15'], ['Ligue des champions 2005', 'Ligue des champions 2013', 'Ligue des champions 2015']) },
  { id: 'outsiders', name: 'Les outsiders', desc: 'Séville, le Chelsea de Conte et les Invincibles d\'Arsenal.', budget: 8, req: 'moderne',
    stages: stagesFrom(1.55, ['seville16', 'chelsea17', 'arsenal04'], ['Ligue Europa', 'Premier League', 'Saison invaincue']) },
  { id: 'selections', name: 'Sélections légendaires', desc: 'La Grèce 2004, l\'Espagne 2008 et la France 1998, sans tes Français.', budget: 8, req: 'outsiders',
    stages: stagesFrom(1.6, ['grece04', 'espagne08', 'france98'], ['Euro 2004', 'Euro 2008', 'Coupe du monde 1998']) },
];
function campaignOf(G) { return CAMPAIGNS.find(c => c.id === (G.campaign || 'saison')) || CAMPAIGNS[0]; }
function stageOf(G, i = G.stage) { return campaignOf(G).stages[i]; }
function seasonLength(G) { return campaignOf(G).stages.length; }

// ===== Aléatoire =====
let rng = Math.random;
function setRng(f) { rng = f; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(a) { return a[Math.floor(rng() * a.length)]; }

// ===== Partie =====
/**
 * Nouvelle partie. opts.coaches : entraîneurs débloqués (tous si absent) ; opts.unlocked : collection de joueurs.
 */
function newGame(campaign = 'saison', opts = {}) {
  const G = {
    campaign, signed: 0, budget: (CAMPAIGNS.find(c => c.id === campaign) || CAMPAIGNS[0]).budget, squad: autoStarter(),
    goals: {}, staff: [], items: [], levels: {}, moves: ['frappe', 'passe', 'unedeux'], stage: 0, rerolls: 0, offer: null, history: [],
    coaches: opts.coaches || null, starters: [], cpaGoals: 0,
  };
  G.starters = G.squad.slice();
  Object.keys(MOVES).forEach(k => G.levels[k] = 0);
  return G;
}
function hasStaff(G, k) { return G.staff.includes(k); }
/** Entraîneurs que ce joueur peut croiser au mercato. */
function coachAvailable(G, k) { return !STAFF[k].unlock || !G.coaches || G.coaches.includes(k); }
const isCup = G => G.stage >= 3;

function newMatch(G) {
  const s = stageOf(G);
  const natCount = {};
  G.squad.forEach(id => { const n = PLAYERS[id].nat; natCount[n] = (natCount[n] || 0) + 1; });
  const ossature = Object.entries(natCount).find(([, c]) => c >= 5);
  const rule = s.coach || (s.boss ? pick(BASE_RULES) : null);
  let poss = 6 + (hasStaff(G, 'mental') ? 1 : 0) + (ossature ? 1 : 0) - (rule === 'guardiola' ? 2 : 0);
  if (rule === 'grece04') poss = 3;
  const oppGoals = rule === 'mourinho' ? 2 : rule === 'barca15' ? 3 : s.opp + (rule === 'ferguson' ? 1 : 0);
  const R = rule ? RULES[rule] : null;
  const opp = R && R.club ? R.club : pick(OPP_CLUBS);
  const kit = R && R.nation ? NATIONS[R.nation].c[0] : (CLUBS[R && R.kit ? R.kit : opp] || ['#c8102e'])[0];
  let deck = shuffle(G.squad.slice());
  const out = [];
  if (rule === 'france98') { deck.filter(id => PLAYERS[id].nat === 'France').forEach(id => out.push(id)); deck = deck.filter(id => PLAYERS[id].nat !== 'France'); }
  const m = {
    stage: G.stage, prime: s.prime, opp, kit, wall: s.wall, wear: 0, oppGoals, goals: 0,
    poss, possStart: poss, changes: rule === 'juve96' ? 0 : 2 + (hasStaff(G, 'kine') ? 1 : 0),
    deck, hand: [], discard: [], out, fatigue: {}, banned: out.slice(),
    rule, pressing: 0, nextWall: 1, nextPrec: 1,
    // consignes en cours
    nx: {}, precAll: 0, wallAll: 1, wearMult: 1, doubleLeft: 0, lastPoss: 1, primeBonus: 0,
    astro: pick(['GAR', 'DEF', 'MIL', 'ATT']), movesPlayed: [], benitezUsed: false, lippiUsed: false,
    techUsed: false, graceUsed: false, played: 0, over: null, ossature: ossature ? ossature[0] : null, log: [],
  };
  out.forEach(id => m.fatigue[id] = 99);
  draw(m);
  return m;
}

function fatigueLimit(G, m) { return (hasStaff(G, 'prepa') ? 3 : 2) - (m && m.rule === 'klopp' ? 1 : 0); }

function draw(m, extra = 0) {
  const limit = 8 + extra;
  while (m.hand.length < limit) {
    if (!m.deck.length) { if (!m.discard.length) break; m.deck = shuffle(m.discard); m.discard = []; }
    m.hand.push(m.deck.pop());
  }
  sortHand(m);
}
function sortHand(m) { m.hand.sort((a, b) => LINES[PLAYERS[a].pos] - LINES[PLAYERS[b].pos] || PLAYERS[b].f - PLAYERS[a].f); }

function stylesOf(p, m) {
  if (!m) return p.styles;
  if (m.rule === 'gelee') return p.styles.filter(s => s !== 'Technique');
  if (m.rule === 'hambourg83') return p.styles.filter(s => s !== 'Vitesse');
  return p.styles;
}

/** Force d'une carte dans une action (règles des boss, bonus de génération). */
function shortName(p) { const parts = p.name.split(' '); return parts.length === 1 ? p.name : parts.slice(1).join(' '); }
function dec1(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }
function cardForce(p, m, decCount) {
  let f = p.f;
  if (m && (m.rule === 'catenaccio' || m.rule === 'simeone') && p.pos === 'ATT') f = Math.floor(f / 2);
  if (m && m.rule === 'ajax95' && p.star) f = Math.floor(f / 2);
  if (decCount[p.dec] >= 2) f = Math.round(f * 1.3);
  return f;
}

function evaluate(ids, m, G) {
  if (!ids.length) return null;
  const ps = ids.map(id => PLAYERS[id]).sort((a, b) => LINES[a.pos] - LINES[b.pos]);
  const syn = [];
  const n = ps.length, nx = m.nx || {};
  const decCount = {};
  ps.forEach(p => decCount[p.dec] = (decCount[p.dec] || 0) + 1);
  // effets des pouvoirs de stars
  const line0 = { GAR: 0, DEF: 0, MIL: 0, ATT: 0 };
  ps.forEach(p => line0[p.pos]++);
  const style0 = {};
  ps.forEach(p => stylesOf(p, m).forEach(x => style0[x] = (style0[x] || 0) + 1));
  const fx = { base: 0, prec: 0, mult: 1, wall: 1, force: {}, addF: {}, lines: [], fresh: new Set(), tired: new Set(), red: [], changes: 0, money: 0, moveMult: {}, wear: 1 };
  const powers = [];
  ps.forEach(p => { if (POWER_FX[p.id]) { POWER_FX[p.id]({ p, ps, n: ps.length, line: line0, style: style0, m, G, fx }); powers.push(p.id); } });
  // consignes qui touchent la force
  if (nx.line) ps.forEach(p => { if (nx.line[p.pos]) fx.force[p.id] = (fx.force[p.id] || 1) * nx.line[p.pos]; });
  // sélectionneurs : force multipliée pour leur nation
  G.staff.forEach(k => { const s = STAFF[k]; if (s && s.group === 'sel') ps.forEach(p => { if (p.nat === s.nat) fx.force[p.id] = (fx.force[p.id] || 1) * s.mult; }); });
  const forces = {};
  let sum = 0;
  ps.forEach(p => {
    let f = cardForce(p, m, decCount);
    if (hasStaff(G, 'jeunes') && (G.starters || []).includes(p.id)) f *= 2;
    f = Math.round(f * (fx.force[p.id] || 1)) + (fx.addF[p.id] || 0);
    forces[p.id] = f;
  });
  if (nx.captain) { const top = ps.slice().sort((a, b) => forces[b.id] - forces[a.id])[0]; forces[top.id] *= nx.captain; syn.push(`Capitaine courage : ${shortName(top)} x${nx.captain}`); }
  ps.forEach(p => sum += forces[p.id]);
  const gen = Object.entries(decCount).filter(([, c]) => c >= 2);
  gen.forEach(([d, c]) => syn.push(`Génération ${d}s : force +30 % x${c}`));

  // mouvements possibles (avec les postes en plus : pouvoirs, Rinus Michels)
  const michels = hasStaff(G, 'michels');
  const ctx = moveCtx(ps, m, line => {
    fx.lines.forEach(l => { if (!line[l]) line[l] = 1; });
    if (michels) { line.MIL += line0.DEF; line.ATT += line0.MIL; }
  });
  const line = ctx.line, styleCount = ctx.style;
  let cands = G.moves.filter(k => MOVES[k].test(ctx));
  if (m.rule === 'kiev86') cands = cands.filter(k => !m.movesPlayed.includes(k));
  // synergies communes
  let addBase = 0, addPrec = 0, multPrec = 1, wallMult = 1;
  const fatigueFree = new Set();
  const clubCount = ctx.club;
  const derby = (m.rule === 'derby' ? 2 : 1) * (nx.club || 1);
  const noSyn = m.rule === 'ancelotti';
  Object.entries(clubCount).forEach(([c, k]) => {
    if (c === 'Olympique' || noSyn) return;
    if (k === 2) { addPrec += 0.5 * derby; syn.push(`Automatismes ${c} : +${dec1(0.5 * derby)} préc.`); }
    if (k >= 3) { addPrec += 1.5 * derby; ps.filter(p => p.club === c).forEach(p => fatigueFree.add(p.id)); syn.push(`Bloc ${c} : +${dec1(1.5 * derby)} préc., sans fatigue`); }
  });
  const natCount = ctx.nat;
  Object.entries(natCount).forEach(([nat, k]) => {
    if (k >= 2 && !noSyn) { const v = 15 * k * (nx.nat || 1); addBase += v; syn.push(`Sélection ${nat} : +${v} base`); }
  });
  let techBonus = false, pressingAdd = false;
  if ((styleCount.Vitesse || 0) >= 3) { const v = m.played === 0 ? 2 : 1; addPrec += v; syn.push(`Trio Vitesse : +${v} préc.`); }
  if ((styleCount.Physique || 0) >= 3) { wallMult *= 0.85; syn.push('Trio Physique : mur -15 %'); }
  if ((styleCount.Pressing || 0) >= 3) { pressingAdd = true; syn.push('Trio Pressing : mur -10 % jusqu\'à la fin'); }
  if ((styleCount.Technique || 0) >= 3 && !m.techUsed) { techBonus = true; syn.push('Trio Technique : +1 changement'); }
  const stars = ps.filter(p => p.star).length;
  const leader = ps.some(p => stylesOf(p, m).includes('Leader'));
  if (stars >= 3) {
    if (leader || hasStaff(G, 'psy')) syn.push('Ego calmé');
    else { multPrec *= 0.7; syn.push('Ego : 3 stars sans Leader, préc. x0,7'); }
  }
  powers.forEach(id => syn.push(`★ ${PLAYERS[id].power.name} (${shortName(PLAYERS[id])})`));
  addBase += fx.base; addPrec += fx.prec; multPrec *= fx.mult; wallMult *= fx.wall;
  fx.fresh.forEach(id => fatigueFree.add(id));
  // entraîneurs
  const S1 = (k, cond, f, label) => { if (hasStaff(G, k) && cond) { f(); syn.push(`${STAFF[k].name} : ${label}`); } };
  const wins = G.history.filter(h => h.won).length, seasonGoals = Object.values(G.goals).reduce((a, b) => a + b, 0);
  S1('adjoint', line0.DEF, () => { addPrec += 1; }, '+1 préc.');
  S1('coachatt', line0.ATT, () => { addBase += 30 * line0.ATT; }, `+${30 * line0.ATT} base`);
  S1('gk', line0.GAR, () => { addPrec += 1.5; }, '+1,5 préc.');
  S1('psy', stars >= 2, () => { addPrec += 1; }, '+1 préc.');
  S1('scout', G.signed, () => { addBase += 10 * G.signed; }, `+${10 * G.signed} base`);
  S1('domenech', line0[m.astro], () => { addPrec += 1.5; }, `${m.astro} dans les astres, +1,5 préc.`);
  S1('houllier', line0.MIL, () => { addBase += 15 * line0.MIL; }, `+${15 * line0.MIL} base`);
  S1('rehhagel', m.played === 0, () => { wallMult *= 0.8; }, 'mur -20 %');
  S1('hodgson', n === 2, () => { addBase += 40; }, '+40 base');
  S1('aragones', ps.filter(p => p.pos === 'MIL' && stylesOf(p, m).includes('Technique')).length >= 2, () => { addPrec += 1; }, '+1 préc.');
  S1('deschamps', line0.DEF + line0.MIL, () => { addBase += 25 * (line0.DEF + line0.MIL); }, `+${25 * (line0.DEF + line0.MIL)} base`);
  S1('herrera', line0.DEF >= 2, () => { addPrec += 1; }, '+1 préc.');
  S1('cf', style0['Spécialiste'], () => { multPrec *= 1.5; }, 'préc. x1,5');
  S1('kop', wins, () => { addPrec += 0.3 * wins; }, `+${dec1(0.3 * wins)} préc.`);
  S1('stat', seasonGoals, () => { addBase += 10 * seasonGoals; }, `+${10 * seasonGoals} base`);
  const nLines = Object.values(line0).filter(Boolean).length, nNat = Object.keys(natCount).length;
  S1('tacticien', true, () => { addPrec += 0.6 * nLines; }, `+${dec1(0.6 * nLines)} préc.`);
  S1('heynckes', true, () => { addPrec += 0.4 * G.staff.length; }, `+${dec1(0.4 * G.staff.length)} préc.`);
  S1('conte', style0.Pressing, () => { addPrec += 0.7 * style0.Pressing; }, `+${dec1(0.7 * style0.Pressing)} préc.`);
  S1('luisenrique', ps.some(p => p.pos === 'ATT' && stylesOf(p, m).includes('Vitesse')) && ps.some(p => p.pos === 'MIL' && stylesOf(p, m).includes('Technique')), () => { addBase += 60; }, '+60 base');
  S1('emery', isCup(G), () => { wallMult *= 0.85; }, 'mur -15 %');
  S1('selection', Object.values(natCount).some(k => k >= 2), () => { multPrec *= 1.5; }, 'préc. x1,5');
  const mec = Math.min(2, 1 + Math.max(0, G.budget) / 40);
  S1('mecene', mec > 1, () => { multPrec *= mec; }, `préc. x${dec1(mec)}`);
  S1('ultras', m.poss === 1, () => { multPrec *= 2.5; }, 'préc. x2,5');
  S1('ds', stars, () => { multPrec *= Math.pow(1.3, stars); }, `préc. x${dec1(Math.pow(1.3, stars))}`);
  S1('trapattoni', line0.DEF >= 2, () => { multPrec *= 1.5; }, 'préc. x1,5');
  S1('happel', m.played === 0, () => { multPrec *= 2; }, 'préc. x2');
  S1('poucet', ps.every(p => !TOP_NATIONS.includes(p.nat)), () => { multPrec *= 2; }, 'préc. x2');
  S1('mondial', nNat > 2, () => { multPrec *= Math.pow(1.5, nNat - 2); }, `préc. x${dec1(Math.pow(1.5, nNat - 2))}`);
  const lob = Math.min(2.4, Math.pow(1.2, m.movesPlayed.length));
  S1('lobanovski', m.movesPlayed.length, () => { multPrec *= lob; }, `préc. x${dec1(lob)}`);
  S1('mister', true, () => { multPrec *= 2; }, 'préc. x2');
  S1('monde', true, () => { addPrec += nNat; }, `+${nNat} préc.`);
  G.staff.forEach(k => {
    const s = STAFF[k]; if (!s) return;
    if (s.group === 'sel' && ps.some(p => p.nat === s.nat)) syn.push(`${s.name} : force x${s.mult}`);
    if (s.group === 'fed') { const c = natCount[s.nat] || 0; if (c) { addPrec += c; syn.push(`${s.name} : +${c} préc.`); } }
    if (s.group === 'cont') { const c = ps.filter(p => s.nats.includes(p.nat)).length; if (c) { addBase += 25 * c; syn.push(`${s.name} : +${25 * c} base`); } }
  });
  if (hasStaff(G, 'video')) wallMult *= 0.9;
  // règles des clubs à battre
  if (m.rule === 'juve85' && !line0.DEF) { addPrec -= 1; syn.push('Le Trap : -1 préc. sans DEF'); }
  if (m.rule === 'chelsea17' && n < 3) { addPrec -= 1; syn.push('Défense à trois : -1 préc.'); }
  if (m.rule === 'barca15') wallMult *= 0.8;
  if (m.rule === 'grece04') wallMult *= 0.5;
  if (m.rule === 'bayern13' && m.goals) wallMult *= Math.pow(1.1, m.goals);
  // consignes
  if (m.nextPrec !== 1) { multPrec *= m.nextPrec; syn.push(`Remontada : préc. x${dec1(m.nextPrec)}`); }
  if (m.nextWall !== 1) { wallMult *= m.nextWall; syn.push(`Consigne : mur x${dec1(m.nextWall)}`); }
  if (nx.base) { addBase += nx.base; syn.push(`Ballon long : +${nx.base} base`); }
  if (nx.prec) { addPrec += nx.prec; syn.push(`Consigne : ${nx.prec > 0 ? '+' : ''}${dec1(nx.prec)} préc.`); }
  if (nx.perPlayer) { addPrec += nx.perPlayer * n; syn.push(`Vestiaire soudé : +${dec1(nx.perPlayer * n)} préc.`); }
  if (nx.solo && n === 1) { multPrec *= nx.solo; syn.push(`Tir au but : préc. x${nx.solo}`); }
  if (m.doubleLeft > 0) { multPrec *= 1.5; syn.push('Doublé : préc. x1,5'); }
  if (m.precAll) { addPrec += m.precAll; syn.push(`Causerie : +${m.precAll} préc.`); }
  if (m.lastPoss !== 1 && m.poss === 1) { multPrec *= m.lastPoss; syn.push(`12e homme : préc. x${m.lastPoss}`); }
  if (nx.fresh) ps.forEach(p => fatigueFree.add(p.id));
  wallMult *= ruleWall(m) * m.wallAll;
  wallMult *= Math.pow(0.9, m.pressing);

  let best = null;
  const lvBonus = hasStaff(G, 'paisley') ? 1 : 0;
  if (!cands.length) best = { move: null, base: 0, prec: 0, danger: 0, lv: 0 };
  cands.forEach(k => {
    const mv = MOVES[k], lv = (G.levels[k] || 0) + lvBonus;
    const base = mv.base + 10 * lv + addBase;
    const posMalus = m.rule === 'ajax71' && mv.pos ? 1 : 0;
    const prec = Math.max(0.5, Math.round((mv.prec + 0.5 * lv + addPrec - posMalus) * multPrec * (fx.moveMult[k] || 1) * 100) / 100);
    const danger = Math.round((sum + base) * prec);
    if (!best || danger > best.danger) best = { move: k, base, prec, danger, lv };
  });
  const wall = Math.round(m.wall * wallMult);
  // Le mur s'use : chaque tir arrêté retire son danger au prochain but ; le doublé demande en plus un mur entier.
  const need = Math.max(1, wall - (m.wear || 0));
  let goals = best.danger >= need + wall ? 2 : best.danger >= need ? 1 : 0;
  let blocked = null;
  if (goals && m.rule === 'inter65' && m.played === 0) { goals = 0; blocked = 'Verrou : la première action ne marque pas'; }
  if (goals && m.rule === 'espagne08' && n <= 2) { goals = 0; blocked = 'Tiki-taka : il faut 3 joueurs pour marquer'; }
  if (goals && m.rule === 'bayern01' && best.danger < need * 1.2) { goals = 0; blocked = 'Kahn arrête le tir : dépasse le mur de 20 %'; }
  if (goals && nx.hat) syn.push('Coup du chapeau : +1 but');
  if (blocked) syn.push(blocked);
  return { ...best, sum, wall, need, goals, blocked, syn, fatigueFree, techBonus, pressingAdd, ordered: ps.map(p => p.id), forces, fx, powers };
}

function playable(m, G, id) {
  return (m.fatigue[id] || 0) < fatigueLimit(G, m);
}

function playAction(ids, m, G) {
  const ev = evaluate(ids, m, G);
  const res = { ...ev, cancelled: false, sentOff: null, scorer: null };
  let goals = ev.goals + (ev.goals && m.nx.hat ? 1 : 0);
  if (goals > 0 && m.rule === 'grace' && !m.graceUsed) { m.graceUsed = true; goals -= 1; res.cancelled = true; }
  res.scored = goals;
  if (goals > 0) {
    const scorer = ev.ordered[ev.ordered.length - 1];
    res.scorer = scorer;
    G.goals[scorer] = (G.goals[scorer] || 0) + goals;
    if (ev.move === 'cpa') G.cpaGoals = (G.cpaGoals || 0) + goals;
  }
  m.goals += goals;
  const noWear = m.rule === 'arsenal04' || (m.rule === 'liverpool81' && m.goals === 0);
  if (ev.goals > 0) m.wear = 0;
  else if (ev.move && !noWear) m.wear = (m.wear || 0) + Math.round(ev.danger * ev.fx.wear * m.wearMult * (m.rule === 'sacchi' ? 0.5 : 1));
  if (ev.move && !m.movesPlayed.includes(ev.move)) m.movesPlayed.push(ev.move);
  if (ev.pressingAdd) m.pressing++;
  if (ev.techBonus) { m.changes++; m.techUsed = true; }
  m.nextWall = 1; m.nextPrec = 1; m.nx = {};
  if (m.doubleLeft > 0) m.doubleLeft--;
  let sentOff = null;
  if (m.rule === 'arbitre' && ids.length === 5) sentOff = ids.slice().sort((a, b) => PLAYERS[b].f - PLAYERS[a].f)[0];
  ev.fx.red.forEach(id => { if (!sentOff && rng() < 0.125) sentOff = id; });
  res.sentOff = sentOff;
  if (m.rule !== 'juve96') m.changes += ev.fx.changes;
  if (goals > 0 && ev.fx.money) { res.money = ev.fx.money * goals; G.budget = Math.round((G.budget + res.money) * 10) / 10; }
  ids.forEach(id => {
    m.hand.splice(m.hand.indexOf(id), 1);
    if (!ev.fatigueFree.has(id)) m.fatigue[id] = (m.fatigue[id] || 0) + 1;
    if (id === sentOff || ev.fx.tired.has(id)) m.fatigue[id] = 99;
    if (m.fatigue[id] >= fatigueLimit(G, m)) m.out.push(id); else m.discard.push(id);
  });
  m.poss--; m.played++;
  // Benítez : pas de but à la mi-match, deux possessions de plus
  if (hasStaff(G, 'benitez') && !m.benitezUsed && m.played >= Math.floor(m.possStart / 2) && m.goals === 0) { m.benitezUsed = true; m.poss += 2; res.extra = 'Benítez : +2 possessions'; }
  // Lippi : les fatigués reviennent pour les 2 dernières possessions
  if (hasStaff(G, 'lippi') && !m.lippiUsed && m.poss === 2) { m.lippiUsed = true; recover(m); res.extra = 'Lippi : les fatigués reviennent'; }
  draw(m);
  m.log.push(res);
  checkEnd(m);
  return res;
}

/** Les joueurs fatigués (pas les exclus ni les interdits) reviennent dans le paquet. */
function recover(m) {
  const back = m.out.filter(id => m.fatigue[id] < 99 && !m.banned.includes(id));
  m.out = m.out.filter(id => !back.includes(id));
  back.forEach(id => { m.fatigue[id] = 0; m.discard.push(id); });
  Object.keys(m.fatigue).forEach(id => { if (m.fatigue[id] < 99) m.fatigue[id] = 0; });
}

function changeCards(ids, m) {
  if (m.changes <= 0 || !ids.length || ids.length > 4) return false;
  ids.forEach(id => { m.hand.splice(m.hand.indexOf(id), 1); m.discard.push(id); });
  m.changes--;
  draw(m);
  return true;
}

function winMargin(m) { return m.rule === 'liverpool05' ? 2 : 1; }
function checkEnd(m) {
  if (m.goals - m.oppGoals >= winMargin(m)) m.over = 'win';
  else if (m.poss <= 0 || !m.hand.length) m.over = 'loss';
}

function itemsAllowed(m) { return m.rule !== 'seville16'; }
function useItem(k, m, G) {
  const i = G.items.indexOf(k);
  if (i < 0 || !itemsAllowed(m)) return false;
  const nx = m.nx;
  switch (k) {
    case 'pressing': m.nextWall *= 0.8; break;
    case 'blocbas': if (m.poss <= 2) return false; m.oppGoals = Math.max(0, m.oppGoals - 1); m.poss -= 2; break;
    case 'coaching': m.poss++; break;
    case 'tactique': m.changes++; break;
    case 'remontada': m.nextPrec *= 2; break;
    case 'recup': recover(m); draw(m); break;
    case 'ballonlong': nx.base = (nx.base || 0) + 50; break;
    case 'profondeur': nx.line = { ...(nx.line || {}), ATT: 2 }; break;
    case 'defhaute': nx.line = { ...(nx.line || {}), DEF: 2 }; break;
    case 'losange': nx.line = { ...(nx.line || {}), MIL: 2 }; break;
    case 'volant': nx.line = { ...(nx.line || {}), GAR: 3 }; break;
    case 'capitaine': nx.captain = 3; break;
    case 'chapeau': nx.hat = 1; break;
    case 'causerie': m.precAll += 1; break;
    case 'vestiaire': nx.perPlayer = (nx.perPlayer || 0) + 0.5; break;
    case 'pluie': m.nextWall *= 0.7; nx.prec = (nx.prec || 0) - 1; break;
    case 'additionnel': m.poss += 2; break;
    case 'horsjeu': if (m.oppGoals <= 0) return false; m.oppGoals--; break;
    case 'faute': if (m.oppGoals <= 0) return false; m.oppGoals--; m.wallAll *= 1.15; break;
    case 'express': draw(m, 2); break;
    case 'rotation': m.discard.push(...m.hand); m.hand = []; draw(m); break;
    case 'derby': nx.club = 2; break;
    case 'hymne': nx.nat = 2; break;
    case 'prime': m.primeBonus += 6; break;
    case 'videoadv': m.wearMult *= 2; break;
    case 'tab': nx.solo = 3; break;
    case 'presstout': m.wallAll *= 0.9; break;
    case 'double': m.doubleLeft = 2; break;
    case 'sangfroid': nx.fresh = true; break;
    case 'douzieme': m.lastPoss = 3; break;
  }
  G.items.splice(i, 1);
  checkEnd(m);
  return true;
}

function settle(m, G) {
  const wage = Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10;
  const r = { wage, prime: 0, diff: 0, ticket: 0, comm: 0 };
  if (m.over === 'win') {
    r.prime = m.prime + (m.primeBonus || 0); r.diff = 2 * (m.goals - m.oppGoals); r.ticket = m.poss; r.comm = hasStaff(G, 'comm') ? 4 : 0;
  }
  r.total = Math.round((r.prime + r.diff + r.ticket + r.comm - wage) * 10) / 10;
  G.budget = Math.round((G.budget + r.total) * 10) / 10;
  return r;
}

/** Fin de campagne gagnée : jusqu'à 3 joueurs (meilleurs buteurs, pas encore collectionnés) entrent dans la collection. */
function campaignUnlocks(G, unlocked = []) {
  const pool = G.squad.filter(id => !unlocked.includes(id));
  return pool.sort((a, b) => (G.goals[b] || 0) - (G.goals[a] || 0) || PLAYERS[b].f - PLAYERS[a].f).slice(0, 3);
}

/**
 * Entraîneurs débloqués à la fin d'un match. prof : { coaches, stats } (modifié sur place).
 * Retourne les nouvelles clés.
 */
function coachUnlocks(G, m, prof, campaignWon) {
  prof.coaches = prof.coaches || []; prof.stats = prof.stats || {};
  const out = [];
  const add = k => { if (STAFF[k] && STAFF[k].unlock && !prof.coaches.includes(k)) { prof.coaches.push(k); out.push(k); } };
  if (m.over === 'win' && m.rule && RULES[m.rule].unlock) add(RULES[m.rule].unlock);
  prof.stats.cpa = (prof.stats.cpa || 0) + (G.cpaGoals || 0) - (G.cpaCounted || 0);
  G.cpaCounted = G.cpaGoals || 0;
  if (prof.stats.cpa >= 10) add('cf');
  if (Object.values(G.goals).reduce((a, b) => a + b, 0) >= 30) add('stat');
  if (campaignWon) add('mental');
  return out;
}

function sellValue(G, id) { return Math.round((PLAYERS[id].price * 0.5 + (G.goals[id] || 0)) * 2) / 2; }

function rerollCost(G) { return 2 + G.rerolls; }

/** Choix du mouvement de départ : 3 communs. */
function booster(n = 3) { return shuffle(Object.keys(MOVES).filter(k => MOVES[k].tier === 'commun')).slice(0, n); }
function addMove(G, k, lv) { if (G.moves.length >= MOVE_SLOTS || G.moves.includes(k)) return false; G.moves.push(k); G.levels[k] = Math.max(G.levels[k] || 0, lv || 0); return true; }
function removeMove(G, k) { const i = G.moves.indexOf(k); if (i < 0) return false; G.moves.splice(i, 1); G.levels[k] = 0; return true; }

// Boutique du mercato : 2 entraîneurs et 2 mouvements (relançables), plus 3 boosters (un achat chacun).
const STAFF_WEIGHT = { commun: 60, rare: 28, epique: 10, legende: 3 };
function staffWeight(G, k) {
  const s = STAFF[k];
  let w = STAFF_WEIGHT[s.tier] * (s.tier === 'commun' ? 1 : 1 + G.stage * 0.15);
  // sélectionneurs et fédérations : une nation présente dans l'effectif sort plus souvent
  if (s.group === 'sel' || s.group === 'fed') {
    const here = G.squad.some(id => PLAYERS[id].nat === s.nat);
    w *= (here ? 3 : 0.4) / 12;
  }
  if (s.group === 'cont') w /= 3;
  return w;
}
function pickStaff(G, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const pool = Object.keys(STAFF).filter(k => !G.staff.includes(k) && !out.includes(k) && coachAvailable(G, k));
    if (!pool.length) break;
    const w = pool.map(k => staffWeight(G, k));
    let r = rng() * w.reduce((a, b) => a + b, 0), j = 0;
    while (r > w[j]) { r -= w[j]; j++; }
    out.push(pool[Math.min(j, pool.length - 1)]);
  }
  return out;
}
function offerMoves(G) {
  const tiers = G.stage < 3 ? ['commun', 'commun', 'rare'] : G.stage < 6 ? ['commun', 'rare', 'rare', 'epique'] : ['rare', 'epique'];
  const pool2 = Object.keys(MOVES).filter(k => MOVES[k].tier !== 'base' && !G.moves.includes(k));
  const moves = [];
  for (let i = 0; i < 8 && moves.length < 2; i++) {
    const t = pick(tiers); const opts = pool2.filter(k => (MOVES[k].tier === t || i > 3) && !moves.some(m => m.k === k));
    if (opts.length) { const lv = rng() < 0.25 + G.stage * 0.05 ? 1 + Math.floor(rng() * 2) : 0; moves.push({ k: pick(opts), lv }); }
  }
  return moves;
}
function makeOffer(G, keepPacks = false) {
  const packs = keepPacks && G.offer ? G.offer.packs : { joueurs: false, entrainement: false, consignes: false };
  G.offer = { staff: pickStaff(G, 2), moves: offerMoves(G), packs };
}
const PACKS = {
  joueurs: { name: 'Joueurs', desc: 'Choisis 1 joueur parmi 3 (une star de temps en temps)', price: G => 6 + G.stage },
  entrainement: { name: 'Entraînement', desc: 'Choisis 1 mouvement à faire monter de niveau parmi 3', price: () => 4 },
  consignes: { name: 'Consignes', desc: 'Choisis 1 consigne à usage unique parmi 3', price: () => 3 },
};
/** Fourchette de force des classiques du booster selon l'avancée de la campagne. */
function classicRange(stage) { return stage < 3 ? [20, 50] : stage < 6 ? [40, 75] : [55, 90]; }
const STAR_CHANCE = 0.08;
function packContent(G, kind) {
  if (kind === 'joueurs') {
    const [lo, hi] = classicRange(G.stage);
    const starCap = 72 + G.stage * 4;
    const out = [];
    for (let i = 0; i < 3; i++) {
      const star = rng() < STAR_CHANCE;
      const pool = Object.values(PLAYERS).filter(p => !G.squad.includes(p.id) && !out.includes(p.id) && (star ? p.star && p.f <= starCap + (rng() < 0.1 ? 20 : 0) : p.classic && p.f >= lo && p.f <= hi));
      if (pool.length) out.push(pick(pool).id);
    }
    return out;
  }
  if (kind === 'entrainement') return shuffle(G.moves.slice()).slice(0, 3);
  return shuffle(Object.keys(ITEMS)).slice(0, 3);
}
function sellStaffValue(k) { return Math.floor(STAFF[k].cost / 2); }


function wageTotal(G) { return Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10; }
function ruleWall(m) { return m.rule === 'derby' ? 1.2 : m.rule === 'mourinho' ? 1.5 : 1; }
function wallNow(m, G) {
  let w = m.wall * ruleWall(m) * m.wallAll * Math.pow(0.9, m.pressing) * (hasStaff(G, 'video') ? 0.9 : 1);
  if (m.rule === 'barca15') w *= 0.8;
  if (m.rule === 'grece04') w *= 0.5;
  if (m.rule === 'bayern13' && m.goals) w *= Math.pow(1.1, m.goals);
  if (hasStaff(G, 'emery') && isCup(G)) w *= 0.85;
  return Math.round(w);
}

export {
  LINES, NATIONS, CLUBS, PLAYERS, force, cardForce, MOVES, STARTER, MOVE_SLOTS, TIER_PRICE, STAFF, STAFF_SLOTS, ITEMS, RULES, SEASON, CAMPAIGNS, campaignOf, stageOf, seasonLength, campaignUnlocks,
  setRng, shuffle, newGame, newMatch, evaluate, playAction, changeCards, settle, makeOffer, playable, useItem, itemsAllowed, winMargin,
  sellValue, rerollCost, PACKS, packContent, sellStaffValue, price, booster, addMove, removeMove, movePrice, hasStaff, fatigueLimit, wageTotal, wallNow,
  drawStarters, movePlayable, coachUnlocks, coachAvailable, unlockText, staffCost, NATION_TIER, TOP_NATIONS, STAR_CHANCE, classicRange,
};
