// Bouton plein écran (Android / ordinateur). Cache les barres du navigateur et bloque le paysage.
export function fullscreenButton() {
  const d = document as any, el = document.documentElement as any;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!req) return; // iPhone : pas d'API plein écran, passer par « Sur l'écran d'accueil »
  const b = document.createElement('button');
  b.id = 'fs';
  b.title = 'Plein écran';
  b.textContent = '⛶';
  b.style.cssText = 'position:fixed;top:8px;right:8px;z-index:10;width:34px;height:34px;border:3px solid #0d0f18;'
    + 'background:#f4c34f;color:#0d0f18;font:700 20px monospace;line-height:1;padding:0;cursor:pointer;opacity:.7;box-shadow:0 4px 0 #0d0f18;';
  const isFs = () => !!(d.fullscreenElement || d.webkitFullscreenElement);
  const sync = () => { b.style.display = isFs() ? 'none' : 'block'; };
  b.addEventListener('click', async () => {
    try {
      await req.call(el, { navigationUI: 'hide' });
      try { await (screen.orientation as any)?.lock?.('landscape'); } catch { /* non supporté */ }
    } catch {
      b.textContent = '✕'; b.title = 'Plein écran bloqué ici : ouvre le jeu dans son propre onglet';
      setTimeout(() => b.remove(), 2500);
    }
  });
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  document.body.appendChild(b); sync();
}
