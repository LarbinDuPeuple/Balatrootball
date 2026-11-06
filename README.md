# Balatrootball (nom de travail : Mercato)

Roguelike deckbuilder de football : on recrute des footballeurs, on enchaîne des mouvements et des combos (club, nationalité, génération, style) pour battre le mur du gardien adverse, et on gère le mercato entre les matchs.

## Lancer le jeu

```bash
npm install
npm run dev      # serveur local, ouvrir l'adresse affichée (aussi accessible depuis un téléphone sur le même wifi)
npm run build    # version de production dans dist/
```

Le jeu tourne sur [Phaser 3](https://phaser.io) en TypeScript, dans une scène fixe 1280×720 (16:9) agrandie pour remplir l'écran. Sur téléphone, il se joue en paysage.

## Organisation

- `src/game/logic.js` : toutes les règles (joueurs, mouvements, synergies, économie, saison). Aucun lien avec l'affichage.
- `src/game/art.ts` : dessin pixel art procédural (portraits, drapeaux, terrain, sprites).
- `src/ui/` : composants (cartes joueurs, tuiles, boutons, panneaux, fenêtres).
- `src/scenes/` : écran titre et booster, match, mercato.
- `scripts/sim.mjs` : simulation d'équilibrage (`npm run sim`).
- `scripts/e2e.mjs` : test de bout en bout dans Chromium (`npm run build && node scripts/e2e.mjs <dossier-captures>`).
- `prototype-v0/` : premier prototype en une page HTML, gardé pour référence.

Projet privé : les noms de vrais joueurs sont utilisés pour un usage personnel uniquement.
