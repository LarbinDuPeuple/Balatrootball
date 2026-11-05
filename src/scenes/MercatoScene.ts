// Mercato entre deux matchs : joueurs, mouvements, staff, consignes, entraînement et effectif.
import Phaser from 'phaser';
import {
  SEASON, STAFF, ITEMS, MOVES, PLAYERS, makeOffer, rerollCost, sellValue, addMove, removeMove, movePrice, wageTotal, MOVE_SLOTS,
} from '../game/logic.js';
import { S } from '../game/state';
import { W, C, txt, big, panel, Button, backdrop, crt, modal, floatText, fmt, dec } from '../ui/theme';
import { CardView, shortName, cardTip } from '../ui/Card';
import { tip, hideTip } from '../ui/Tooltip';
import { moveBadge, staffBadge, itemBadge, moveTip, staffTip, itemTip } from '../ui/icons';
import { Tile, moveTile, TIER_COLOR } from '../ui/tiles';

const SB_X = 16, SB_W = 280, RX = 312;

export class MercatoScene extends Phaser.Scene {
  root!: Phaser.GameObjects.Container;
  cards: CardView[] = [];
  constructor() { super('mercato'); }

  create() {
    if ((S as any).makeOffer) { makeOffer(S.G); (S as any).makeOffer = false; }
    backdrop(this, 0x2a2040);
    this.cameras.main.fadeIn(250, 13, 15, 24);
    this.root = this.add.container(0, 0);
    this.render();
    crt(this);
  }

  buy(cost: number, fn: () => void, x: number, y: number) {
    const G = S.G;
    if (G.budget < cost) return;
    G.budget = Math.round((G.budget - cost) * 10) / 10;
    fn();
    floatText(this, x, y, '-' + fmt(cost), C.red, 14);
    this.render();
  }

  render() {
    const G = S.G, s = SEASON[G.stage], R = this.root;
    R.removeAll(true); this.cards = []; hideTip(this);
    const add = <T extends Phaser.GameObjects.GameObject>(o: T) => { R.add(o); return o; };
    // ----- barre latérale
    add(panel(this, SB_X, 16, SB_W, 70, C.gold, C.edge));
    add(big(this, SB_X + SB_W / 2, 51, 'MERCATO', 20, C.ink).setOrigin(0.5));
    add(panel(this, SB_X, 98, SB_W, 112));
    add(txt(this, SB_X + 14, 106, 'BUDGET', 13, C.muted));
    add(big(this, SB_X + 14, 128, fmt(G.budget), 20, G.budget < 0 ? C.red : C.green));
    add(txt(this, SB_X + 14, 162, 'MASSE SALARIALE', 13, C.muted));
    add(txt(this, SB_X + 14, 180, `${fmt(wageTotal(G))} par match · ${G.squad.length}/18 joueurs`, 15));
    add(panel(this, SB_X, 222, SB_W, 132));
    add(txt(this, SB_X + 14, 230, 'PROCHAIN MATCH', 13, C.muted));
    add(txt(this, SB_X + 14, 250, `${s.comp} · ${s.label}`, 16, C.cream, { wordWrap: { width: SB_W - 28 } }));
    add(txt(this, SB_X + 14, 276, `Mur ${s.wall} · l'adversaire annonce ${s.opp} but${s.opp > 1 ? 's' : ''}`, 14, C.cream2, { wordWrap: { width: SB_W - 28 } }));
    add(txt(this, SB_X + 14, 318, s.boss ? 'Match spécial avec une règle surprise' : `Match ${G.stage + 1} sur 9`, 14, s.boss ? C.red : C.muted));
    add(panel(this, SB_X, 366, SB_W, 130));
    add(txt(this, SB_X + 14, 374, 'TON STAFF (PERMANENT)', 13, C.muted));
    if (!G.staff.length) add(txt(this, SB_X + 14, 400, 'Aucun', 14, C.muted));
    G.staff.forEach((k: string, i: number) => add(tip(this.add.image(SB_X + 36 + i * 50, 414, staffBadge(this, k, 40)), () => staffTip(k))));
    add(txt(this, SB_X + 14, 440, 'TES CONSIGNES', 13, C.muted));
    if (!G.items.length) add(txt(this, SB_X + 120, 440, 'aucune', 14, C.muted));
    G.items.forEach((k: string, i: number) => add(tip(this.add.image(SB_X + 30 + i * 40, 474, itemBadge(this, k, 32)), () => itemTip(k))));
    const rc = rerollCost(G);
    add(new Button(this, SB_X + SB_W / 2, 534, SB_W - 20, 46, `Relancer (${fmt(rc)})`, C.green, () => {
      if (G.budget < rc) return; G.budget = Math.round((G.budget - rc) * 10) / 10; G.rerolls++; makeOffer(G); this.render();
    })).setEnabled(G.budget >= rc);
    add(new Button(this, SB_X + SB_W / 2, 594, SB_W - 20, 46, 'Ton effectif', C.sky, () => this.squad()));
    const next = add(new Button(this, SB_X + SB_W / 2, 664, SB_W - 20, 56, 'Prochain match', C.gold, () => {
      this.cameras.main.fadeOut(250, 13, 15, 24); this.time.delayedCall(260, () => this.scene.start('match'));
    }, 20));
    next.setEnabled(G.budget >= 0);
    if (G.budget < 0) add(txt(this, SB_X + SB_W / 2, 698, 'Budget négatif : vends un joueur', 12, C.red).setOrigin(0.5, 0));

    // ----- joueurs à vendre
    add(panel(this, RX, 16, 650, 316));
    add(txt(this, RX + 14, 24, 'JOUEURS À VENDRE', 13, C.muted));
    G.offer.players.forEach((id: string, i: number) => {
      const x = RX + 85 + i * 160, p = (PLAYERS as any)[id];
      if (G.squad.includes(id)) { add(txt(this, x, 170, 'Recruté', 18, C.green).setOrigin(0.5)); return; }
      const tag = add(this.add.graphics()); tag.fillStyle(C.edge, 1).fillRect(x - 60, 44, 120, 26); tag.lineStyle(2, C.green, 1).strokeRect(x - 60, 44, 120, 26);
      add(big(this, x, 58, fmt(p.price), 10, C.green).setOrigin(0.5));
      const cv = add(new CardView(this, x, 168, id)); cv.setScale(0.78); cv.setHome(x, 168); this.cards.push(cv);
      tip(cv, () => cardTip(id));
      add(new Button(this, x, 300, 120, 36, 'Recruter', C.gold, () => this.buy(p.price, () => G.squad.push(id), x, 260), 15))
        .setEnabled(G.budget >= p.price && G.squad.length < 18);
    });
    // ----- entraînement
    add(panel(this, 974, 16, 290, 316));
    add(txt(this, 988, 24, 'ENTRAÎNEMENT', 13, C.muted));
    const train = G.offer.train.filter((k: string) => k && G.moves.includes(k));
    if (!train.length) add(txt(this, 988, 60, 'Plus de séance disponible.', 14, C.muted));
    G.offer.train.forEach((k: string, i: number) => {
      if (!k || !G.moves.includes(k)) return;
      const lv = G.levels[k], cost = 4 + lv * 2, y = 112 + i * 140;
      const mv = (MOVES as any)[k];
      const tl = add(new Tile(this, 1119, y, 262, 122, 'Séance', mv.name, '', `niv. ${lv + 1} → ${lv + 2}`, C.gold));
      add(this.add.image(1210, y - 18, moveBadge(this, k, 40)));
      tip(tl, () => ({ title: 'Entraînement : ' + mv.name, lines: [`Niveau ${lv + 1} → ${lv + 2}`, `${mv.base + 10 * lv} × ${dec(mv.prec + 0.5 * lv)} devient ${mv.base + 10 * (lv + 1)} × ${dec(mv.prec + 0.5 * (lv + 1))}`, `Prix : ${fmt(cost)}`], accent: C.gold }));
      add(new Button(this, 1206, y + 40, 90, 30, 'Acheter', C.gold, () => this.buy(cost, () => { G.levels[k]++; G.offer.train[i] = null; }, 1206, y), 13)).setEnabled(G.budget >= cost);
    });

    // ----- mouvements, staff, consignes
    add(panel(this, RX, 344, 952, 256));
    add(txt(this, RX + 14, 352, 'MOUVEMENTS', 13, C.muted));
    add(txt(this, RX + 334, 352, 'STAFF PERMANENT (4 PLACES)', 13, C.muted));
    add(txt(this, RX + 654, 352, 'CONSIGNES À USAGE UNIQUE (3 MAX)', 13, C.muted));
    const tw = 148, th = 170, ty = 460;
    const slot = (i: number) => RX + 14 + tw / 2 + i * 160;
    G.offer.moves.forEach((o: any, i: number) => {
      const x = slot(i);
      if (!o) { add(txt(this, x, ty, 'Acheté', 16, C.green).setOrigin(0.5)); return; }
      const cost = movePrice(o.k, o.lv);
      const mt = add(moveTile(this, x, ty, tw, th, o.k, o.lv, true));
      add(this.add.image(x, ty + 6, moveBadge(this, o.k, 52)));
      tip(mt, () => moveTip(o.k, o.lv));
      add(new Button(this, x, 572, 130, 32, `${fmt(cost)}`, C.gold, () => this.buy(cost, () => { addMove(G, o.k, o.lv); G.offer.moves[i] = null; }, x, 520), 14))
        .setEnabled(G.budget >= cost && G.moves.length < MOVE_SLOTS);
    });
    G.offer.staff.forEach((k: string, i: number) => {
      const x = slot(2 + i), st = (STAFF as any)[k];
      if (G.staff.includes(k)) { add(txt(this, x, ty, 'Signé', 16, C.green).setOrigin(0.5)); return; }
      const t = add(new Tile(this, x, ty, tw, th, 'Staff', st.name, '', '', C.green));
      add(this.add.image(x, ty + 22, staffBadge(this, k, 56)));
      tip(t, () => staffTip(k));
      add(new Button(this, x, 572, 130, 32, fmt(st.cost), C.gold, () => this.buy(st.cost, () => G.staff.push(k), x, 520), 14)).setEnabled(G.budget >= st.cost && G.staff.length < 4);
    });
    G.offer.items.forEach((k: string, i: number) => {
      const x = slot(4 + i);
      if (!k) { add(txt(this, x, ty, 'Acheté', 16, C.green).setOrigin(0.5)); return; }
      const it = (ITEMS as any)[k];
      const t = add(new Tile(this, x, ty, tw, th, 'Consigne', it.name, '', '', C.sky));
      add(this.add.image(x, ty + 22, itemBadge(this, k, 56)));
      tip(t, () => itemTip(k));
      add(new Button(this, x, 572, 130, 32, fmt(it.cost), C.gold, () => this.buy(it.cost, () => { G.items.push(k); G.offer.items[i] = null; }, x, 520), 14)).setEnabled(G.budget >= it.cost && G.items.length < 3);
    });
    if (G.moves.length >= MOVE_SLOTS) add(txt(this, RX + 14, 372, '6 mouvements max : retires-en un en bas pour en acheter', 12, C.red));

    // ----- mes mouvements
    add(panel(this, RX, 612, 952, 92));
    add(txt(this, RX + 14, 618, `TES MOUVEMENTS (${G.moves.length}/6)`, 13, C.muted));
    G.moves.forEach((k: string, i: number) => {
      const mv = (MOVES as any)[k], lv = G.levels[k] || 0, x = RX + 14 + i * 156, y = 640;
      const g = add(this.add.graphics());
      g.fillStyle(C.panel2, 1).fillRect(x, y, 148, 56); g.fillStyle(TIER_COLOR[mv.tier], 1).fillRect(x, y, 5, 56);
      add(this.add.image(x + 32, y + 28, moveBadge(this, k, 42)));
      add(big(this, x + 60, y + 20, `${mv.base + 10 * lv}`, 11, C.sky));
      add(big(this, x + 60, y + 38, `×${dec(mv.prec + 0.5 * lv)}`, 11, C.red));
      add(tip(this.add.rectangle(x, y, 118, 56, 0, 0).setOrigin(0), () => ({ ...moveTip(k, lv), lines: [...moveTip(k, lv).lines, 'Bouton × : retirer ce mouvement'] })));
      if (G.moves.length > 1) {
        const b = add(new Button(this, x + 134, y + 14, 22, 22, '×', C.red, () => { removeMove(G, k); this.render(); }, 14));
        void b;
      }
    });
  }

  squad() {
    const G = S.G;
    const { layer, close } = modal(this, 1220, 660);
    layer.add(big(this, W / 2, 62, `TON EFFECTIF (${G.squad.length}/18)`, 16).setOrigin(0.5));
    layer.add(txt(this, W / 2, 86, 'Vendre rapporte la moitié du prix, plus 1 M€ par but marqué cette saison. Minimum 8 joueurs.', 14, C.muted).setOrigin(0.5));
    const order = 'GDMA';
    const ids = G.squad.slice().sort((a: string, b: string) => order.indexOf((PLAYERS as any)[a].pos[0]) - order.indexOf((PLAYERS as any)[b].pos[0]) || (PLAYERS as any)[b].r - (PLAYERS as any)[a].r);
    ids.forEach((id: string, i: number) => {
      const col = i % 9, row = Math.floor(i / 9), x = 100 + col * 135, y = 200 + row * 250;
      const cv = new CardView(this, x, y, id); cv.setScale(0.7); cv.sway = false; layer.add(cv); tip(cv, () => cardTip(id));
      const goals = G.goals[id] || 0;
      if (goals) layer.add(txt(this, x, y + 70, `${goals} but${goals > 1 ? 's' : ''}`, 13, C.gold).setOrigin(0.5));
      const sell = new Button(this, x, y + 100, 120, 30, 'Vendre ' + fmt(sellValue(G, id)), C.red, () => {
        G.budget = Math.round((G.budget + sellValue(G, id)) * 10) / 10; G.squad.splice(G.squad.indexOf(id), 1);
        close(); this.render(); this.time.delayedCall(140, () => this.squad());
        floatText(this, x, y, `${shortName((PLAYERS as any)[id])} vendu`, C.green, 12);
      }, 12);
      sell.setEnabled(G.squad.length > 8); layer.add(sell);
    });
    layer.add(new Button(this, W / 2, 668, 200, 44, 'Fermer', C.gold, () => { close(); this.render(); }, 18));
  }
}
