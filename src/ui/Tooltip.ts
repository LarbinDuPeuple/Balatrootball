// Info-bulle partagée : apparaît au survol de la souris, ou après un appui long au doigt.
import Phaser from 'phaser';
import { W, H, C, hex, txt, big } from './theme';

export interface TipContent { title: string; lines: string[]; accent?: number; sub?: string }

const LONG_PRESS = 320;

class Tooltip {
  scene: Phaser.Scene;
  box: Phaser.GameObjects.Container; key = ''; bw = 300; bh = 0;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.box = scene.add.container(0, 0).setDepth(900).setVisible(false);
  }
  /** Affiche (ou déplace seulement, si c'est la même bulle : pas de clignotement). */
  show(c: TipContent, x: number, y: number, touch = false) {
    const key = c.title + '|' + c.lines.join('|');
    if (this.box.visible && key === this.key) { this.place(x, y, touch); return; }
    this.key = key;
    const s = this.scene, b = this.box;
    b.removeAll(true);
    const width = 300, pad = 12;
    const title = big(s, pad, pad, c.title, 11, c.accent ?? C.gold, { wordWrap: { width: width - pad * 2 } }).setLineSpacing(4);
    let yy = pad + title.height + 4;
    const parts: Phaser.GameObjects.GameObject[] = [title];
    if (c.sub) { const st = txt(s, pad, yy, c.sub, 13, C.muted); parts.push(st); yy += st.height + 4; }
    c.lines.forEach(l => {
      const t = txt(s, pad, yy, l, 15, C.cream, { wordWrap: { width: width - pad * 2 } });
      parts.push(t); yy += t.height + 2;
    });
    const h = yy + pad - 2;
    const g = s.add.graphics();
    g.fillStyle(C.edge, 0.6).fillRect(5, 6, width, h);
    g.fillStyle(C.edge, 1).fillRect(-3, -3, width + 6, h + 6);
    g.fillStyle(0x161a28, 0.97).fillRect(0, 0, width, h);
    g.fillStyle(c.accent ?? C.gold, 1).fillRect(0, 0, width, 4);
    b.add([g, ...parts]);
    this.bw = width; this.bh = h;
    this.place(x, y, touch);
    b.setVisible(true).setAlpha(0);
    s.tweens.killTweensOf(b);
    s.tweens.add({ targets: b, alpha: 1, duration: 90 });
  }
  /** Au-dessus du point visé (bien plus haut sous un doigt), toujours dans l'écran. */
  place(x: number, y: number, touch: boolean) {
    const width = this.bw, h = this.bh, lift = touch ? 90 : 22;
    let px = x - width / 2, py = y - h - lift;
    if (py < 6) {
      if (touch) { py = y - h / 2; px = x < W / 2 ? x + 70 : x - width - 70; } // pas de place au-dessus : à côté du doigt
      else py = y + 28;
    }
    px = Phaser.Math.Clamp(px, 6, W - width - 6);
    py = Phaser.Math.Clamp(py, 6, H - h - 6);
    this.box.setPosition(px, py);
  }
  hide() { this.box.setVisible(false); this.key = ''; }
}

const tips = new WeakMap<Phaser.Scene, Tooltip>();
function tipFor(scene: Phaser.Scene) {
  let t = tips.get(scene);
  if (!t || !t.box.active) {
    t = new Tooltip(scene); tips.set(scene, t);
    scene.input.on('pointerup', () => { if (scene.input.activePointer.wasTouch) t!.hide(); });
    scene.events.once('shutdown', () => tips.delete(scene));
  }
  return t;
}

/**
 * Ajoute une info-bulle à un objet. Souris : au survol. Doigt : appui long (l'objet reçoit alors
 * la donnée 'longpress' = true pour que son propre clic l'ignore).
 */
export function tip(obj: Phaser.GameObjects.GameObject & { x: number; y: number }, content: () => TipContent) {
  const scene = obj.scene;
  if (!obj.input) obj.setInteractive();
  let timer: Phaser.Time.TimerEvent | null = null, hiding: Phaser.Time.TimerEvent | null = null;
  const at = (p: Phaser.Input.Pointer) => tipFor(scene).show(content(), p.worldX, p.worldY, p.wasTouch);
  obj.on('pointerover', (p: Phaser.Input.Pointer) => { hiding?.remove(); hiding = null; if (!p.wasTouch) at(p); });
  obj.on('pointermove', (p: Phaser.Input.Pointer) => { if (tipFor(scene).box.visible) at(p); });
  // petit délai : une carte qui se soulève au survol ne fait plus clignoter la bulle
  obj.on('pointerout', () => { timer?.remove(); hiding?.remove(); hiding = scene.time.delayedCall(70, () => tipFor(scene).hide()); });
  obj.on('pointerdown', (p: Phaser.Input.Pointer) => {
    obj.setData('longpress', false);
    if (!p.wasTouch) return;
    timer?.remove();
    timer = scene.time.delayedCall(LONG_PRESS, () => { obj.setData('longpress', true); at(p); });
  });
  obj.on('pointerup', () => { timer?.remove(); });
  obj.once('destroy', () => { timer?.remove(); hiding?.remove(); });
  return obj;
}

/** Cache l'info-bulle de la scène (avant de reconstruire un écran). */
export function hideTip(scene: Phaser.Scene) { tips.get(scene)?.hide(); }

/** Vrai si le relâchement en cours termine un appui long (à ignorer comme clic). */
export function wasLongPress(obj: Phaser.GameObjects.GameObject) {
  const lp = !!obj.getData('longpress');
  obj.setData('longpress', false);
  return lp;
}

export { hex };
