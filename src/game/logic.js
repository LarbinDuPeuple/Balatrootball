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
  'Mexique': { t: 'v', c: ['#1d7a3a', '#f4f4f4', '#c8102e'] },
  'Nigéria': { t: 'v', c: ['#1d8a43', '#f4f4f4', '#1d8a43'] },
  'Mali': { t: 'v', c: ['#1d8a43', '#f2d22e', '#c8102e'] },
  'Ukraine': { t: 'h', c: ['#2b6cb0', '#f2d22e'] },
  'Hongrie': { t: 'h', c: ['#c8102e', '#f4f4f4', '#1d7a3a'] },
  'Irlande du Nord': { t: 'x', c: ['#f4f4f4', '#c8102e'] },
  'Uruguay': { t: 'h', c: ['#f4f4f4', '#5aa0dc', '#f4f4f4', '#5aa0dc'] },
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

// Joueurs « moyens » du booster de départ : vrais joueurs cultes, pas des cracks.
const MIDS = [
  // GARDIENS
  ['Mickaël Landreau', 'GAR', 70, 'Nantes', 'France', 2000, ['Spécialiste'], L(0, 2, 'court')],
  ['Grégory Coupet', 'GAR', 71, 'Lyon', 'France', 2000, ['Leader'], L(0, 0, 'chauve')],
  ['Vítor Baía', 'GAR', 68, 'Porto', 'Portugal', 2000, ['Technique'], L(1, 0, 'court')],
  ['Pepe Reina', 'GAR', 70, 'Liverpool', 'Espagne', 2010, ['Technique'], L(1, 0, 'court', 'barbe')],
  ['David James', 'GAR', 66, 'Liverpool', 'Angleterre', 2000, ['Physique'], L(4, 0, 'court')],
  ['Jerzy Dudek', 'GAR', 68, 'Liverpool', 'Pologne', 2000, ['Spécialiste'], L(0, 2, 'court', 'moustache')],
  ['René Higuita', 'GAR', 68, 'Atlético Nacional', 'Colombie', 1990, ['Technique'], L(2, 0, 'afro', 'moustache')],
  ['Jorge Campos', 'GAR', 66, 'Pumas', 'Mexique', 1990, ['Vitesse'], L(2, 0, 'long')],
  ['Guillermo Ochoa', 'GAR', 68, 'Ajaccio', 'Mexique', 2010, ['Spécialiste'], L(2, 0, 'afro')],
  // DÉFENSEURS
  ['Jamie Carragher', 'DEF', 72, 'Liverpool', 'Angleterre', 2000, ['Leader'], L(0, 2, 'court')],
  ['Marco Materazzi', 'DEF', 72, 'Inter Milan', 'Italie', 2000, ['Physique', 'Pressing'], L(1, 0, 'court', 'barbe')],
  ['Philippe Mexès', 'DEF', 70, 'AS Roma', 'France', 2000, ['Physique'], L(1, 0, 'long', 'barbe')],
  ['Daniel Van Buyten', 'DEF', 70, 'Bayern Munich', 'Belgique', 2010, ['Physique'], L(0, 3, 'court')],
  ['Bruno Alves', 'DEF', 70, 'Porto', 'Portugal', 2010, ['Physique'], L(1, 0, 'court', 'barbe')],
  ['Gaël Clichy', 'DEF', 70, 'Arsenal', 'France', 2010, ['Vitesse'], L(3, 0, 'court')],
  ['Bacary Sagna', 'DEF', 70, 'Arsenal', 'France', 2010, ['Pressing'], L(4, 0, 'afro')],
  ['Martín Demichelis', 'DEF', 68, 'Bayern Munich', 'Argentine', 2010, ['Physique'], L(1, 1, 'long')],
  ['Taye Taiwo', 'DEF', 68, 'Marseille', 'Nigéria', 2000, ['Vitesse'], L(4, 0, 'court')],
  ['Fabio Grosso', 'DEF', 68, 'Inter Milan', 'Italie', 2000, ['Spécialiste'], L(1, 1, 'long')],
  ['Glen Johnson', 'DEF', 66, 'Liverpool', 'Angleterre', 2010, ['Vitesse'], L(3, 0, 'court')],
  ['Rigobert Song', 'DEF', 66, 'Liverpool', 'Cameroun', 1990, ['Leader'], L(4, 0, 'afro')],
  ['Gabriel Heinze', 'DEF', 66, 'Manchester United', 'Argentine', 2000, ['Pressing'], L(1, 0, 'long', 'barbe')],
  ['Wes Brown', 'DEF', 66, 'Manchester United', 'Angleterre', 2000, [], L(0, 0, 'court')],
  ['Pascal Cygan', 'DEF', 64, 'Arsenal', 'France', 2000, ['Physique'], L(0, 0, 'degarni')],
  ['Djimi Traoré', 'DEF', 63, 'Liverpool', 'Mali', 2000, [], L(4, 0, 'court')],
  ['Titus Bramble', 'DEF', 62, 'Newcastle', 'Angleterre', 2000, ['Physique'], L(4, 0, 'chauve')],
  // MILIEUX
  ['Yoann Gourcuff', 'MIL', 72, 'Bordeaux', 'France', 2010, ['Technique'], L(0, 2, 'court')],
  ['Florent Malouda', 'MIL', 72, 'Chelsea', 'France', 2010, ['Vitesse'], L(4, 0, 'chauve')],
  ['Mathieu Valbuena', 'MIL', 71, 'Marseille', 'France', 2010, ['Spécialiste'], L(1, 0, 'court')],
  ['Gaizka Mendieta', 'MIL', 71, 'FC Barcelone', 'Espagne', 2000, ['Technique'], L(1, 3, 'long')],
  ['Ludovic Giuly', 'MIL', 71, 'FC Barcelone', 'France', 2000, ['Vitesse'], L(0, 2, 'long')],
  ['Lassana Diarra', 'MIL', 71, 'Real Madrid', 'France', 2010, ['Pressing'], L(4, 0, 'court')],
  ['Mark van Bommel', 'MIL', 70, 'Bayern Munich', 'Pays-Bas', 2010, ['Pressing'], L(0, 2, 'court')],
  ['Christian Karembeu', 'MIL', 70, 'Real Madrid', 'France', 1990, ['Pressing'], L(3, 0, 'long')],
  ['Ricardo Quaresma', 'MIL', 68, 'Porto', 'Portugal', 2000, ['Technique'], L(2, 0, 'court')],
  ['Dietmar Hamann', 'MIL', 68, 'Liverpool', 'Allemagne', 2000, ['Physique'], L(0, 2, 'court')],
  ['Mohamed Sissoko', 'MIL', 67, 'Liverpool', 'Mali', 2000, ['Physique'], L(4, 0, 'court')],
  ['Joey Barton', 'MIL', 66, 'Newcastle', 'Angleterre', 2010, ['Pressing', 'Physique'], L(0, 2, 'court', 'barbe')],
  ['Kevin Nolan', 'MIL', 66, 'Newcastle', 'Angleterre', 2010, ['Physique'], L(0, 2, 'court')],
  ['Lucas Leiva', 'MIL', 66, 'Liverpool', 'Brésil', 2010, ['Pressing'], L(1, 2, 'long')],
  ['Kim Källström', 'MIL', 66, 'Lyon', 'Suède', 2010, ['Spécialiste'], L(0, 3, 'court')],
  // ATTAQUANTS
  ['Djibril Cissé', 'ATT', 72, 'Liverpool', 'France', 2000, ['Vitesse'], L(4, 3, 'crete', 'barbe')],
  ['Nwankwo Kanu', 'ATT', 71, 'Arsenal', 'Nigéria', 1990, ['Technique'], L(4, 0, 'chauve')],
  ['Mamadou Niang', 'ATT', 70, 'Marseille', 'Sénégal', 2010, ['Vitesse'], L(4, 0, 'court')],
  ['Christophe Dugarry', 'ATT', 70, 'Bordeaux', 'France', 1990, ['Technique'], L(0, 2, 'court')],
  ['Louis Saha', 'ATT', 70, 'Manchester United', 'France', 2000, ['Physique'], L(4, 0, 'chauve')],
  ['Luca Toni', 'ATT', 70, 'Bayern Munich', 'Italie', 2000, ['Physique'], L(1, 0, 'long', 'barbe')],
  ['André-Pierre Gignac', 'ATT', 70, 'Marseille', 'France', 2010, ['Physique'], L(1, 0, 'court', 'barbe')],
  ['Dirk Kuyt', 'ATT', 70, 'Liverpool', 'Pays-Bas', 2010, ['Pressing'], L(0, 3, 'court')],
  ['Diego Forlán', 'ATT', 72, 'Atlético Madrid', 'Uruguay', 2010, ['Spécialiste'], L(0, 3, 'long')],
  ['Peter Crouch', 'ATT', 68, 'Liverpool', 'Angleterre', 2000, ['Physique'], L(0, 2, 'court')],
  ['Andy Carroll', 'ATT', 68, 'Newcastle', 'Angleterre', 2010, ['Physique'], L(0, 2, 'queue', 'barbe')],
  ['Nicklas Bendtner', 'ATT', 66, 'Arsenal', 'Danemark', 2010, ['Physique'], L(0, 3, 'court')],
  ['Emile Heskey', 'ATT', 66, 'Liverpool', 'Angleterre', 2000, ['Physique'], L(4, 0, 'chauve')],
  ['Mido', 'ATT', 66, 'AS Roma', 'Égypte', 2000, ['Physique'], L(2, 0, 'long')],
  ['Stéphane Guivarc\'h', 'ATT', 64, 'Auxerre', 'France', 1990, ['Physique'], L(0, 2, 'court')],
  ['Javier Saviola', 'ATT', 68, 'FC Barcelone', 'Argentine', 2000, ['Vitesse'], L(1, 0, 'long')],
];

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
STARS.forEach(([name, pos, r, club, nat, dec, styles, star, look]) => {
  const id = slug(name);
  const pw = POWERS[name];
  PLAYERS[id] = { id, name, pos, r, f: force(r), club, nat, dec, styles, star: !!pw, look, price: price(r), salary: salary(r), power: pw ? { name: pw[0], desc: pw[1] } : null };
  if (pw) POWER_FX[id] = pw[2];
});
YOUTH.forEach(([name, pos, r, nat, , styles], i) => {
  const id = 'jeune-' + slug(name);
  const seed = i * 7 + 3;
  PLAYERS[id] = {
    id, name, pos, r, f: force(r), club: 'Olympique', nat, dec: 2020, styles, star: false, youth: true,
    look: L(seed % 5, (seed * 3) % 6, ['court', 'long', 'boucle', 'court', 'degarni', 'afro'][seed % 6], ['rien', 'rien', 'moustache', 'barbe'][seed % 4]),
    price: price(r), salary: salary(r),
  };
});

MIDS.forEach(([name, pos, r, club, nat, dec, styles, look]) => {
  const id = slug(name);
  // prix et salaire de jeune : le booster de départ ne doit pas être une machine à cash
  PLAYERS[id] = { id, name, pos, r, f: force(r), club, nat, dec, styles, star: false, mid: true, look, price: price(r - 8), salary: 0.1 };
});

// Booster de départ : un paquet par ligne, on garde une partie des joueurs.
const STARTER = { GAR: [4, 2], DEF: [6, 4], MIL: [6, 4], ATT: [6, 4] };
/** Un paquet de départ ; un joueur de la collection peut remplacer une carte (une chance sur deux). */
function starterPack(pos, unlocked = []) {
  const pack = shuffle(Object.values(PLAYERS).filter(p => p.mid && p.pos === pos).map(p => p.id)).slice(0, STARTER[pos][0]);
  const mine = shuffle(unlocked.filter(id => PLAYERS[id] && PLAYERS[id].pos === pos));
  if (mine.length && rng() < 0.5) pack[Math.floor(rng() * pack.length)] = mine[0];
  return pack;
}
function autoStarter() { return Object.keys(STARTER).flatMap(pos => starterPack(pos).sort((a, b) => PLAYERS[b].r - PLAYERS[a].r).slice(0, STARTER[pos][1])); }

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


// Entraîneurs (le cœur des combos, comme les jokers) : commun, rare, épique, légendaire.
const STAFF = {
  prepa: { tier: 'commun', name: 'Préparateur physique', desc: 'Fatigue : 3 actions par match au lieu de 2', cost: 5 },
  kine: { tier: 'commun', name: 'Kiné', desc: '+1 changement par match', cost: 4 },
  comm: { tier: 'commun', name: 'Directeur commercial', desc: '+4 M€ à chaque victoire', cost: 5 },
  adjoint: { tier: 'commun', name: 'Adjoint défensif', desc: '+1 précision si un DEF est dans l\'action', cost: 5 },
  gk: { tier: 'commun', name: 'Entraîneur des gardiens', desc: '+1,5 précision si un GAR est dans l\'action', cost: 5 },
  coachatt: { tier: 'commun', name: 'Coach des attaquants', desc: '+30 base par ATT dans l\'action', cost: 6 },
  video: { tier: 'commun', name: 'Analyste vidéo', desc: 'Le mur adverse baisse de 10 %', cost: 6 },
  psy: { tier: 'commun', name: 'Psychologue', desc: 'Annule l\'Ego des stars ; +1 précision avec 2 stars ou plus', cost: 4 },
  scout: { tier: 'commun', name: 'Recruteur', desc: '+10 base par joueur recruté cette saison', cost: 5 },
  mental: { tier: 'rare', name: 'Préparateur mental', desc: '+1 possession par match', cost: 8 },
  cf: { tier: 'rare', name: 'Coach des coups francs', desc: 'Précision x1,5 si un Spécialiste est dans l\'action', cost: 8 },
  jeunes: { tier: 'rare', name: 'Formateur', desc: 'Les joueurs du booster de départ ont force x2', cost: 7 },
  kop: { tier: 'rare', name: 'Le Kop', desc: '+0,3 précision par victoire de la saison', cost: 8 },
  stat: { tier: 'rare', name: 'Statisticien', desc: '+10 base par but marqué cette saison', cost: 8 },
  tacticien: { tier: 'rare', name: 'Tacticien', desc: '+0,6 précision par poste différent dans l\'action', cost: 9 },
  selection: { tier: 'epique', name: 'Sélectionneur', desc: 'Précision x1,5 si 2 joueurs de même nation', cost: 12 },
  mecene: { tier: 'epique', name: 'Président mécène', desc: 'Précision x(1 + budget / 40), jusqu\'à x2', cost: 13 },
  ultras: { tier: 'epique', name: 'Ultras', desc: 'Dernière possession : précision x2,5', cost: 11 },
  ds: { tier: 'epique', name: 'Directeur sportif', desc: 'Précision x1,3 par star dans l\'action', cost: 13 },
  mister: { tier: 'legende', name: 'Le Mister', desc: 'Précision x2', cost: 18 },
  monde: { tier: 'legende', name: 'Cellule mondiale', desc: '+1 précision par nationalité différente dans l\'action', cost: 16 },
};
const STAFF_SLOTS = 5;

const ITEMS = {
  pressing: { name: 'Pressing haut', desc: 'Mur -20 % pour la prochaine action', cost: 3 },
  blocbas: { name: 'Bloc bas', desc: 'L\'adversaire marque 1 but de moins, tu perds 2 possessions', cost: 4 },
  coaching: { name: 'Coaching gagnant', desc: '+1 possession', cost: 4 },
  tactique: { name: 'Changement tactique', desc: '+1 changement', cost: 2 },
  remontada: { name: 'Remontada', desc: 'Précision x2 pour la prochaine action', cost: 5 },
  recup: { name: 'Récupération', desc: 'Tous les joueurs fatigués reviennent', cost: 3 },
};

const RULES = {
  catenaccio: { name: 'Catenaccio', desc: 'Les attaquants ne comptent que la moitié de leur force' },
  gelee: { name: 'Pelouse gelée', desc: 'Le style Technique ne compte pas' },
  arbitre: { name: 'Arbitre tatillon', desc: 'Une action à 5 joueurs : le mieux noté est exclu du match' },
  derby: { name: 'Derby bouillant', desc: 'Synergies de club doublées, mais mur +20 %' },
  grace: { name: 'Gardien en état de grâce', desc: 'Ton premier but est annulé' },
  // entraîneurs cultes (boss des campagnes)
  ferguson: { coach: 'Alex Ferguson', club: 'Manchester United', name: 'Fergie time', desc: 'L\'adversaire annonce 1 but de plus' },
  ancelotti: { coach: 'Carlo Ancelotti', club: 'Real Madrid', name: 'Sourcil levé', desc: 'Synergies de club et de nationalité ignorées' },
  sacchi: { coach: 'Arrigo Sacchi', club: 'AC Milan', name: 'Pressing tout terrain', desc: 'Le mur ne s\'use qu\'à moitié' },
  klopp: { coach: 'Jürgen Klopp', club: 'Liverpool', name: 'Gegenpressing', desc: 'Fatigue : 1 action de moins par joueur' },
  guardiola: { coach: 'Pep Guardiola', club: 'FC Barcelone', name: 'Confiscation du ballon', desc: 'Tu as 2 possessions de moins' },
  mourinho: { coach: 'José Mourinho', club: 'Inter Milan', name: 'Bus garé', desc: 'Mur +50 %, mais il n\'annonce que 2 buts' },
  simeone: { coach: 'Diego Simeone', club: 'Atlético Madrid', name: 'Cholismo', desc: 'Les attaquants ne comptent que la moitié de leur force' },
};
const BASE_RULES = ['catenaccio', 'gelee', 'arbitre', 'derby', 'grace'];

const OPP_CLUBS = Object.keys(CLUBS).filter(c => c !== 'Olympique');

const SEASON = [
  { comp: 'Championnat', label: 'Journée 1', wall: 250, opp: 1, prime: 6 },
  { comp: 'Championnat', label: 'Journée 2', wall: 400, opp: 1, prime: 7 },
  { comp: 'Championnat', label: 'Grande affiche', wall: 550, opp: 2, prime: 10, boss: true },
  { comp: 'Coupe nationale', label: 'Huitième', wall: 800, opp: 2, prime: 10 },
  { comp: 'Coupe nationale', label: 'Demi-finale', wall: 1200, opp: 2, prime: 12 },
  { comp: 'Coupe nationale', label: 'Finale', wall: 2200, opp: 2, prime: 15, boss: true },
  { comp: 'Coupe d\'Europe', label: 'Quart de finale', wall: 3600, opp: 2, prime: 16 },
  { comp: 'Coupe d\'Europe', label: 'Demi-finale', wall: 5000, opp: 3, prime: 18 },
  { comp: 'Coupe d\'Europe', label: 'Finale', wall: 6500, opp: 3, prime: 25, boss: true },
];

// Campagnes : comme les paquets de Balatro, de plus en plus dures, avec des entraîneurs cultes en boss.
// La finale garde le mur de base : la règle du boss final suffit à la corser.
function stagesFrom(mult, bosses, comps) {
  return SEASON.map((st, i) => {
    const b = i === 2 ? 0 : i === 5 ? 1 : i === 8 ? 2 : -1;
    return { ...st, comp: comps ? comps[Math.floor(i / 3)] : st.comp, wall: Math.round(st.wall * (i === 8 ? 1 : mult) / 50) * 50, coach: b >= 0 && bosses ? bosses[b] : null };
  });
}
const CAMPAIGNS = [
  { id: 'saison', name: 'Saison classique', desc: 'Championnat, coupe nationale puis coupe d\'Europe. Règles surprises aux matchs spéciaux.', budget: 12, req: null, stages: stagesFrom(1, null) },
  { id: 'c1', name: 'Coupe des clubs champions', desc: 'Ferguson, Ancelotti et Sacchi t\'attendent. Murs +20 %, budget 10 M€.', budget: 10, req: 'saison',
    stages: stagesFrom(1.2, ['ferguson', 'ancelotti', 'sacchi'], ['Phase de groupes', 'Huitièmes et quarts', 'Dernier carré']) },
  { id: 'ldc', name: 'Ligue des champions mythique', desc: 'Klopp, Guardiola puis Mourinho en finale. Murs +30 %, budget 8 M€.', budget: 8, req: 'c1',
    stages: stagesFrom(1.3, ['klopp', 'guardiola', 'mourinho'], ['Phase de ligue', 'Huitièmes et quarts', 'Dernier carré']) },
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
function newGame(campaign = 'saison') {
  const G = {
    campaign, signed: 0, budget: (CAMPAIGNS.find(c => c.id === campaign) || CAMPAIGNS[0]).budget, squad: autoStarter(),
    goals: {}, staff: [], items: [], levels: {}, moves: ['frappe', 'passe', 'unedeux'], stage: 0, rerolls: 0, offer: null, history: [],
  };
  Object.keys(MOVES).forEach(k => G.levels[k] = 0);
  return G;
}
function hasStaff(G, k) { return G.staff.includes(k); }

function newMatch(G) {
  const s = stageOf(G);
  const natCount = {};
  G.squad.forEach(id => { const n = PLAYERS[id].nat; natCount[n] = (natCount[n] || 0) + 1; });
  const ossature = Object.entries(natCount).find(([, c]) => c >= 5);
  const rule = s.coach || (s.boss ? pick(BASE_RULES) : null);
  let poss = 6 + (hasStaff(G, 'mental') ? 1 : 0) + (ossature ? 1 : 0) - (rule === 'guardiola' ? 2 : 0);
  const oppGoals = rule === 'mourinho' ? 2 : s.opp + (rule === 'ferguson' ? 1 : 0);
  const m = {
    stage: G.stage, prime: s.prime, opp: s.coach ? RULES[s.coach].club : pick(OPP_CLUBS), wall: s.wall, wear: 0, oppGoals, goals: 0,
    poss, possStart: poss, changes: 2 + (hasStaff(G, 'kine') ? 1 : 0),
    deck: shuffle(G.squad.slice()), hand: [], discard: [], out: [], fatigue: {},
    rule, pressing: 0, nextWall: 1, nextPrec: 1,
    techUsed: false, graceUsed: false, played: 0, over: null, ossature: ossature ? ossature[0] : null, log: [],
  };
  draw(m);
  return m;
}

function fatigueLimit(G, m) { return (hasStaff(G, 'prepa') ? 3 : 2) - (m && m.rule === 'klopp' ? 1 : 0); }

function draw(m) {
  while (m.hand.length < 8) {
    if (!m.deck.length) { if (!m.discard.length) break; m.deck = shuffle(m.discard); m.discard = []; }
    m.hand.push(m.deck.pop());
  }
  sortHand(m);
}
function sortHand(m) { m.hand.sort((a, b) => LINES[PLAYERS[a].pos] - LINES[PLAYERS[b].pos] || PLAYERS[b].f - PLAYERS[a].f); }

function stylesOf(p, m) {
  return m && m.rule === 'gelee' ? p.styles.filter(s => s !== 'Technique') : p.styles;
}

/** Force d'une carte dans une action (règle Catenaccio, bonus de génération). */
function shortName(p) { const parts = p.name.split(' '); return parts.length === 1 ? p.name : parts.slice(1).join(' '); }
function dec1(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }
function cardForce(p, m, decCount) {
  let f = p.f;
  if (m && (m.rule === 'catenaccio' || m.rule === 'simeone') && p.pos === 'ATT') f = Math.floor(f / 2);
  if (decCount[p.dec] >= 2 && !p.youth) f = Math.round(f * 1.3);
  return f;
}

function evaluate(ids, m, G) {
  if (!ids.length) return null;
  const ps = ids.map(id => PLAYERS[id]).sort((a, b) => LINES[a.pos] - LINES[b.pos]);
  const syn = [];
  const n = ps.length;
  // notes
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
  const forces = {};
  let sum = 0;
  ps.forEach(p => {
    let f = cardForce(p, m, decCount);
    if (p.mid && hasStaff(G, 'jeunes')) f *= 2;
    f = Math.round(f * (fx.force[p.id] || 1)) + (fx.addF[p.id] || 0);
    forces[p.id] = f; sum += f;
  });
  const gen = Object.entries(decCount).filter(([d, c]) => c >= 2 && ps.some(p => p.dec == d && !p.youth));
  gen.forEach(([d, c]) => syn.push(`Génération ${d}s : force +30 % x${c}`));

  const line = { ...line0 };
  fx.lines.forEach(l => { if (!line[l]) line[l] = 1; });
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
    if (c === 'Olympique' || m.rule === 'ancelotti') return; // les jeunes du centre ne créent pas d'automatismes
    if (k === 2) { addPrec += 0.5 * derby; syn.push(`Automatismes ${c} : +${0.5 * derby} préc.`); }
    if (k >= 3) { addPrec += 1.5 * derby; ps.filter(p => p.club === c).forEach(p => fatigueFree.add(p.id)); syn.push(`Bloc ${c} : +${1.5 * derby} préc., sans fatigue`); }
  });
  const natCount = {};
  ps.forEach(p => natCount[p.nat] = (natCount[p.nat] || 0) + 1);
  Object.entries(natCount).forEach(([nat, k]) => {
    if (k >= 2 && m.rule !== 'ancelotti') { addBase += 15 * k; syn.push(`Sélection ${nat} : +${15 * k} base`); }
  });
  let techBonus = false, pressingAdd = false;
  if ((styleCount.Vitesse || 0) >= 3) { const v = m.played === 0 ? 2 : 1; addPrec += v; syn.push(`Trio Vitesse : +${v} préc.`); }
  if ((styleCount.Physique || 0) >= 3) { wallMult *= 0.85; syn.push('Trio Physique : mur -15 %'); }
  if ((styleCount.Pressing || 0) >= 3) { pressingAdd = true; syn.push('Trio Pressing : mur -10 % jusqu\'à la fin'); }
  if ((styleCount.Technique || 0) >= 3 && !m.techUsed) { techBonus = true; syn.push('Trio Technique : +1 changement'); }
  const stars = ps.filter(p => p.star).length;
  const leader = ps.some(p => st(p).includes('Leader'));
  if (stars >= 3) {
    if (leader || hasStaff(G, 'psy')) syn.push('Ego calmé');
    else { multPrec *= 0.7; syn.push('Ego : 3 stars sans Leader, préc. x0,7'); }
  }
  powers.forEach(id => syn.push(`★ ${PLAYERS[id].power.name} (${shortName(PLAYERS[id])})`));
  addBase += fx.base; addPrec += fx.prec; multPrec *= fx.mult; wallMult *= fx.wall;
  fx.fresh.forEach(id => fatigueFree.add(id));
  // staff
  const S1 = (k, cond, f, label) => { if (hasStaff(G, k) && cond) { f(); syn.push(`${STAFF[k].name} : ${label}`); } };
  const wins = G.history.filter(h => h.won).length, seasonGoals = Object.values(G.goals).reduce((a, b) => a + b, 0);
  S1('adjoint', line0.DEF, () => { addPrec += 1; }, '+1 préc.');
  S1('coachatt', line0.ATT, () => { addBase += 30 * line0.ATT; }, `+${30 * line0.ATT} base`);
  S1('gk', line0.GAR, () => { addPrec += 1.5; }, '+1,5 préc.');
  S1('psy', stars >= 2, () => { addPrec += 1; }, '+1 préc.');
  S1('scout', G.signed, () => { addBase += 10 * G.signed; }, `+${10 * G.signed} base`);
  S1('cf', style0['Spécialiste'], () => { multPrec *= 1.5; }, 'préc. x1,5');
  S1('kop', wins, () => { addPrec += 0.3 * wins; }, `+${dec1(0.3 * wins)} préc.`);
  S1('stat', seasonGoals, () => { addBase += 10 * seasonGoals; }, `+${10 * seasonGoals} base`);
  const nLines = Object.values(line0).filter(Boolean).length, nNat = new Set(ps.map(p => p.nat)).size;
  S1('tacticien', true, () => { addPrec += 0.6 * nLines; }, `+${dec1(0.6 * nLines)} préc.`);
  S1('selection', Object.values(natCount).some(k => k >= 2), () => { multPrec *= 1.5; }, 'préc. x1,5');
  const mec = Math.min(2, 1 + Math.max(0, G.budget) / 40);
  S1('mecene', mec > 1, () => { multPrec *= mec; }, `préc. x${dec1(mec)}`);
  S1('ultras', m.poss === 1, () => { multPrec *= 2.5; }, 'préc. x2,5');
  S1('ds', stars, () => { multPrec *= Math.pow(1.3, stars); }, `préc. x${dec1(Math.pow(1.3, stars))}`);
  S1('mister', true, () => { multPrec *= 2; }, 'préc. x2');
  S1('monde', true, () => { addPrec += nNat; }, `+${nNat} préc.`);
  if (hasStaff(G, 'video')) wallMult *= 0.9;
  if (m.nextPrec !== 1) { multPrec *= m.nextPrec; syn.push('Remontada : préc. x2'); }
  if (m.nextWall !== 1) { wallMult *= m.nextWall; syn.push('Pressing haut : mur -20 %'); }
  wallMult *= ruleWall(m);
  wallMult *= Math.pow(0.9, m.pressing);

  let best = null;
  if (!cands.length) best = { move: null, base: 0, prec: 0, danger: 0, lv: 0 };
  cands.forEach(k => {
    const mv = MOVES[k], lv = G.levels[k] || 0;
    const base = mv.base + 10 * lv + addBase;
    const prec = Math.round((mv.prec + 0.5 * lv + addPrec) * multPrec * (fx.moveMult[k] || 1) * 100) / 100;
    const danger = Math.round((sum + base) * prec);
    if (!best || danger > best.danger) best = { move: k, base, prec, danger, lv };
  });
  const wall = Math.round(m.wall * wallMult);
  // Le mur s'use : chaque tir arrêté retire son danger au prochain but ; le doublé demande en plus un mur entier.
  const need = Math.max(1, wall - (m.wear || 0));
  const goals = best.danger >= need + wall ? 2 : best.danger >= need ? 1 : 0;
  return { ...best, sum, wall, need, goals, syn, fatigueFree, techBonus, pressingAdd, ordered: ps.map(p => p.id), forces, fx, powers };
}

function playable(m, G, id) {
  return (m.fatigue[id] || 0) < fatigueLimit(G, m);
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
  if (ev.goals > 0) m.wear = 0; else if (ev.move) m.wear = (m.wear || 0) + Math.round(ev.danger * ev.fx.wear * (m.rule === 'sacchi' ? 0.5 : 1));
  if (ev.pressingAdd) m.pressing++;
  if (ev.techBonus) { m.changes++; m.techUsed = true; }
  m.nextWall = 1; m.nextPrec = 1;
  let sentOff = null;
  if (m.rule === 'arbitre' && ids.length === 5) sentOff = ids.slice().sort((a, b) => PLAYERS[b].r - PLAYERS[a].r)[0];
  ev.fx.red.forEach(id => { if (!sentOff && rng() < 0.125) sentOff = id; });
  res.sentOff = sentOff;
  m.changes += ev.fx.changes;
  if (goals > 0 && ev.fx.money) { res.money = ev.fx.money * goals; G.budget = Math.round((G.budget + res.money) * 10) / 10; }
  ids.forEach(id => {
    m.hand.splice(m.hand.indexOf(id), 1);
    if (!ev.fatigueFree.has(id)) m.fatigue[id] = (m.fatigue[id] || 0) + 1;
    if (id === sentOff || ev.fx.tired.has(id)) m.fatigue[id] = 99;
    if (m.fatigue[id] >= fatigueLimit(G, m)) m.out.push(id); else m.discard.push(id);
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
  const wage = Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10;
  const r = { wage, prime: 0, diff: 0, ticket: 0, comm: 0 };
  if (m.over === 'win') {
    r.prime = m.prime; r.diff = 2 * (m.goals - m.oppGoals); r.ticket = m.poss; r.comm = hasStaff(G, 'comm') ? 4 : 0;
  }
  r.total = Math.round((r.prime + r.diff + r.ticket + r.comm - wage) * 10) / 10;
  G.budget = Math.round((G.budget + r.total) * 10) / 10;
  return r;
}

/** Fin de campagne gagnée : jusqu'à 3 joueurs (meilleurs buteurs, hors joueurs de départ) entrent dans la collection. */
function campaignUnlocks(G, unlocked = []) {
  const pool = G.squad.filter(id => !PLAYERS[id].mid && !unlocked.includes(id));
  return pool.sort((a, b) => (G.goals[b] || 0) - (G.goals[a] || 0) || PLAYERS[b].r - PLAYERS[a].r).slice(0, 3);
}

function sellValue(G, id) { return Math.round((PLAYERS[id].price * 0.5 + (G.goals[id] || 0)) * 2) / 2; }

function rerollCost(G) { return 2 + G.rerolls; }

function booster() { return shuffle(Object.keys(MOVES).filter(k => MOVES[k].tier === 'commun')).slice(0, 4); }
function addMove(G, k, lv) { if (G.moves.length >= MOVE_SLOTS || G.moves.includes(k)) return false; G.moves.push(k); G.levels[k] = Math.max(G.levels[k] || 0, lv || 0); return true; }
function removeMove(G, k) { const i = G.moves.indexOf(k); if (i < 0) return false; G.moves.splice(i, 1); G.levels[k] = 0; return true; }

// Boutique du mercato : 2 entraîneurs et 2 mouvements (relançables), plus 3 boosters (un achat chacun).
const STAFF_WEIGHT = { commun: 60, rare: 28, epique: 10, legende: 3 };
function pickStaff(G, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const pool = Object.keys(STAFF).filter(k => !G.staff.includes(k) && !out.includes(k));
    if (!pool.length) break;
    const w = pool.map(k => STAFF_WEIGHT[STAFF[k].tier] * (STAFF[k].tier === 'commun' ? 1 : 1 + G.stage * 0.15));
    let r = rng() * w.reduce((a, b) => a + b, 0), j = 0;
    while (r > w[j]) { r -= w[j]; j++; }
    out.push(pool[j]);
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
  joueurs: { name: 'Joueurs', desc: 'Choisis 1 star parmi 3', price: G => 9 + G.stage },
  entrainement: { name: 'Entraînement', desc: 'Choisis 1 mouvement à faire monter de niveau parmi 3', price: () => 4 },
  consignes: { name: 'Consignes', desc: 'Choisis 1 consigne à usage unique parmi 3', price: () => 3 },
};
function packContent(G, kind) {
  if (kind === 'joueurs') {
    const cap = 84 + G.stage * 2 + (rng() < 0.08 ? 10 : 0);
    const pool = Object.values(PLAYERS).filter(p => !p.youth && !p.mid && !G.squad.includes(p.id) && p.r <= cap);
    return shuffle(pool.slice()).slice(0, 3).map(p => p.id);
  }
  if (kind === 'entrainement') return shuffle(G.moves.slice()).slice(0, 3);
  return shuffle(Object.keys(ITEMS)).slice(0, 3);
}
function sellStaffValue(k) { return Math.floor(STAFF[k].cost / 2); }


function wageTotal(G) { return Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10; }
function ruleWall(m) { return m.rule === 'derby' ? 1.2 : m.rule === 'mourinho' ? 1.5 : 1; }
function wallNow(m, G) { return Math.round(m.wall * ruleWall(m) * Math.pow(0.9, m.pressing) * (hasStaff(G, 'video') ? 0.9 : 1)); }

export {
  LINES, NATIONS, CLUBS, PLAYERS, force, cardForce, MOVES, STARTER, starterPack, MOVE_SLOTS, TIER_PRICE, STAFF, STAFF_SLOTS, ITEMS, RULES, SEASON, CAMPAIGNS, campaignOf, stageOf, seasonLength, campaignUnlocks,
  setRng, shuffle, newGame, newMatch, evaluate, playAction, changeCards, settle, makeOffer, playable, useItem,
  sellValue, rerollCost, PACKS, packContent, sellStaffValue, price, booster, addMove, removeMove, movePrice, hasStaff, fatigueLimit, wageTotal, wallNow,
};
