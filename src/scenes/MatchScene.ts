// Écran de match : barre latérale de calcul, staff et consignes, terrain, mouvements et main de cartes.
import Phaser from 'phaser';
import {
  SEASON, RULES, STAFF, ITEMS, MOVES, CLUBS, PLAYERS, newMatch, evaluate, playAction, changeCards, useItem,
  settle, fatigueLimit, wallNow,
} from '../game/logic.js';
import { drawField, actorsFor, PITCH_W, PITCH_H } from '../game/art';
import { S } from '../game/state';
import { W, H, C, hex, txt, big, panel, Button, backdrop, crt, modal, floatText, fmt, dec } from '../ui/theme';
import { CardView, shortName, cardTip } from '../ui/Card';
import { tip, wasLongPress } from '../ui/Tooltip';
import { moveBadge, staffBadge, itemBadge, moveTip, staffTip, itemTip } from '../ui/icons';

const SB_X = 16, SB_W = 280;          // barre latérale
const RX = 312;                       // début de la zone droite
const HAND_CX = 770, HAND_Y = 546;    // centre de la main
const DECK_X = 1238, DECK_Y = 678;

export class MatchScene extends Phaser.Scene {
  views: CardView[] = [];
  sel: string[] = [];
  busy = false;
  ui: Record<string, any> = {};
  pitchTex!: Phaser.Textures.CanvasTexture;
  pitchState: { actors: any; ball: any; flash: number } = { actors: null, ball: { x: 120, y: 68 }, flash: 0 };
  oppColor = '#c8102e';
  lastSyn: string[] = [];
  t = 0;

  constructor() { super('match'); }

  create() {
    const G = S.G;
    S.M = newMatch(G);
    const M = S.M;
    this.views = []; this.sel = []; this.busy = false; this.ui = {};
    this.oppColor = (CLUBS as any)[M.opp][0] === '#f4f4f4' ? '#e9e9e9' : (CLUBS as any)[M.opp][0];
    backdrop(this, M.rule ? 0x40182a : 0x18402a);
    this.cameras.main.fadeIn(250, 13, 15, 24);
    this.buildSidebar();
    this.buildTop();
    this.buildPitch();
    this.buildMoves();
    this.buildButtons();
    this.syncHand(true);
    this.refresh();
    crt(this);
    this.intro();
  }

  // ---------- construction ----------
  buildSidebar() {
    const M = S.M, s = SEASON[S.G.stage], u = this.ui;
    panel(this, SB_X, 16, SB_W, 76, M.rule ? C.red : C.panel);
    txt(this, SB_X + 14, 24, `${s.comp} · ${s.label}`.toUpperCase(), 13, C.cream);
    u.opp = big(this, SB_X + 14, 50, M.opp.toUpperCase(), 14, C.cream, { wordWrap: { width: SB_W - 28 } });
    if (M.rule) {
      u.opp.setY(46);
      txt(this, SB_X + 14, 70, 'Règle : ' + RULES[M.rule].name, 14, C.gold);
    }
    panel(this, SB_X, 104, SB_W, 86);
    txt(this, SB_X + 14, 112, 'MUR DU GARDIEN', 13, C.muted);
    u.wall = big(this, SB_X + 14, 134, '0', 26, C.gold);
    u.wall2 = txt(this, SB_X + 14, 168, '', 13, C.muted);
    panel(this, SB_X, 202, SB_W, 96);
    txt(this, SB_X + 14, 210, 'OLYMPIQUE', 13, C.sky); txt(this, SB_X + SB_W - 14, 210, M.opp.toUpperCase().slice(0, 16), 13, C.red).setOrigin(1, 0);
    u.gUs = big(this, SB_X + 70, 248, '0', 34, C.cream).setOrigin(0.5);
    big(this, SB_X + SB_W / 2, 248, '-', 24, C.muted).setOrigin(0.5);
    u.gOpp = big(this, SB_X + SB_W - 70, 248, '0', 34, C.cream).setOrigin(0.5);
    u.need = txt(this, SB_X + SB_W / 2, 280, '', 13, C.muted).setOrigin(0.5);
    // bloc de calcul
    panel(this, SB_X, 310, SB_W, 214);
    txt(this, SB_X + 14, 318, 'ACTION EN COURS', 13, C.muted);
    u.move = big(this, SB_X + 14, 340, '', 11, C.sky, { wordWrap: { width: SB_W - 28 } });
    const g = this.add.graphics();
    g.fillStyle(C.edge, 1).fillRect(SB_X + 12, 370, 116, 52).fillRect(SB_X + SB_W - 128, 370, 116, 52);
    g.fillStyle(C.sky, 1).fillRect(SB_X + 14, 372, 112, 48);
    g.fillStyle(C.red, 1).fillRect(SB_X + SB_W - 126, 372, 112, 48);
    u.chips = big(this, SB_X + 70, 397, '0', 18, C.cream, { stroke: hex(C.edge), strokeThickness: 4 }).setOrigin(0.5);
    big(this, SB_X + SB_W / 2, 397, '×', 18, C.cream).setOrigin(0.5);
    u.mult = big(this, SB_X + SB_W - 70, 397, '0', 18, C.cream, { stroke: hex(C.edge), strokeThickness: 4 }).setOrigin(0.5);
    txt(this, SB_X + 70, 428, 'notes + base', 12, C.muted).setOrigin(0.5, 0);
    txt(this, SB_X + SB_W - 70, 428, 'précision', 12, C.muted).setOrigin(0.5, 0);
    g.fillStyle(C.edge, 1).fillRect(SB_X + 12, 448, SB_W - 24, 46);
    u.danger = big(this, SB_X + SB_W / 2, 472, '0', 22, C.red, { stroke: hex(C.edge), strokeThickness: 5 }).setOrigin(0.5);
    u.verdict = txt(this, SB_X + SB_W / 2, 500, '', 14, C.muted).setOrigin(0.5, 0);
    // possessions et changements
    panel(this, SB_X, 536, SB_W, 76);
    txt(this, SB_X + 14, 544, 'POSSESSIONS', 13, C.muted);
    u.poss = this.add.graphics();
    txt(this, SB_X + SB_W - 14, 544, 'CHANGEMENTS', 13, C.muted).setOrigin(1, 0);
    u.chg = big(this, SB_X + SB_W - 14, 570, '0', 20, C.red).setOrigin(1, 0);
    panel(this, SB_X, 624, SB_W, 80);
    txt(this, SB_X + 14, 632, 'BUDGET', 13, C.muted);
    u.budget = big(this, SB_X + 14, 656, fmt(S.G.budget), 14, C.green);
    u.syn = txt(this, SB_X + SB_W - 14, 640, '', 14, C.gold).setOrigin(1, 0);
    tip(u.syn, () => ({ title: 'Bonus de l\'action', lines: this.lastSyn.length ? this.lastSyn : ['Aucun bonus'], accent: C.gold }));
    tip(this.add.rectangle(SB_X, 104, SB_W, 86, 0, 0).setOrigin(0), () => ({ title: 'Mur du gardien', lines: ['Danger à atteindre pour marquer 1 but.', 'Deux fois le mur : doublé.', 'Le staff, le pressing et certaines règles le font varier.'] }));
    tip(this.add.rectangle(SB_X, 310, SB_W, 214, 0, 0).setOrigin(0), () => ({ title: 'Calcul du danger', lines: ['(notes des joueurs + base du mouvement) × précision.', 'Les bonus (club, nationalité, génération, styles, staff) ajoutent de la base ou de la précision.'], accent: C.sky }));
  }

  buildTop() {
    const G = S.G;
    for (let i = 0; i < 4; i++) {
      const x = RX + i * 150;
      panel(this, x, 16, 140, 96, G.staff[i] ? C.cream : C.panel, G.staff[i] ? C.green : C.panel2);
      if (G.staff[i]) {
        const k = G.staff[i], st = (STAFF as any)[k];
        this.add.image(x + 70, 46, staffBadge(this, k, 44));
        txt(this, x + 70, 74, st.name, 14, C.ink, { align: 'center', wordWrap: { width: 130 } }).setOrigin(0.5, 0).setLineSpacing(-4);
        tip(this.add.rectangle(x, 16, 140, 96, 0, 0).setOrigin(0), () => staffTip(k));
      } else txt(this, x + 70, 64, 'Staff\nplace libre', 13, C.muted, { align: 'center' }).setOrigin(0.5);
    }
    this.ui.items = this.add.container(0, 0);
    this.drawItems();
  }

  drawItems() {
    const G = S.G, box = this.ui.items as Phaser.GameObjects.Container;
    box.removeAll(true);
    for (let i = 0; i < 3; i++) {
      const x = 922 + i * 114, k = G.items[i];
      const pg = panel(this, x, 16, 104, 96, k ? C.sky : C.panel, k ? 0x9fd0f5 : C.panel2);
      box.add(pg);
      if (k) {
        const it = (ITEMS as any)[k];
        box.add(this.add.image(x + 52, 46, itemBadge(this, k, 44)));
        box.add(txt(this, x + 52, 74, it.name, 13, C.ink, { align: 'center', wordWrap: { width: 98 } }).setOrigin(0.5, 0).setLineSpacing(-4));
        const hit = this.add.rectangle(x, 16, 104, 96, 0, 0).setOrigin(0).setInteractive({ useHandCursor: true });
        tip(hit, () => itemTip(k, true));
        hit.on('pointerup', () => { if (!wasLongPress(hit)) this.useItem(k, x + 52); });
        box.add(hit);
      } else box.add(txt(this, x + 52, 64, 'Consigne\nlibre', 12, C.muted, { align: 'center' }).setOrigin(0.5));
    }
  }

  buildPitch() {
    panel(this, RX, 124, 482, 272, C.edge);
    if (this.textures.exists('pitch')) this.textures.remove('pitch');
    this.pitchTex = this.textures.createCanvas('pitch', PITCH_W, PITCH_H)!;
    this.ui.pitch = this.add.image(RX + 1, 124, 'pitch').setOrigin(0).setDisplaySize(480, 272);
  }

  buildMoves() {
    panel(this, 806, 124, 458, 272);
    this.ui.movesTitle = txt(this, 820, 132, '', 13, C.muted);
    this.ui.moves = this.add.container(0, 0);
  }

  buildButtons() {
    this.ui.btnChange = new Button(this, 640, 684, 230, 46, 'Changement', C.red, () => this.change());
    this.ui.btnPlay = new Button(this, 936, 684, 260, 46, 'Jouer l\'action', C.sky, () => this.play());
    const g = this.add.graphics();
    for (let i = 3; i >= 0; i--) { g.fillStyle(C.edge, 1).fillRect(DECK_X - 22 + i * 2, DECK_Y - 30 - i * 2, 44, 60); g.fillStyle(C.red, 1).fillRect(DECK_X - 20 + i * 2, DECK_Y - 28 - i * 2, 40, 56); }
    g.fillStyle(C.gold, 1).fillRect(DECK_X - 20, DECK_Y - 8, 40, 14);
    this.ui.deck = txt(this, 1264, 416, '', 12, C.muted).setOrigin(1, 0);
    this.ui.deckN = big(this, DECK_X, DECK_Y - 1, '', 10, C.ink).setOrigin(0.5);
    this.ui.out = txt(this, RX, 416, '', 12, C.muted).setWordWrapWidth(640);
  }

  // ---------- main ----------
  syncHand(initial = false) {
    const M = S.M;
    const keep: CardView[] = [];
    this.views.forEach(v => {
      if (M.hand.includes(v.id)) keep.push(v);
      else { v.sway = false; v.disableInteractive(); this.tweens.add({ targets: v, x: W + 120, y: 300, angle: 40, duration: 320, ease: 'Quad.in', onComplete: () => v.destroy() }); }
    });
    let delay = 0;
    M.hand.forEach((id: string) => {
      if (keep.some(v => v.id === id)) return;
      const v = new CardView(this, DECK_X, DECK_Y, id);
      v.setScale(0.5).setDepth(10);
      v.sway = false;
      this.tweens.add({ targets: v, scale: 1, duration: 220, delay: delay, onComplete: () => { v.sway = true; } });
      delay += initial ? 70 : 90;
      v.setInteractive({ useHandCursor: true });
      v.on('pointerover', () => { v.hovered = true; });
      v.on('pointerout', () => { v.hovered = false; });
      tip(v, () => cardTip(v.id, [`Fatigue : ${S.M.fatigue[v.id] || 0} action(s) sur ${fatigueLimit(S.G)}`]));
      v.on('pointerup', () => { if (!wasLongPress(v)) this.toggle(v.id); });
      keep.push(v);
    });
    this.views = M.hand.map((id: string) => keep.find(v => v.id === id)!);
    const n = this.views.length, gap = Math.min(110, 840 / Math.max(n, 1));
    this.views.forEach((v, i) => {
      const k = i - (n - 1) / 2;
      v.setHome(HAND_CX + k * gap, HAND_Y + Math.abs(k) * Math.abs(k) * 1.3, k * 0.02);
      v.setDepth(10 + i);
      v.setFatigue(M.fatigue[v.id] || 0, fatigueLimit(S.G));
    });
  }

  toggle(id: string) {
    if (this.busy || !S.M.hand.includes(id)) return;
    const i = this.sel.indexOf(id);
    if (i >= 0) this.sel.splice(i, 1); else if (this.sel.length < 5) this.sel.push(id);
    else { this.cameras.main.shake(80, 0.002); return; }
    this.views.forEach(v => v.selected = this.sel.includes(v.id));
    this.refresh();
  }

  // ---------- affichage ----------
  refresh() {
    const G = S.G, M = S.M, u = this.ui;
    const wall = wallNow(M, G);
    const need = Math.max(1, wall - (M.wear || 0));
    u.wall.setText(String(need));
    u.wall2.setText(`${M.wear ? `Usé de ${M.wear} sur ${wall}` : `Mur entier`} · doublé à ${need + wall}`);
    u.gUs.setText(String(M.goals)); u.gOpp.setText(String(M.oppGoals));
    u.need.setText(`il te faut ${M.oppGoals + 1} buts`);
    const pg = u.poss as Phaser.GameObjects.Graphics; pg.clear();
    const tot = Math.max(M.possStart, M.poss);
    for (let i = 0; i < tot; i++) { const x = SB_X + 14 + i * 22, y = 570; pg.fillStyle(C.edge, 1).fillRect(x - 2, y - 2, 20, 24); pg.fillStyle(i < M.poss ? C.sky : C.panel2, 1).fillRect(x, y, 16, 20); }
    u.chg.setText(String(M.changes));
    u.budget.setText(fmt(G.budget));
    u.deckN.setText(String(M.deck.length));
    u.deck.setText(`Pioche ${M.deck.length} · Défausse ${M.discard.length}`);
    u.out.setText(M.out.length ? `Fatigués : ${M.out.map((id: string) => shortName((PLAYERS as any)[id])).join(', ')}` : '');
    const ev: any = this.sel.length ? evaluate(this.sel, M, G) : null;
    this.showCalc(ev);
    this.drawMoves(ev ? ev.move : null);
    u.btnPlay.setEnabled(this.sel.length > 0 && !this.busy).setLabel(this.sel.length ? `Jouer l'action (${this.sel.length})` : 'Jouer l\'action');
    u.btnChange.setEnabled(this.sel.length > 0 && this.sel.length <= 4 && M.changes > 0 && !this.busy).setLabel(`Changement (${M.changes})`);
  }

  showCalc(ev: any) {
    const u = this.ui;
    if (!ev) {
      u.move.setText('Choisis 1 à 5 joueurs'); u.chips.setText('0'); u.mult.setText('0'); u.danger.setText('0');
      u.verdict.setText('').setColor(hex(C.muted)); u.syn.setText(''); this.lastSyn = []; return;
    }
    u.move.setText(ev.move ? (MOVES as any)[ev.move].name.toUpperCase() + (ev.lv ? ` niv.${ev.lv + 1}` : '') : 'AUCUN MOUVEMENT');
    u.chips.setText(String(ev.sum + ev.base)); u.mult.setText(dec(ev.prec)); u.danger.setText(String(ev.danger));
    u.verdict.setText(!ev.move ? 'Aucun de tes mouvements ne correspond' : ev.goals === 2 ? 'DOUBLÉ !' : ev.goals ? 'BUT !' : `Arrêté, il faut ${ev.need}`)
      .setColor(hex(ev.goals ? C.green : C.muted));
    this.lastSyn = ev.syn;
    u.syn.setText(ev.syn.length ? `${ev.syn.length} bonus (détail)` : '');
  }

  drawMoves(active: string | null) {
    const G = S.G;
    if (!this.ui.moveRows) {
      this.ui.movesTitle.setText(`TES MOUVEMENTS (${G.moves.length}/6)`);
      this.ui.moveRows = G.moves.map((k: string, i: number) => {
        const mv = (MOVES as any)[k], lv = G.levels[k] || 0, y = 154 + i * 39;
        const g = this.add.graphics();
        this.add.image(838, y + 17, moveBadge(this, k, 30));
        const name = txt(this, 862, y + 6, mv.name + (lv ? `  niv.${lv + 1}` : ''), 16, C.cream);
        const sc = big(this, 1244, y + 18, `${mv.base + 10 * lv}×${dec(mv.prec + 0.5 * lv)}`, 10, C.cream2).setOrigin(1, 0.5);
        tip(this.add.rectangle(818, y, 434, 35, 0, 0).setOrigin(0), () => moveTip(k, lv));
        return { k, y, g, name, sc };
      });
    }
    this.ui.moveRows.forEach((r: any) => {
      const on = r.k === active;
      r.g.clear().fillStyle(on ? 0x2f5a3a : C.panel2, 1).fillRect(818, r.y, 434, 35).fillStyle(on ? C.green : C.muted, 1).fillRect(818, r.y, 5, 35);
      r.name.setColor(hex(on ? C.gold : C.cream)); r.sc.setColor(hex(on ? C.gold : C.cream2));
    });
  }

  update(time: number) {
    this.t++;
    this.views.forEach(v => v.active && v.tick(time));
    const p = this.pitchState;
    drawField(this.pitchTex.getContext(), this.oppColor, p.actors, p.ball, this.t, p.flash);
    this.pitchTex.refresh();
    if (p.flash > 0) p.flash = Math.max(0, p.flash - 0.04);
  }

  // ---------- actions ----------
  intro() {
    const G = S.G, M = S.M, s = SEASON[G.stage];
    this.busy = true;
    const { layer, close } = modal(this, 640, M.rule ? 400 : 290);
    const top = M.rule ? 180 : 230;
    layer.add(txt(this, W / 2, top, `${s.comp} · ${s.label} · match ${G.stage + 1}/9`.toUpperCase(), 14, C.muted).setOrigin(0.5));
    layer.add(big(this, W / 2, top + 36, s.boss ? 'MATCH SPÉCIAL' : 'COUP D\'ENVOI', 22).setOrigin(0.5));
    layer.add(txt(this, W / 2, top + 76, `Olympique contre ${M.opp}`, 20).setOrigin(0.5));
    layer.add(txt(this, W / 2, top + 108, `${M.opp} annonce ${M.oppGoals} but${M.oppGoals > 1 ? 's' : ''}. Marques-en ${M.oppGoals + 1} en ${M.poss} possessions.`, 16, C.cream2).setOrigin(0.5));
    layer.add(txt(this, W / 2, top + 134, `Mur du gardien : ${wallNow(M, G)}. Chaque tir arrêté l'use jusqu'au but.${M.ossature ? `  Ossature ${M.ossature} : +1 possession.` : ''}`, 16, C.cream2).setOrigin(0.5));
    if (M.rule) {
      const r = (RULES as any)[M.rule];
      layer.add(panel(this, W / 2 - 260, top + 160, 520, 60, C.red, C.gold));
      layer.add(txt(this, W / 2, top + 172, 'RÈGLE : ' + r.name.toUpperCase(), 16, C.gold).setOrigin(0.5, 0));
      layer.add(txt(this, W / 2, top + 194, r.desc, 15).setOrigin(0.5, 0));
    }
    layer.add(new Button(this, W / 2, top + (M.rule ? 262 : 172), 220, 50, 'Jouer', C.gold, () => { close(); this.busy = false; this.refresh(); }, 20));
  }

  useItem(k: string, x: number) {
    if (this.busy) return;
    if (useItem(k, S.M, S.G)) {
      floatText(this, x, 120, (ITEMS as any)[k].name, C.sky, 12);
      this.drawItems(); this.syncHand(); this.refresh();
      if (S.M.over) this.time.delayedCall(400, () => this.endMatch());
    } else this.cameras.main.shake(80, 0.003);
  }

  change() {
    if (this.busy) return;
    if (changeCards(this.sel.slice(), S.M)) {
      this.sel = []; this.syncHand(); this.refresh();
    }
  }

  play() {
    if (this.busy || !this.sel.length) return;
    const G = S.G, M = S.M, u = this.ui;
    const ev: any = evaluate(this.sel, M, G);
    const ids = this.sel.slice();
    this.busy = true; this.refresh();
    const views = ev.ordered.map((id: string) => this.views.find(v => v.id === id)!);
    // 1. décompte carte par carte
    let sum = 0, step = 0;
    u.chips.setText('0');
    const decDouble: Record<string, number> = {};
    ev.ordered.forEach((id: string) => { const p = (PLAYERS as any)[id]; decDouble[p.dec] = (decDouble[p.dec] || 0) + 1; });
    views.forEach((v: CardView, i: number) => {
      this.time.delayedCall(260 * i, () => {
        const p = v.p;
        let r = p.r;
        if (M.rule === 'catenaccio' && p.pos === 'ATT') r = Math.floor(r / 2);
        if (decDouble[p.dec] >= 2 && !p.youth) r += 5;
        sum += r;
        u.chips.setText(String(sum));
        this.tweens.add({ targets: v, scale: 1.14, duration: 90, yoyo: true });
        this.tweens.add({ targets: u.chips, scale: 1.3, duration: 80, yoyo: true });
        floatText(this, v.x, v.y - 110, '+' + r, C.sky, 18);
      });
      step = 260 * (i + 1);
    });
    // 2. base du mouvement et bonus
    const synDelay = 240;
    this.time.delayedCall(step, () => {
      u.chips.setText(String(ev.sum + ev.base));
      this.tweens.add({ targets: u.chips, scale: 1.35, duration: 90, yoyo: true });
      if (ev.move) floatText(this, SB_X + 70, 370, (MOVES as any)[ev.move].name, C.gold, 11);
    });
    ev.syn.forEach((s: string, i: number) => this.time.delayedCall(step + synDelay * (i + 1), () => {
      floatText(this, RX + 240, 170 + (i % 4) * 26, s, s.startsWith('Ego :') ? C.red : C.gold, 10);
    }));
    step += synDelay * (ev.syn.length + 1);
    // 3. précision et danger
    this.time.delayedCall(step, () => {
      u.mult.setText(dec(ev.prec));
      this.tweens.add({ targets: u.mult, scale: 1.4, duration: 100, yoyo: true });
      const counter = { v: 0 };
      this.tweens.add({
        targets: counter, v: ev.danger, duration: 500, ease: 'Cubic.out',
        onUpdate: () => u.danger.setText(String(Math.round(counter.v))),
        onComplete: () => { this.tweens.add({ targets: u.danger, scale: 1.3, duration: 100, yoyo: true }); this.cameras.main.shake(120, Math.min(0.012, ev.danger / 400000)); },
      });
    });
    step += 650;
    // 4. action sur le terrain puis résultat
    this.time.delayedCall(step, () => this.animatePitch(ev, () => {
      const res = playAction(ids, M, G);
      this.result(res);
    }));
  }

  animatePitch(ev: any, done: () => void) {
    const actors = actorsFor(ev.ordered);
    const path = actors.map(a => ({ x: a.x + 3, y: a.y - 1 }));
    const target = ev.goals > 0 ? { x: 238, y: 60 + Math.floor(Math.random() * 16) } : { x: 226, y: 68 };
    path.push(target);
    this.pitchState.actors = actors;
    const ball = { x: path[0].x, y: path[0].y };
    this.pitchState.ball = ball;
    const tl = this.tweens.chain({
      targets: ball,
      tweens: path.slice(1).map((pt, i) => ({ x: pt.x, y: pt.y, duration: i === path.length - 2 ? 220 : 240, ease: 'Sine.inOut', onUpdate: () => actors.forEach(a => a.x += 0.3) })),
      onComplete: () => done(),
    });
    void tl;
  }

  result(res: any) {
    const M = S.M;
    this.sel = [];
    const label = res.scored === 2 ? 'DOUBLÉ !!' : res.scored === 1 ? 'BUT !!' : res.cancelled ? 'BUT ANNULÉ' : 'ARRÊT !';
    const cx = RX + 241, cy = 260;
    if (res.scored) {
      this.pitchState.flash = 0.8;
      this.cameras.main.shake(300, 0.012);
      this.burst(cx + 150, cy);
      this.tweens.add({ targets: this.ui.gUs, scale: 1.8, duration: 150, yoyo: true, ease: 'Back.out' });
    } else this.cameras.main.shake(100, 0.003);
    const t = big(this, cx, cy, label, res.scored ? 44 : 26, res.scored ? C.gold : C.cream, { stroke: hex(C.red), strokeThickness: res.scored ? 8 : 0, shadow: { offsetX: 5, offsetY: 5, color: '#07080e', fill: true } }).setOrigin(0.5).setDepth(300).setScale(0.2);
    this.tweens.add({ targets: t, scale: 1, duration: 260, ease: 'Back.out' });
    this.tweens.add({ targets: t, angle: { from: -3, to: 3 }, duration: 120, yoyo: true, repeat: 3 });
    if (res.scorer && res.scored) txt(this, cx, cy + 40, `${shortName((PLAYERS as any)[res.scorer])}`, 20, C.cream).setOrigin(0.5).setDepth(300).setData('tmp', 1);
    if (res.sentOff) floatText(this, cx, cy + 70, `${shortName((PLAYERS as any)[res.sentOff])} exclu`, C.red, 12);
    this.time.delayedCall(1200, () => {
      this.tweens.add({ targets: t, alpha: 0, duration: 200, onComplete: () => t.destroy() });
      this.children.list.filter(o => o.getData && o.getData('tmp')).forEach(o => o.destroy());
      this.pitchState.actors = null; this.pitchState.ball = { x: 120, y: 68 };
      this.views.forEach(v => v.selected = false);
      this.syncHand(); this.busy = false; this.refresh();
      if (M.over) this.time.delayedCall(500, () => this.endMatch());
    });
  }

  burst(x: number, y: number) {
    if (!this.textures.exists('px')) { const g = this.make.graphics({}, false); g.fillStyle(0xffffff, 1).fillRect(0, 0, 6, 6); g.generateTexture('px', 6, 6); g.destroy(); }
    const em = this.add.particles(x, y, 'px', {
      speed: { min: 120, max: 520 }, angle: { min: 0, max: 360 }, lifespan: { min: 400, max: 1000 }, scale: { start: 1.4, end: 0 },
      gravityY: 500, tint: [C.gold, C.red, 0xffffff, C.sky], quantity: 70, emitting: false,
    }).setDepth(290);
    em.explode(90);
    this.time.delayedCall(1200, () => em.destroy());
  }

  endMatch() {
    const G = S.G, M = S.M;
    this.busy = true;
    const r = settle(M, G);
    const won = M.over === 'win';
    G.history.push({ stage: G.stage, opp: M.opp, us: M.goals, them: M.oppGoals, won });
    const last = G.stage === SEASON.length - 1;
    const { layer, close } = modal(this, 560, 420);
    const title = !won ? 'ÉLIMINÉ' : last ? 'CHAMPION D\'EUROPE !' : 'VICTOIRE';
    layer.add(big(this, W / 2, 180, title, 24, won ? C.gold : C.red).setOrigin(0.5));
    layer.add(txt(this, W / 2, 220, `Olympique ${M.goals} - ${M.oppGoals} ${M.opp}`, 20).setOrigin(0.5));
    const rows: [string, string][] = won && !last
      ? [['Prime de match', '+' + fmt(r.prime)], ['Écart de buts', '+' + fmt(r.diff)], ['Billetterie (possessions restantes)', '+' + fmt(r.ticket)], ...(r.comm ? [['Directeur commercial', '+' + fmt(r.comm)] as [string, string]] : []), ['Masse salariale', '-' + fmt(r.wage)], ['Budget', fmt(G.budget)]]
      : this.summary();
    rows.forEach(([a, b], i) => {
      layer.add(txt(this, W / 2 - 230, 260 + i * 28, a, 16, C.cream2, { fontStyle: '400' }));
      layer.add(txt(this, W / 2 + 230, 260 + i * 28, b, 16, i === rows.length - 1 ? C.gold : C.cream).setOrigin(1, 0));
    });
    if (won && !last) layer.add(new Button(this, W / 2, 570, 280, 52, 'Aller au mercato', C.gold, () => {
      close(); G.stage++; G.rerolls = 0; (S as any).makeOffer = true; this.cameras.main.fadeOut(250, 13, 15, 24); this.time.delayedCall(260, () => this.scene.start('mercato'));
    }, 20));
    else layer.add(new Button(this, W / 2, 570, 280, 52, 'Nouvelle saison', C.gold, () => { close(); this.scene.start('title'); }, 20));
    if (won) this.burst(W / 2, 160);
  }

  summary(): [string, string][] {
    const G = S.G;
    const top = Object.entries(G.goals as Record<string, number>).sort((a, b) => b[1] - a[1])[0];
    return [
      ['Matchs gagnés', `${G.history.filter((h: any) => h.won).length} / 9`],
      ['Meilleur buteur', top ? `${(PLAYERS as any)[top[0]].name} (${top[1]})` : 'personne'],
      ['Budget final', fmt(G.budget)],
    ];
  }
}
