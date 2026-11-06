// Écran titre et booster de départ.
import Phaser from 'phaser';
import { newGame, booster, addMove, makeOffer, STARTER, starterPack, CAMPAIGNS, RULES, PLAYERS } from '../game/logic.js';
import { loadProfile } from '../game/profile';
import { drawField, PITCH_W, PITCH_H } from '../game/art';
import { S } from '../game/state';
import { W, C, big, txt, Button, backdrop, crt, modal, panel, onUpdate } from '../ui/theme';
import { moveTile, Tile } from '../ui/tiles';
import { CardView, CARD_W, CARD_H, cardTip } from '../ui/Card';
import { tip, wasLongPress, hideTip } from '../ui/Tooltip';

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

  /** Nouvelle saison : un booster de joueurs par ligne, puis le booster de mouvements. */
  startSeason(campaign: string) {
    S.G = newGame(campaign);
    S.G.squad = [];
    this.openDraft(0);
  }

  /** Choix de la campagne : chacune se débloque en gagnant la précédente. */
  openCampaigns() {
    const prof = loadProfile();
    const { layer, close } = modal(this, 1160, 560);
    layer.add(big(this, W / 2, 110, 'Choisis ta campagne', 22).setOrigin(0.5));
    CAMPAIGNS.forEach((c: any, i: number) => {
      const x = W / 2 - 380 + i * 380, open = !c.req || prof.won[c.req];
      const won = prof.won[c.id] || 0;
      layer.add(panel(this, x - 175, 150, 350, 400, open ? C.panel2 : C.panel, open ? C.gold : C.edge));
      layer.add(big(this, x, 180, `${i + 1}`, 18, open ? C.gold : C.muted).setOrigin(0.5));
      layer.add(txt(this, x, 214, c.name.toUpperCase(), 19, open ? C.cream : C.muted, { align: 'center', wordWrap: { width: 320 } }).setOrigin(0.5, 0));
      layer.add(txt(this, x, 262, c.desc, 16, open ? C.cream2 : C.muted, { align: 'center', wordWrap: { width: 310 } }).setOrigin(0.5, 0));
      const coaches = c.stages.filter((s: any) => s.coach).map((s: any) => (RULES as any)[s.coach].coach);
      if (coaches.length) layer.add(txt(this, x, 370, 'Boss : ' + coaches.join(', '), 15, open ? C.red : C.muted, { align: 'center', wordWrap: { width: 310 } }).setOrigin(0.5, 0));
      layer.add(txt(this, x, 440, open ? (won ? `Gagnée ${won} fois` : 'Pas encore gagnée') : `Verrouillée : gagne « ${CAMPAIGNS.find((o: any) => o.id === c.req)!.name} »`, 15, open ? (won ? C.green : C.muted) : C.muted, { align: 'center', wordWrap: { width: 310 } }).setOrigin(0.5, 0));
      const b = new Button(this, x, 510, 220, 48, open ? 'Jouer' : 'Verrouillée', open ? C.gold : C.panel2, () => { close(); this.time.delayedCall(140, () => this.startSeason(c.id)); }, 19);
      b.setEnabled(!!open); layer.add(b);
    });
    layer.add(new Button(this, W / 2 + 540, 110, 50, 44, '✕', C.red, () => close(), 20));
  }

  /** Collection : les joueurs débloqués, qui peuvent sortir du booster de départ. */
  openCollection() {
    const prof = loadProfile();
    const { layer, close } = modal(this, 1160, 600);
    layer.add(big(this, W / 2, 96, 'Ta collection', 22).setOrigin(0.5));
    layer.add(txt(this, W / 2, 136, 'Gagne une campagne : tes meilleurs buteurs entrent ici et peuvent sortir du booster de départ.', 17, C.cream2).setOrigin(0.5));
    const ids = prof.unlocked.filter(id => (PLAYERS as any)[id]);
    if (!ids.length) layer.add(txt(this, W / 2, 340, 'Aucun joueur pour l\'instant.', 20, C.muted).setOrigin(0.5));
    const per = 9, sc = 0.78, gx = 118, gy = 160;
    ids.slice(0, 27).forEach((id, i) => {
      const inRow = Math.min(per, Math.min(ids.length, 27) - Math.floor(i / per) * per);
      const v = new CardView(this, W / 2 - (inRow - 1) * gx / 2 + (i % per) * gx, 260 + Math.floor(i / per) * gy, id);
      v.sway = false; v.setScale(sc); layer.add(v);
      tip(v, () => cardTip(id));
    });
    if (ids.length > 27) layer.add(txt(this, W / 2, 640, `et ${ids.length - 27} autres`, 15, C.muted).setOrigin(0.5));
    layer.add(new Button(this, W / 2 + 540, 96, 50, 44, '✕', C.red, () => { hideTip(this); close(); }, 20));
  }

  openDraft(step: number) {
    const lines = Object.keys(STARTER) as string[];
    if (step >= lines.length) { this.openBooster(); return; }
    const pos = lines[step], [n, keep] = (STARTER as any)[pos];
    const label: Record<string, string> = { GAR: 'Gardiens', DEF: 'Défenseurs', MIL: 'Milieux', ATT: 'Attaquants' };
    const pack: string[] = starterPack(pos, loadProfile().unlocked);
    const chosen: string[] = [];
    const { layer, close } = modal(this, 1160, 600);
    layer.add(txt(this, W / 2, 84, `BOOSTER DE DÉPART · ${step + 1}/${lines.length}`, 16, C.muted).setOrigin(0.5));
    layer.add(big(this, W / 2, 120, label[pos], 22).setOrigin(0.5));
    const hint = txt(this, W / 2, 162, `Garde ${keep} joueurs sur ${n}. Reste appuyé sur une carte pour son détail.`, 18, C.cream2).setOrigin(0.5);
    layer.add(hint);
    const packG = this.add.container(W / 2, 360);
    const pg = this.add.graphics();
    pg.fillStyle(C.edge, 1).fillRect(-83, -113, 166, 226); pg.fillStyle(C.sky, 1).fillRect(-80, -110, 160, 220);
    pg.fillStyle(C.gold, 1).fillRect(-80, -20, 160, 40);
    packG.add([pg, big(this, 0, 0, label[pos].toUpperCase(), 10, C.ink).setOrigin(0.5)]);
    layer.add(packG);
    const go = new Button(this, W / 2, 610, 340, 52, '', C.gold, () => {
      if (!go.enabled) return; go.setEnabled(false); // pas de double validation
      S.G.squad.push(...chosen.filter(id => !S.G.squad.includes(id)));
      hideTip(this); close();
      this.time.delayedCall(160, () => this.openDraft(step + 1));
    });
    const sync = () => go.setEnabled(chosen.length === keep).setLabel(chosen.length === keep ? (step === lines.length - 1 ? 'Valider l\'effectif' : 'Suivant') : `Choisis ${keep} joueurs (${chosen.length}/${keep})`);
    sync(); go.setVisible(false); layer.add(go);
    const gap = 168, x0 = W / 2 - (n - 1) * gap / 2, cy = 380;
    this.tweens.add({
      targets: packG, angle: { from: -4, to: 4 }, duration: 70, yoyo: true, repeat: 6, onComplete: () => {
        this.cameras.main.flash(200, 255, 240, 200);
        packG.destroy();
        pack.forEach((id, i) => {
          const ring = this.add.graphics();
          const v = new CardView(this, x0 + i * gap, cy, id);
          v.sway = false; v.setScale(0, 1.12);
          layer.add([ring, v]);
          this.tweens.add({ targets: v, scaleX: 1.12, duration: 220, delay: i * 120, ease: 'Back.out' });
          v.setInteractive({ useHandCursor: true });
          tip(v, () => cardTip(id));
          v.on('pointerup', () => {
            if (wasLongPress(v)) return;
            const j = chosen.indexOf(id);
            if (j >= 0) chosen.splice(j, 1); else if (chosen.length < keep) chosen.push(id); else return;
            const on = chosen.includes(id);
            this.tweens.add({ targets: v, y: on ? cy - 22 : cy, duration: 120 });
            ring.clear();
            if (on) ring.fillStyle(C.gold, 1).fillRect(v.x - CARD_W * 0.56 - 6, cy - 22 - CARD_H * 0.56 - 6, CARD_W * 1.12 + 12, CARD_H * 1.12 + 12);
            sync();
          });
        });
        go.setVisible(true);
      },
    });
  }

  openBooster() {
    const pack = booster();
    const chosen: string[] = [];
    const { layer, close } = modal(this, 860, 520);
    layer.add(big(this, W / 2, 140, 'Booster de départ', 22).setOrigin(0.5));
    layer.add(txt(this, W / 2, 182, 'Tu as Frappe isolée, Passe courte et Une-deux. Choisis 2 mouvements de plus.', 17).setOrigin(0.5));
    // le paquet tremble puis s'ouvre
    const packG = this.add.container(W / 2, 360);
    const pg = this.add.graphics();
    pg.fillStyle(C.edge, 1).fillRect(-83, -113, 166, 226); pg.fillStyle(C.red, 1).fillRect(-80, -110, 160, 220);
    pg.fillStyle(C.gold, 1).fillRect(-80, -20, 160, 40);
    packG.add([pg, big(this, 0, 0, 'MOUVEMENTS', 10, C.ink).setOrigin(0.5)]);
    layer.add(packG);
    const tiles: Tile[] = [];
    const go = new Button(this, W / 2, 570, 320, 52, 'Choisis 2 mouvements', C.gold, () => {
      if (!go.enabled) return; go.setEnabled(false);
      chosen.forEach(k => addMove(S.G, k, 0));
      makeOffer(S.G);
      close();
      this.cameras.main.fadeOut(250, 13, 15, 24);
      this.time.delayedCall(260, () => this.scene.start('match'));
    });
    go.setEnabled(false); go.setVisible(false);
    layer.add(go);
    this.tweens.add({
      targets: packG, angle: { from: -4, to: 4 }, duration: 70, yoyo: true, repeat: 6, onComplete: () => {
        this.cameras.main.flash(200, 255, 240, 200);
        packG.destroy();
        pack.forEach((k: string, i: number) => {
          const tile = moveTile(this, W / 2 - 300 + i * 200, 360, 180, 210, k, 0);
          tile.setScale(0, 1); layer.add(tile); tiles.push(tile);
          this.tweens.add({ targets: tile, scaleX: 1, duration: 220, delay: i * 140, ease: 'Back.out' });
          tile.setInteractive({ useHandCursor: true }).on('pointerup', () => {
            const j = chosen.indexOf(k);
            if (j >= 0) chosen.splice(j, 1); else if (chosen.length < 2) chosen.push(k);
            tiles.forEach((tl, ii) => { const on = chosen.includes(pack[ii]); tl.setOn(on); this.tweens.add({ targets: tl, y: on ? 344 : 360, duration: 120 }); });
            go.setEnabled(chosen.length === 2).setLabel(chosen.length === 2 ? 'Commencer la saison' : `Choisis 2 mouvements (${chosen.length}/2)`);
          });
        });
        go.setVisible(true);
      },
    });
  }
}
