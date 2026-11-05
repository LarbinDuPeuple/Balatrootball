import Phaser from 'phaser';
import { W, H, C } from './ui/theme';
import { TitleScene } from './scenes/TitleScene';
import { MatchScene } from './scenes/MatchScene';
import { MercatoScene } from './scenes/MercatoScene';
import { fullscreenButton } from './ui/fullscreen';

async function boot() {
  // Les polices pixel doivent être chargées avant le premier texte Phaser.
  try { await Promise.all([document.fonts.load('18px "Jersey 10"'), document.fonts.load('18px "Press Start 2P"')]); } catch { /* polices de secours */ }
  (window as any).game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W, height: H,
    backgroundColor: C.night,
    pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: [TitleScene, MatchScene, MercatoScene],
  });
}
boot();
fullscreenButton();
