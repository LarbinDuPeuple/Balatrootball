// Mercato entre deux matchs : joueurs, mouvements, staff, consignes, entraînement et effectif.
import Phaser from 'phaser';
import {
  stageOf, RULES, STAFF, STAFF_SLOTS, ITEMS, MOVES, PLAYERS, PACKS, packContent, sellStaffValue, makeOffer, rerollCost, sellValue, addMove, removeMove, movePrice, wageTotal, MOVE_SLOTS,
} from '../game/logic.js';
import { S } from '../game/state';
import { W, C, txt, big, panel, Button, backdrop, crt, modal, floatText, fmt, dec } from '../ui/theme';
import { CardView, shortName, cardTip } from '../ui/Card';
import { tip, hideTip, wasLongPress } from '../ui/Tooltip';
import { moveBadge, staffBadge, itemBadge, moveTip, staffTip, itemTip, STAFF_TIER_COLOR, STAFF_TIER_NAME } from '../ui/icons';
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
    const G = S.G, s = stageOf(G), R = this.root;
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
    add(txt(this, SB_X + 14, 318, s.coach ? `Boss : ${(RULES as any)[s.coach].coach}` : s.boss ? 'Match spécial avec une règle surprise' : `Match ${G.stage + 1} sur 9`, 14, s.boss ? C.red : C.muted));
    add(panel(this, SB_X, 366, SB_W, 130));
    add(txt(this, SB_X + 14, 374, `TES ENTRAÎNEURS (${G.staff.length}/${STAFF_SLOTS})`, 13, C.muted));
    for (let i = 0; i < STAFF_SLOTS; i++) {
      const k = G.staff[i], x = SB_X + 36 + i * 52;
      if (!k) { const g = add(this.add.graphics()); g.lineStyle(2, C.panel2, 1).strokeRect(x - 21, 393, 42, 42); continue; }
      const im = add(tip(this.add.image(x, 414, staffBadge(this, k, 44)), () => ({ ...staffTip(k), lines: [...staffTip(k).lines, 'Touche : revendre'] })));
      im.setInteractive({ useHandCursor: true }).on('pointerup', () => { if (!wasLongPress(im)) this.sellStaff(k); });
    }
    add(txt(this, SB_X + 14, 440, 'TES CONSIGNES', 13, C.muted));
    if (!G.items.length) add(txt(this, SB_X + 120, 440, 'aucune', 14, C.muted));
    G.items.forEach((k: string, i: number) => add(tip(this.add.image(SB_X + 30 + i * 40, 474, itemBadge(this, k, 32)), () => itemTip(k))));
    const rc = rerollCost(G);
    add(new Button(this, SB_X + SB_W / 2, 534, SB_W - 20, 46, `Relancer (${fmt(rc)})`, C.green, () => {
      if (G.budget < rc) return; G.budget = Math.round((G.budget - rc) * 10) / 10; G.rerolls++; makeOffer(G, true); this.render();
    })).setEnabled(G.budget >= rc);
    add(new Button(this, SB_X + SB_W / 2, 594, SB_W - 20, 46, 'Ton effectif', C.sky, () => this.squad()));
    const next = add(new Button(this, SB_X + SB_W / 2, 664, SB_W - 20, 56, 'Prochain match', C.gold, () => {
      this.cameras.main.fadeOut(250, 13, 15, 24); this.time.delayedCall(260, () => this.scene.start('match'));
    }, 20));
    next.setEnabled(G.budget >= 0);
    if (G.budget < 0) add(txt(this, SB_X + SB_W / 2, 698, 'Budget négatif : vends un joueur', 12, C.red).setOrigin(0.5, 0));

    // ----- boutique : 2 entraîneurs + 2 mouvements
    add(panel(this, RX, 16, 952, 330));
    add(txt(this, RX + 14, 24, 'BOUTIQUE', 13, C.muted));
    add(txt(this, RX + 952 - 14, 24, 'Relancer change la boutique, pas les boosters', 12, C.muted).setOrigin(1, 0));
    const cx = (i: number) => RX + 128 + i * 232, cy = 168;
    G.offer.staff.forEach((k: string | null, i: number) => {
      const x = cx(i);
      if (!k) { add(txt(this, x, cy, 'Signé', 18, C.green).setOrigin(0.5)); return; }
      const st = (STAFF as any)[k], col = STAFF_TIER_COLOR[st.tier];
      const card = add(new Tile(this, x, cy, 180, 236, 'Entraîneur ' + STAFF_TIER_NAME[st.tier].toLowerCase(), st.name, '', '', col));
      add(this.add.image(x + 4, cy + 30, staffBadge(this, k, 92)));
      tip(card, () => staffTip(k));
      add(new Button(this, x, 312, 150, 36, fmt(st.cost), C.gold, () => this.buy(st.cost, () => { G.staff.push(k); G.offer.staff[i] = null; }, x, 280), 16))
        .setEnabled(G.budget >= st.cost && G.staff.length < STAFF_SLOTS);
    });
    G.offer.moves.forEach((o: any, i: number) => {
      const x = cx(2 + i);
      if (!o) { add(txt(this, x, cy, 'Acheté', 18, C.green).setOrigin(0.5)); return; }
      const cost = movePrice(o.k, o.lv);
      const mt = add(moveTile(this, x, cy, 180, 236, o.k, o.lv, true));
      add(this.add.image(x, cy + 14, moveBadge(this, o.k, 64)));
      tip(mt, () => moveTip(o.k, o.lv));
      add(new Button(this, x, 312, 150, 36, fmt(cost), C.gold, () => this.buy(cost, () => { addMove(G, o.k, o.lv); G.offer.moves[i] = null; }, x, 280), 16))
        .setEnabled(G.budget >= cost && G.moves.length < MOVE_SLOTS);
    });
    if (G.staff.length >= STAFF_SLOTS) add(txt(this, cx(0) + 116, 340, '5 entraîneurs max : revends-en un (touche son portrait à gauche)', 12, C.red).setOrigin(0.5, 1));
    if (G.moves.length >= MOVE_SLOTS) add(txt(this, cx(2) + 116, 340, '6 mouvements max : retires-en un en bas', 12, C.red).setOrigin(0.5, 1));

    // ----- boosters
    add(panel(this, RX, 358, 952, 244));
    add(txt(this, RX + 14, 366, 'BOOSTERS', 13, C.muted));
    const PACK_COL: Record<string, number> = { joueurs: C.red, entrainement: C.gold, consignes: C.sky };
    Object.keys(PACKS).forEach((kind, i) => {
      const pk = (PACKS as any)[kind], x = RX + 90 + i * 316, y = 466, price = pk.price(G);
      const sold = G.offer.packs[kind];
      const full = kind === 'joueurs' ? G.squad.length >= 18 : kind === 'consignes' ? G.items.length >= 3 : false;
      const pc = add(this.add.container(x, y));
      const g = this.add.graphics();
      g.fillStyle(C.edge, 1).fillRect(-58, -78, 116, 156); g.fillStyle(sold ? C.panel2 : PACK_COL[kind], 1).fillRect(-55, -75, 110, 150);
      g.fillStyle(sold ? C.panel : C.cream, 1).fillRect(-55, -16, 110, 32);
      g.fillStyle(0xffffff, sold ? 0 : 0.25).fillRect(-55, -75, 110, 6);
      pc.add([g, big(this, 0, 1, pk.name.toUpperCase(), 8, sold ? C.muted : C.ink).setOrigin(0.5)]);
      if (!sold) this.tweens.add({ targets: pc, y: y - 5, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      pc.setSize(116, 156);
      tip(pc, () => ({ title: 'Booster ' + pk.name, lines: [pk.desc, `Prix : ${fmt(price)}`, 'Un seul achat par mercato'], accent: PACK_COL[kind] }));
      add(txt(this, x + 74, y - 60, pk.desc, 15, sold ? C.muted : C.cream2, { wordWrap: { width: 140 } }));
      const b = add(new Button(this, x + 145, y + 50, 130, 40, sold ? 'Ouvert' : fmt(price), C.gold, () => {
        if (G.budget < price) return;
        G.budget = Math.round((G.budget - price) * 10) / 10; G.offer.packs[kind] = true;
        this.render(); this.openPack(kind);
      }, 16));
      b.setEnabled(!sold && !full && G.budget >= price);
    });

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

  /** Ouverture d'un booster : le paquet tremble, les 3 cartes se retournent, on en garde une. */
  openPack(kind: string) {
    const G = S.G, content: string[] = packContent(G, kind), pk = (PACKS as any)[kind];
    const { layer, close } = modal(this, 900, 520);
    layer.add(big(this, W / 2, 140, 'Booster ' + pk.name, 20).setOrigin(0.5));
    layer.add(txt(this, W / 2, 180, pk.desc + '. Reste appuyé pour le détail.', 17, C.cream2).setOrigin(0.5));
    const packG = this.add.container(W / 2, 380);
    const pg = this.add.graphics();
    pg.fillStyle(C.edge, 1).fillRect(-83, -113, 166, 226); pg.fillStyle(kind === 'joueurs' ? C.red : kind === 'consignes' ? C.sky : C.gold, 1).fillRect(-80, -110, 160, 220);
    pg.fillStyle(C.cream, 1).fillRect(-80, -20, 160, 40);
    packG.add([pg, big(this, 0, 0, pk.name.toUpperCase(), 10, C.ink).setOrigin(0.5)]);
    layer.add(packG);
    const take = (id: string) => {
      if (kind === 'joueurs') { G.squad.push(id); G.signed = (G.signed || 0) + 1; }
      if (kind === 'entrainement') G.levels[id] = (G.levels[id] || 0) + 1;
      if (kind === 'consignes') G.items.push(id);
      hideTip(this); close(); this.time.delayedCall(140, () => this.render());
    };
    this.tweens.add({
      targets: packG, angle: { from: -5, to: 5 }, duration: 60, yoyo: true, repeat: 7, onComplete: () => {
        this.cameras.main.flash(220, 255, 240, 200); this.cameras.main.shake(120, 0.004);
        packG.destroy();
        content.forEach((id, i) => {
          const x = W / 2 - (content.length - 1) * 120 + i * 240, y = 380;
          let obj: any;
          if (kind === 'joueurs') { obj = new CardView(this, x, y, id); obj.sway = false; tip(obj, () => cardTip(id)); }
          else if (kind === 'entrainement') {
            const lv = G.levels[id] || 0, mv = (MOVES as any)[id];
            obj = new Tile(this, x, y, 180, 230, 'Séance', mv.name, '', `niv. ${lv + 1} → ${lv + 2}`, C.gold);
            obj.add(this.add.image(0, 10, moveBadge(this, id, 64)));
            tip(obj, () => ({ title: 'Entraînement : ' + mv.name, lines: [`${mv.base + 10 * lv} × ${dec(mv.prec + 0.5 * lv)} devient ${mv.base + 10 * (lv + 1)} × ${dec(mv.prec + 0.5 * (lv + 1))}`], accent: C.gold }));
          } else {
            const it = (ITEMS as any)[id];
            obj = new Tile(this, x, y, 180, 230, 'Consigne', it.name, '', '', C.sky);
            obj.add(this.add.image(0, 20, itemBadge(this, id, 64)));
            tip(obj, () => itemTip(id));
          }
          layer.add(obj); obj.setScale(0, 1);
          this.tweens.add({ targets: obj, scaleX: 1, duration: 240, delay: i * 160, ease: 'Back.out' });
          obj.setInteractive({ useHandCursor: true });
          obj.on('pointerup', () => { if (wasLongPress(obj)) return; this.tweens.add({ targets: obj, y: y - 30, scale: 1.1, duration: 150, onComplete: () => take(id) }); });
        });
        layer.add(new Button(this, W / 2, 600, 220, 40, 'Ne rien prendre', C.panel2, () => { hideTip(this); close(); this.time.delayedCall(140, () => this.render()); }, 15));
      },
    });
  }

  sellStaff(k: string) {
    const G = S.G, st = (STAFF as any)[k], v = sellStaffValue(k);
    const { layer, close } = modal(this, 520, 260);
    layer.add(this.add.image(W / 2, 290, staffBadge(this, k, 72)));
    layer.add(txt(this, W / 2, 340, `Revendre ${st.name} pour ${fmt(v)} ?`, 18).setOrigin(0.5));
    layer.add(new Button(this, W / 2 - 110, 400, 190, 44, 'Revendre', C.red, () => {
      G.staff.splice(G.staff.indexOf(k), 1); G.budget = Math.round((G.budget + v) * 10) / 10; close(); this.time.delayedCall(140, () => this.render());
    }, 16));
    layer.add(new Button(this, W / 2 + 110, 400, 190, 44, 'Garder', C.gold, () => close(), 16));
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
