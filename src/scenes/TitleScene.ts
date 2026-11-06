// Écran titre et booster de départ.
import Phaser from 'phaser';
import { newGame, booster, addMove, makeOffer, drawStarters, CAMPAIGNS, RULES, PLAYERS, STAFF, MOVES } from '../game/logic.js';
import { loadProfile } from '../game/profile';
import { drawField, PITCH_W, PITCH_H } from '../game/art';
import { S } from '../game/state';
import { W, C, big, txt, Button, backdrop, crt, modal, panel, onUpdate } from '../ui/theme';
import { moveTile } from '../ui/tiles';
import { CardView, CARD_W, CARD_H, cardTip } from '../ui/Card';
import { tip, wasLongPress, hideTip } from '../ui/Tooltip';
import { staffBadge, staffTip, STAFF_TIER_COLOR } from '../ui/icons';

export class TitleScene extends Phaser.Scene {
  constructor() { super('title'); }
  create() {
    backdrop(this);
    const logo = 'MERCATO';
    [...logo].forEach((ch, i) => {
      const l = big(this, W / 2 - (logo.length - 1) * 34 + i * 68, 120, ch, 60, C.gold, { stroke: '#e8573a', strokeThickness: 0, shadow: { offsetX: 6, offsetY: 6, color: '#e8573a', fill: true } }).setOrigin(0.5);
      this.tweens.add({ targets: l, y: 110, duration: 900, yoyo: true, repeat: -1, delay: i * 90, ease: 'Sine.inOut' });
    });
    txt(this, W / 2, 190, 'Recrute des légendes. Enchaîne les combos. Gagne la saison.', 22, C.sky).setOrigin(0.5);
    panel(this, W / 2 - 245, 228, 490, 278);
    if (this.textures.exists('titlePitch')) this.textures.remove('titlePitch');
    const tex = this.textures.createCanvas('titlePitch', PITCH_W, PITCH_H)!;
    this.add.image(W / 2, 367, 'titlePitch').setScale(2);
    let t = 0;
    onUpdate(this, () => { t++; drawField(tex.getContext(), '#c8102e', null, { x: 120 + Math.sin(t / 30) * 40, y: 68 + Math.cos(t / 23) * 20 }, t); tex.refresh(); });
    const prof = loadProfile();
    new Button(this, W / 2 - 160, 570, 300, 60, 'Nouvelle partie', C.gold, () => this.openCampaigns(), 22);
    new Button(this, W / 2 + 160, 570, 300, 60, `Collection (${prof.unlocked.length})`, C.sky, () => this.openCollection(), 22);
    txt(this, W / 2, 640, 'Bats le mur du gardien avec tes mouvements. Combine club, nationalité, génération et styles.', 15, C.muted).setOrigin(0.5);
    crt(this);
  }

  /** Nouvelle saison : choix d'un mouvement, puis tirage au sort de l'effectif. */
  startSeason(campaign: string) {
    const prof = loadProfile();
    S.G = newGame(campaign, { coaches: prof.coaches, unlocked: prof.unlocked });
    this.openMovePick();
  }

  /** Choix de la campagne : 9 campagnes, chacune se débloque en gagnant la précédente. */
  openCampaigns() {
    const prof = loadProfile();
    const { layer, close } = modal(this, 1220, 660);
    layer.add(big(this, W / 2, 52, 'Choisis ta campagne', 20).setOrigin(0.5));
    const cw = 390, ch = 192;
    CAMPAIGNS.forEach((c: any, i: number) => {
      const x = W / 2 + ((i % 3) - 1) * (cw + 8), y = 80 + Math.floor(i / 3) * (ch + 8);
      const open = !c.req || prof.won[c.req], won = prof.won[c.id] || 0;
      layer.add(panel(this, x - cw / 2, y, cw, ch, open ? C.panel2 : C.panel, open ? C.gold : C.edge));
      layer.add(big(this, x - cw / 2 + 16, y + 14, `${i + 1}`, 14, open ? C.gold : C.muted));
      layer.add(txt(this, x - cw / 2 + 46, y + 12, c.name.toUpperCase(), 16, open ? C.cream : C.muted, { wordWrap: { width: cw - 60 } }));
      const bosses = c.stages.filter((s: any) => s.coach).map((s: any) => (RULES as any)[s.coach].club);
      layer.add(txt(this, x - cw / 2 + 16, y + 44, bosses.length ? 'Boss : ' + bosses.join(', ') : c.desc, 14, open ? (bosses.length ? C.red : C.cream2) : C.muted, { wordWrap: { width: cw - 32 } }));
      const rewards = c.stages.filter((s: any) => s.coach).map((s: any) => (STAFF as any)[(RULES as any)[s.coach].unlock]?.name).filter(Boolean);
      if (rewards.length) layer.add(txt(this, x - cw / 2 + 16, y + 96, 'À débloquer : ' + rewards.join(', '), 13, open ? C.sky : C.muted, { wordWrap: { width: cw - 32 } }));
      layer.add(txt(this, x - cw / 2 + 16, y + ch - 34, open ? (won ? `Gagnée ${won} fois` : 'Pas encore gagnée') : `Gagne « ${CAMPAIGNS.find((o: any) => o.id === c.req)!.name} »`, 13, open ? (won ? C.green : C.muted) : C.muted, { wordWrap: { width: 210 } }));
      const b = new Button(this, x + cw / 2 - 74, y + ch - 30, 124, 40, open ? 'Jouer' : 'Fermée', open ? C.gold : C.panel2, () => { close(); this.time.delayedCall(140, () => this.startSeason(c.id)); }, 17);
      b.setEnabled(!!open); layer.add(b);
    });
    layer.add(new Button(this, W / 2 + 570, 52, 50, 44, '✕', C.red, () => close(), 20));
  }

  /** Collection : joueurs débloqués et entraîneurs célèbres. */
  openCollection(tab: 'joueurs' | 'coachs' = 'joueurs') {
    const prof = loadProfile();
    const { layer, close } = modal(this, 1160, 640);
    const famous = Object.keys(STAFF).filter(k => !(STAFF as any)[k].group);
    const mine = famous.filter(k => !(STAFF as any)[k].unlock || prof.coaches.includes(k));
    layer.add(big(this, W / 2, 66, 'Ta collection', 20).setOrigin(0.5));
    const swap = (t: 'joueurs' | 'coachs') => { hideTip(this); layer.destroy(); this.children.list.filter((o: any) => o.depth === 499).forEach(o => o.destroy()); this.openCollection(t); };
    layer.add(new Button(this, W / 2 - 150, 112, 270, 42, `Joueurs (${prof.unlocked.length})`, tab === 'joueurs' ? C.gold : C.panel2, () => tab !== 'joueurs' && swap('joueurs'), 16));
    layer.add(new Button(this, W / 2 + 150, 112, 270, 42, `Entraîneurs (${mine.length}/${famous.length})`, tab === 'coachs' ? C.gold : C.panel2, () => tab !== 'coachs' && swap('coachs'), 16));
    if (tab === 'joueurs') {
      layer.add(txt(this, W / 2, 152, 'Gagne une campagne : tes meilleurs buteurs entrent ici et peuvent sortir au tirage de départ.', 16, C.cream2).setOrigin(0.5));
      const ids = prof.unlocked.filter(id => (PLAYERS as any)[id]);
      if (!ids.length) layer.add(txt(this, W / 2, 360, 'Aucun joueur pour l\'instant.', 20, C.muted).setOrigin(0.5));
      const per = 9, sc = 0.72, gx = 118, gy = 146;
      ids.slice(0, 27).forEach((id, i) => {
        const inRow = Math.min(per, Math.min(ids.length, 27) - Math.floor(i / per) * per);
        const v = new CardView(this, W / 2 - (inRow - 1) * gx / 2 + (i % per) * gx, 252 + Math.floor(i / per) * gy, id);
        v.sway = false; v.setScale(sc); layer.add(v);
        tip(v, () => cardTip(id));
      });
      if (ids.length > 27) layer.add(txt(this, W / 2, 660, `et ${ids.length - 27} autres`, 15, C.muted).setOrigin(0.5));
    } else {
      layer.add(txt(this, W / 2, 152, 'Bats les clubs légendaires ou réussis un exploit pour débloquer leur entraîneur. Reste appuyé pour le détail.', 16, C.cream2).setOrigin(0.5));
      const per = 11, gx = 98, gy = 112;
      famous.forEach((k, i) => {
        const st = (STAFF as any)[k], got = mine.includes(k);
        const x = W / 2 - (per - 1) * gx / 2 + (i % per) * gx, y = 228 + Math.floor(i / per) * gy;
        const img = this.add.image(x, y, staffBadge(this, k, 64)).setInteractive();
        if (!got) img.setTint(0x333333);
        const name = txt(this, x, y + 38, got ? st.name.split(' ').slice(-1)[0] : '???', 12, got ? C.cream : C.muted).setOrigin(0.5, 0);
        const ring = this.add.graphics(); ring.lineStyle(2, got ? STAFF_TIER_COLOR[st.tier] : C.edge, 1).strokeRect(x - 34, y - 34, 68, 68);
        layer.add([ring, img, name]);
        tip(img, () => staffTip(k, !got));
      });
    }
    layer.add(new Button(this, W / 2 + 540, 66, 50, 44, '✕', C.red, () => { hideTip(this); close(); }, 20));
  }

  /** Avant les joueurs : choisis 1 mouvement parmi 3 communs, avec un exemple pour comprendre. */
  openMovePick() {
    const pack: string[] = booster(3);
    let chosen: string | null = null;
    const { layer, close } = modal(this, 900, 560);
    layer.add(txt(this, W / 2, 106, 'NOUVELLE SAISON · 1/2', 16, C.muted).setOrigin(0.5));
    layer.add(big(this, W / 2, 140, 'Choisis ton mouvement', 22).setOrigin(0.5));
    layer.add(txt(this, W / 2, 182, 'Tu as déjà Frappe isolée, Passe courte et Une-deux. Ajoutes-en un.\nTon effectif sera tiré au sort pour pouvoir le jouer.', 17, C.cream2, { align: 'center' }).setOrigin(0.5, 0));
    const tiles = pack.map((k, i) => {
      const x = W / 2 - 280 + i * 280;
      const tile = moveTile(this, x, 370, 240, 200, k, 0);
      tile.setScale(0, 1); layer.add(tile);
      layer.add(txt(this, x, 484, (MOVES as any)[k].ex || '', 14, C.sky, { align: 'center', wordWrap: { width: 230 } }).setOrigin(0.5, 0));
      this.tweens.add({ targets: tile, scaleX: 1, duration: 220, delay: i * 140, ease: 'Back.out' });
      tile.setInteractive({ useHandCursor: true }).on('pointerup', () => {
        chosen = k;
        tiles.forEach((tl, ii) => { const on = pack[ii] === k; tl.setOn(on); this.tweens.add({ targets: tl, y: on ? 354 : 370, duration: 120 }); });
        go.setEnabled(true).setLabel('Tirer mon effectif');
      });
      return tile;
    });
    const go = new Button(this, W / 2, 590, 340, 52, 'Choisis un mouvement', C.gold, () => {
      if (!go.enabled || !chosen) return; go.setEnabled(false);
      addMove(S.G, chosen, 0);
      close();
      this.time.delayedCall(160, () => this.openDraw(chosen!, 1));
    });
    go.setEnabled(false); layer.add(go);
  }

  /** Tirage au sort de l'effectif (14 joueurs classiques), avec un nouveau tirage gratuit. */
  openDraw(move: string, redraws: number) {
    const ids: string[] = drawStarters(move, loadProfile().unlocked) || S.G.squad;
    S.G.squad = ids.slice(); S.G.starters = ids.slice();
    const { layer, close } = modal(this, 1220, 660);
    layer.add(txt(this, W / 2, 62, 'NOUVELLE SAISON · 2/2', 16, C.muted).setOrigin(0.5));
    layer.add(big(this, W / 2, 94, 'Tirage de ton effectif', 22).setOrigin(0.5));
    layer.add(txt(this, W / 2, 128, `2 gardiens, 4 défenseurs, 4 milieux, 4 attaquants. Tu pourras jouer ${(MOVES as any)[move].name}.`, 16, C.cream2).setOrigin(0.5));
    const order = ['GAR', 'DEF', 'MIL', 'ATT'];
    const sorted = ids.slice().sort((a, b) => order.indexOf((PLAYERS as any)[a].pos) - order.indexOf((PLAYERS as any)[b].pos));
    const per = 7, gx = 150, sc = 0.78;
    const views = sorted.map((id, i) => {
      const v = new CardView(this, W / 2 - (per - 1) * gx / 2 + (i % per) * gx, 252 + Math.floor(i / per) * 160, id);
      v.sway = false; v.setScale(0, sc); v.setAlpha(0); layer.add(v);
      tip(v, () => cardTip(id));
      this.time.delayedCall(250 + i * 80, () => {
        this.cameras.main.shake(50, 0.002);
        this.tweens.add({ targets: v, scaleX: sc, alpha: 1, duration: 200, ease: 'Back.out' });
      });
      return v;
    });
    const done = 250 + sorted.length * 80 + 200;
    const again = new Button(this, W / 2 - 190, 600, 330, 52, redraws ? `Nouveau tirage (${redraws})` : 'Plus de nouveau tirage', C.sky, () => {
      if (!again.enabled) return; again.setEnabled(false); go.setEnabled(false);
      hideTip(this); close();
      this.time.delayedCall(160, () => this.openDraw(move, redraws - 1));
    }, 18);
    const go = new Button(this, W / 2 + 190, 600, 330, 52, 'Commencer la saison', C.gold, () => {
      if (!go.enabled) return; go.setEnabled(false); again.setEnabled(false);
      makeOffer(S.G);
      hideTip(this); close();
      this.cameras.main.fadeOut(250, 13, 15, 24);
      this.time.delayedCall(260, () => this.scene.start('match'));
    }, 18);
    again.setEnabled(false); go.setEnabled(false); layer.add([again, go]);
    this.time.delayedCall(done, () => { again.setEnabled(redraws > 0); go.setEnabled(true); });
    void views;
  }
}
