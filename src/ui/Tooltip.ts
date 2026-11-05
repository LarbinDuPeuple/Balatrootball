// Info-bulle partagée : apparaît au survol de la souris, ou après un appui long au doigt.
import Phaser from 'phaser';
import { W, H, C, hex, txt, big } from './theme';

export interface TipContent { title: string; lines: string[]; accent?: number; sub?: string }

const LONG_PRESS = 320;

class Tooltip {
  scene: Phaser.Scene;
  box: Phaser.GameObjects.Container;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.box = scene.add.container(0, 0).setDepth(900).setVisible(false);
  }
  show(c: TipContent, x: number, y: number) {
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
    // au-dessus du point visé si possible, toujours dans l'écran
    let px = x - width / 2, py = y - h - 18;
    if (py < 6) py = y + 24;
    px = Phaser.Math.Clamp(px, 6, W - width - 6);
    py = Phaser.Math.Clamp(py, 6, H - h - 6);
    b.setPosition(px, py).setVisible(true).setAlpha(0).setScale(0.96);
    s.tweens.killTweensOf(b);
    s.tweens.add({ targets: b, alpha: 1, scale: 1, duration: 90 });
  }
  hide() { this.box.setVisible(false); }
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
  let timer: Phaser.Time.TimerEvent | null = null;
  const at = (p: Phaser.Input.Pointer) => tipFor(scene).show(content(), p.worldX, p.worldY);
  obj.on('pointerover', (p: Phaser.Input.Pointer) => { if (!p.wasTouch) at(p); });
  obj.on('pointermove', (p: Phaser.Input.Pointer) => { if (!p.wasTouch && tipFor(scene).box.visible) at(p); });
  obj.on('pointerout', () => { tipFor(scene).hide(); timer?.remove(); });
  obj.on('pointerdown', (p: Phaser.Input.Pointer) => {
    obj.setData('longpress', false);
    if (!p.wasTouch) return;
    timer?.remove();
    timer = scene.time.delayedCall(LONG_PRESS, () => { obj.setData('longpress', true); at(p); });
  });
  obj.on('pointerup', () => { timer?.remove(); });
  obj.once('destroy', () => { timer?.remove(); });
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
