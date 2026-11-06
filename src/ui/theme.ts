// Palette, textes et composants d'interface partagés par toutes les scènes.
import Phaser from 'phaser';

export const W = 1280, H = 720;
export const C = {
  night: 0x0d0f18, panel: 0x1f2538, panel2: 0x2b3350, edge: 0x07080e,
  cream: 0xf3e7c9, cream2: 0xe2d3ad, ink: 0x1d1a22, muted: 0x9aa3c0,
  gold: 0xf4c34f, red: 0xe8573a, green: 0x6fcf4f, sky: 0x4fa6e8, purple: 0xc58cf0,
  bronze: 0xb97a46, silver: 0xb9c3cf, goldcard: 0xe9b93a,
};
export const hex = (n: number) => '#' + n.toString(16).padStart(6, '0');
export const UI_FONT = '"Jersey 10", monospace';
export const BIG_FONT = '"Press Start 2P", monospace';

export function txt(scene: Phaser.Scene, x: number, y: number, s: string, size = 18, color = C.cream, opts: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {}) {
  // Jersey 10 est étroite : on agrandit de 30 % pour garder la taille de lecture voulue.
  return scene.add.text(x, y, s, { fontFamily: UI_FONT, fontSize: Math.round(size * 1.3) + 'px', color: hex(color), resolution: 2, ...opts, fontStyle: 'normal' });
}
export function big(scene: Phaser.Scene, x: number, y: number, s: string, size = 24, color = C.gold, opts: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {}) {
  return scene.add.text(x, y, s, { fontFamily: BIG_FONT, fontSize: size + 'px', color: hex(color), resolution: 2, ...opts });
}

/** Panneau à bord pixel : fond, liseré intérieur et ombre portée. */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, fill = C.panel, inner = C.panel2) {
  const g = scene.add.graphics();
  g.fillStyle(C.edge, 1).fillRect(x + 4, y + 4, w, h);
  g.fillStyle(C.edge, 1).fillRect(x - 3, y - 3, w + 6, h + 6);
  g.fillStyle(fill, 1).fillRect(x, y, w, h);
  g.lineStyle(2, inner, 1).strokeRect(x + 3, y + 3, w - 6, h - 6);
  return g;
}

export class Button extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Graphics; label: Phaser.GameObjects.Text;
  w: number; h: number; color: number; enabled = true; onClick: () => void;
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, label: string, color: number, onClick: () => void, size = 18) {
    super(scene, x, y);
    this.w = w; this.h = h; this.color = color; this.onClick = onClick;
    this.bg = scene.add.graphics();
    this.label = txt(scene, 0, 0, label, size, C.ink).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.setSize(w, h).setInteractive({ useHandCursor: true });
    this.on('pointerover', () => this.enabled && this.scene.tweens.add({ targets: this, scale: 1.05, duration: 80 }));
    this.on('pointerout', () => this.scene.tweens.add({ targets: this, scale: 1, duration: 80 }));
    this.on('pointerdown', () => { if (!this.enabled) return; this.y += 3; this.draw(true); });
    this.on('pointerup', () => { if (!this.enabled) return; this.y -= 3; this.draw(); this.onClick(); });
    this.draw();
    scene.add.existing(this);
  }
  draw(pressed = false) {
    const { w, h } = this, g = this.bg;
    g.clear();
    if (!pressed) g.fillStyle(C.edge, 1).fillRect(-w / 2, -h / 2 + 5, w, h);
    g.fillStyle(C.edge, 1).fillRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
    g.fillStyle(this.enabled ? this.color : C.panel2, 1).fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle(0xffffff, this.enabled ? 0.18 : 0).fillRect(-w / 2, -h / 2, w, 4);
    this.label.setColor(this.enabled ? hex(C.ink) : hex(C.muted));
  }
  setEnabled(v: boolean) { if (this.enabled !== v) { this.enabled = v; this.draw(); } return this; }
  setLabel(s: string) { this.label.setText(s); return this; }
}

/** Abonnement à la boucle de mise à jour, retiré automatiquement quand la scène s'arrête. */
export function onUpdate(scene: Phaser.Scene, fn: (t: number, dt: number) => void) {
  scene.events.on('update', fn);
  scene.events.once('shutdown', () => scene.events.off('update', fn));
}

/** Fond animé : rayures de pelouse qui défilent en diagonale + vignette, et lignes CRT par-dessus. */
export function backdrop(scene: Phaser.Scene, tint = 0x18402a) {
  if (!scene.textures.exists('stripes')) {
    const t = scene.textures.createCanvas('stripes', 64, 64)!; const ctx = t.getContext();
    for (let i = 0; i < 64; i++) for (let j = 0; j < 64; j++) {
      const band = Math.floor((i + j) / 16) % 2;
      ctx.fillStyle = band ? '#ffffff' : '#000000'; ctx.globalAlpha = band ? 0.05 : 0.0; ctx.fillRect(i, j, 1, 1);
    }
    t.refresh();
    const s = scene.textures.createCanvas('scan', 4, 4)!; const sc = s.getContext();
    sc.fillStyle = 'rgba(0,0,0,0.22)'; sc.fillRect(0, 0, 4, 1); s.refresh();
    const v = scene.textures.createCanvas('vignette', 256, 144)!; const vc = v.getContext();
    const grd = vc.createRadialGradient(128, 72, 40, 128, 72, 150);
    grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.65)');
    vc.fillStyle = grd; vc.fillRect(0, 0, 256, 144); v.refresh();
  }
  scene.add.rectangle(0, 0, W, H, C.night).setOrigin(0);
  const glow = scene.add.rectangle(0, 0, W, H, tint, 0.55).setOrigin(0);
  scene.tweens.add({ targets: glow, alpha: 0.35, duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  const st = scene.add.tileSprite(0, 0, W, H, 'stripes').setOrigin(0).setScale(1);
  onUpdate(scene, (_t: number, dt: number) => { st.tilePositionX += dt * 0.012; st.tilePositionY += dt * 0.006; });
  scene.add.image(0, 0, 'vignette').setOrigin(0).setDisplaySize(W, H);
}
export function crt(scene: Phaser.Scene) {
  scene.add.tileSprite(0, 0, W, H, 'scan').setOrigin(0).setDepth(1000).setAlpha(0.6);
}

/** Fenêtre modale : voile sombre + boîte centrée. Renvoie le conteneur et une fonction de fermeture. */
export function modal(scene: Phaser.Scene, w: number, h: number) {
  // Le voile est hors du conteneur : Phaser trie mal l'entrée entre enfants d'un même conteneur.
  const veil = scene.add.rectangle(0, 0, W, H, 0x05060c, 0.8).setOrigin(0).setInteractive().setDepth(499);
  const layer = scene.add.container(0, 0).setDepth(500);
  const x = (W - w) / 2, y = (H - h) / 2;
  layer.add(panel(scene, x, y, w, h, C.panel, C.gold));
  layer.setAlpha(0); veil.setAlpha(0);
  scene.tweens.add({ targets: [layer, veil], alpha: 1, duration: 150 });
  const close = () => scene.tweens.add({ targets: [layer, veil], alpha: 0, duration: 120, onComplete: () => { layer.destroy(); veil.destroy(); } });
  return { layer, x, y, close };
}

/** Texte flottant qui monte et disparaît (gains, bonus). */
export function floatText(scene: Phaser.Scene, x: number, y: number, s: string, color = C.gold, size = 22) {
  const t = big(scene, x, y, s, size, color, { stroke: hex(C.edge), strokeThickness: 6 }).setOrigin(0.5).setDepth(400);
  t.setScale(0.4);
  scene.tweens.add({ targets: t, scale: 1, duration: 140, ease: 'Back.out' });
  scene.tweens.add({ targets: t, y: y - 40, alpha: 0, delay: 450, duration: 450, onComplete: () => t.destroy() });
  return t;
}

export const fmt = (n: number) => (Math.round(n * 10) / 10).toString().replace('.', ',') + ' M€';
export const dec = (n: number) => String(n).replace('.', ',');
