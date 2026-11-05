// Écran titre et booster de départ.
import Phaser from 'phaser';
import { newGame, booster, addMove, makeOffer } from '../game/logic.js';
import { drawField, PITCH_W, PITCH_H } from '../game/art';
import { S } from '../game/state';
import { W, C, big, txt, Button, backdrop, crt, modal, panel, onUpdate } from '../ui/theme';
import { moveTile, Tile } from '../ui/tiles';

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
    new Button(this, W / 2, 570, 300, 60, 'Nouvelle saison', C.gold, () => this.openBooster(), 22);
    txt(this, W / 2, 640, 'Bats le mur du gardien avec tes mouvements. Combine club, nationalité, génération et styles.', 15, C.muted).setOrigin(0.5);
    crt(this);
  }

  openBooster() {
    S.G = newGame();
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
