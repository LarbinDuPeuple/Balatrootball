// ===== Interface =====
const $ = s => document.querySelector(s);
const SKIN = ['#f2c9a0', '#e0aa7e', '#c68a5a', '#9c6a43', '#6b4426'];
const SKIN_SH = ['#d9a982', '#c48d62', '#a86f43', '#7f5333', '#53331b'];
const HAIR = ['#1a1410', '#3b2516', '#6b4426', '#e3c063', '#b5512a', '#9a9a9a', '#f0e0a0'];
const TIER_NAME = { base: 'Base', commun: 'Commun', rare: 'Rare', epique: 'Épique' };
const POS_BG = { GAR: '#f0d36a', DEF: '#8ec5e8', MIL: '#9fd38a', ATT: '#f0a08a' };

let G = null, M = null, sel = [], busy = false;

function rarity(r) { return r >= 92 ? 'legende' : r >= 88 ? 'or' : r >= 80 ? 'argent' : 'bronze'; }
function shortName(p) {
  const parts = p.name.split(' ');
  return parts.length === 1 ? p.name : parts.slice(1).join(' ');
}
function fmt(n) { return (Math.round(n * 10) / 10).toString().replace('.', ',') + ' M€'; }

// --- pixel helpers
function px(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

function drawFlag(cv, nat) {
  const f = NATIONS[nat] || { t: 'h', c: ['#888'] };
  const ctx = cv.getContext('2d'); const W = 12, H = 8;
  cv.width = W; cv.height = H;
  if (f.t === 'v') { const w = W / f.c.length; f.c.forEach((c, i) => px(ctx, Math.round(i * w), 0, Math.ceil(w), H, c)); }
  else if (f.t === 'h') { const h = H / f.c.length; f.c.forEach((c, i) => px(ctx, 0, Math.round(i * h), W, Math.ceil(h), c)); }
  else if (f.t === 'x') { px(ctx, 0, 0, W, H, f.c[0]); px(ctx, 4, 0, 2, H, f.c[1]); px(ctx, 0, 3, W, 2, f.c[1]); }
  else if (f.t === 'd') { px(ctx, 0, 0, W, H, f.c[0]); px(ctx, 3, 2, 6, 4, f.c[1]); px(ctx, 2, 3, 8, 2, f.c[1]); px(ctx, 5, 3, 2, 2, f.c[2]); }
}

function drawPortrait(cv, p) {
  const ctx = cv.getContext('2d');
  cv.width = 20; cv.height = 20;
  const lk = p.look, sk = SKIN[lk.skin], sh = SKIN_SH[lk.skin], hc = HAIR[lk.hair];
  const [shirt, trim] = CLUBS[p.club] || ['#5a8fd0', '#fff'];
  px(ctx, 0, 0, 20, 20, POS_BG[p.pos]);
  // fond : petits pixels de tribune
  for (let i = 0; i < 14; i++) px(ctx, (i * 7) % 20, (i * 5) % 9, 1, 1, 'rgba(0,0,0,.08)');
  // corps
  px(ctx, 2, 16, 16, 4, shirt); px(ctx, 3, 15, 14, 1, shirt);
  px(ctx, 8, 15, 4, 1, trim); px(ctx, 9, 16, 2, 1, trim);
  if (p.pos === 'GAR') { px(ctx, 2, 16, 16, 4, '#2f9e5a'); px(ctx, 3, 15, 14, 1, '#2f9e5a'); }
  // cou
  px(ctx, 8, 13, 4, 2, sh);
  // afro / grosses coupes derrière la tête
  if (lk.cut === 'afro') { px(ctx, 3, 1, 14, 9, hc); px(ctx, 2, 3, 16, 7, hc); px(ctx, 3, 10, 2, 3, hc); px(ctx, 15, 10, 2, 3, hc); }
  if (lk.cut === 'long') { px(ctx, 5, 4, 10, 10, hc); }
  if (lk.cut === 'queue') { px(ctx, 14, 5, 3, 3, hc); px(ctx, 15, 8, 2, 3, hc); }
  // tête
  px(ctx, 6, 4, 8, 10, sk); px(ctx, 7, 3, 6, 1, sk); px(ctx, 7, 14, 6, 0, sk);
  px(ctx, 6, 4, 1, 1, POS_BG[p.pos]); px(ctx, 13, 4, 1, 1, POS_BG[p.pos]);
  px(ctx, 5, 8, 1, 2, sk); px(ctx, 14, 8, 1, 2, sk);
  px(ctx, 13, 5, 1, 8, sh); px(ctx, 7, 13, 6, 1, sh);
  // yeux, sourcils, nez, bouche
  px(ctx, 8, 8, 1, 1, '#111'); px(ctx, 11, 8, 1, 1, '#111');
  px(ctx, 7, 7, 2, 1, lk.hair === 3 || lk.hair === 6 ? '#a78a4a' : hc); px(ctx, 11, 7, 2, 1, lk.hair === 3 || lk.hair === 6 ? '#a78a4a' : hc);
  px(ctx, 10, 9, 1, 2, sh);
  px(ctx, 9, 12, 3, 1, '#8a3b2c');
  // cheveux
  const c = lk.cut;
  if (c === 'court' || c === 'queue') { px(ctx, 6, 3, 8, 2, hc); px(ctx, 7, 2, 6, 1, hc); px(ctx, 6, 5, 1, 2, hc); px(ctx, 13, 5, 1, 2, hc); }
  if (c === 'long') { px(ctx, 6, 3, 8, 2, hc); px(ctx, 7, 2, 6, 1, hc); px(ctx, 5, 5, 2, 8, hc); px(ctx, 13, 5, 2, 8, hc); }
  if (c === 'boucle') { px(ctx, 5, 2, 10, 3, hc); px(ctx, 5, 5, 2, 4, hc); px(ctx, 13, 5, 2, 4, hc); [6, 9, 12].forEach(x => px(ctx, x, 1, 2, 1, hc)); }
  if (c === 'afro') { px(ctx, 6, 3, 8, 1, hc); }
  if (c === 'degarni') { px(ctx, 6, 5, 1, 3, hc); px(ctx, 13, 5, 1, 3, hc); px(ctx, 5, 6, 1, 2, hc); px(ctx, 14, 6, 1, 2, hc); px(ctx, 9, 3, 2, 1, sh); }
  if (c === 'chauve') { px(ctx, 8, 4, 2, 1, '#fff6'); }
  if (c === 'casquette') { px(ctx, 6, 2, 8, 3, '#2a2a2a'); px(ctx, 5, 4, 10, 1, '#2a2a2a'); px(ctx, 4, 5, 8, 1, '#111'); }
  if (c === 'crete') { px(ctx, 9, 1, 2, 4, hc); }
  // pilosité
  if (lk.face === 'moustache') px(ctx, 8, 11, 4, 1, hc);
  if (lk.face === 'barbe') { px(ctx, 6, 10, 1, 3, hc); px(ctx, 13, 10, 1, 3, hc); px(ctx, 7, 12, 6, 2, hc); px(ctx, 8, 11, 4, 1, hc); px(ctx, 9, 12, 3, 1, '#8a3b2c'); }
  if (lk.face === 'bouc') px(ctx, 9, 13, 2, 1, hc);
}

function cardEl(id, opts = {}) {
  const p = PLAYERS[id];
  const el = document.createElement('div');
  el.className = 'card r-' + rarity(p.r);
  el.style.setProperty('--clubc', (CLUBS[p.club] || ['#456'])[0] === '#f4f4f4' ? '#3d3a48' : (CLUBS[p.club] || ['#456'])[0]);
  el.innerHTML = `<div class="top"><span>${p.club}</span><canvas></canvas></div>
    <div class="pic"><canvas></canvas><div class="note">${p.r}</div></div>
    ${p.star ? '<div class="star">STAR</div>' : ''}
    <div class="nm">${p.pos} - ${shortName(p)}</div>
    <div class="st">${p.styles.join(' · ') || '&nbsp;'}</div>
    <div class="ft"><span>${fmt(p.salary)}/m</span><span class="fat"></span></div>`;
  const cvs = el.querySelectorAll('canvas');
  drawFlag(cvs[0], p.nat); drawPortrait(cvs[1], p);
  cvs[0].title = p.nat;
  if (opts.fatigue !== undefined) {
    const f = el.querySelector('.fat');
    for (let i = 0; i < opts.limit; i++) { const d = document.createElement('i'); if (i < opts.fatigue) d.className = 'used'; f.appendChild(d); }
  }
  return el;
}

// ===== Terrain =====
const pitch = { cv: null, ctx: null, t: 0, anim: null, crowd: [] };
function initPitch(cv) {
  const ctx = cv.getContext('2d');
  const crowd = [];
  for (let i = 0; i < 520; i++) crowd.push([Math.floor(rng() * 240), Math.random() < .5 ? Math.floor(Math.random() * 12) : 124 + Math.floor(Math.random() * 12), ['#e8573a', '#f4c34f', '#7fc3ea', '#f3e7c9', '#9aa3c0', '#5a8fd0'][i % 6]]);
  return { cv, ctx, crowd };
}
const HOME = [[12, 68], [40, 40], [40, 96], [70, 54], [70, 84], [100, 68], [120, 44], [120, 92]];
function drawField(P, oppColor, actors, ball, t) {
  const ctx = P.ctx;
  px(ctx, 0, 0, 240, 136, '#1b1f2e');
  P.crowd.forEach(([x, y, c], i) => { if ((i + Math.floor(t / 12)) % 9) px(ctx, x, y, 1, 1, c); });
  for (let i = 0; i < 12; i++) px(ctx, i * 20, 14, 20, 108, i % 2 ? '#3f8f3a' : '#4a9c43');
  ctx.strokeStyle = '#e8f2e0'; ctx.lineWidth = 1;
  ctx.strokeRect(4.5, 16.5, 231, 103); ctx.beginPath(); ctx.moveTo(120.5, 16.5); ctx.lineTo(120.5, 119.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(120.5, 68, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeRect(4.5, 44.5, 24, 47); ctx.strokeRect(211.5, 44.5, 24, 47);
  ctx.strokeRect(4.5, 56.5, 8, 23); ctx.strokeRect(227.5, 56.5, 8, 23);
  px(ctx, 0, 58, 4, 20, '#dfe7ef'); px(ctx, 236, 58, 4, 20, '#dfe7ef');
  for (let y = 59; y < 77; y += 2) px(ctx, 237, y, 2, 1, '#9aa3c0');
  // adversaires
  HOME.forEach(([x, y], i) => sprite(ctx, 240 - x, y + Math.round(Math.sin(t / 20 + i) * 1), oppColor, '#111', 1, t + i * 5, i === 0 ? '#2f9e5a' : null));
  // nos joueurs
  if (actors) actors.forEach(a => sprite(ctx, Math.round(a.x), Math.round(a.y), a.shirt, a.hair, a.skin, t + a.x, a.gk));
  else HOME.forEach(([x, y], i) => sprite(ctx, x, y + Math.round(Math.cos(t / 20 + i) * 1), '#5a8fd0', HAIR[i % 5], SKIN[i % 5], t + i * 3, i === 0 ? '#2f9e5a' : null));
  if (ball) { px(ctx, Math.round(ball.x) - 1, Math.round(ball.y) - 1, 3, 3, '#111'); px(ctx, Math.round(ball.x) - 1, Math.round(ball.y) - 1, 2, 2, '#fff'); }
}
function sprite(ctx, x, y, shirt, hair, skin, t, gk) {
  const s = typeof skin === 'number' ? SKIN[skin] : skin;
  const step = Math.floor(t / 8) % 2;
  px(ctx, x - 2, y - 8, 4, 1, hair);
  px(ctx, x - 2, y - 7, 4, 3, s);
  px(ctx, x - 3, y - 4, 6, 3, gk || shirt);
  px(ctx, x - 2, y - 1, 4, 1, '#f3f3f3');
  px(ctx, x - 2 + step, y, 1, 2, s); px(ctx, x + 1 - step, y, 1, 2, s);
}

function lineX(pos) { return { GAR: 14, DEF: 50, MIL: 105, ATT: 170 }[pos]; }

function animateAction(ordered, res, done) {
  const actors = ordered.map((id, i) => {
    const p = PLAYERS[id];
    return { x: lineX(p.pos) + i * 6, y: 30 + ((i * 37 + p.r) % 76), shirt: (CLUBS[p.club] || ['#5a8fd0'])[0], hair: HAIR[p.look.hair], skin: p.look.skin, gk: p.pos === 'GAR' ? '#2f9e5a' : null };
  });
  const path = actors.map(a => ({ x: a.x + 3, y: a.y - 1 }));
  const target = res.goals > 0 ? { x: 238, y: 60 + Math.floor(Math.random() * 16) } : { x: 226, y: 68 };
  path.push(target);
  let seg = 0, k = 0, t0 = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const segDur = reduce ? 1 : 260;
  function frame(now) {
    const t = (now - t0) / 16;
    k = Math.min(1, (now - t0) / segDur);
    const a = path[seg], b = path[seg + 1] || a;
    const ball = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    // les joueurs avancent un peu pendant l'action
    actors.forEach(ac => ac.x += 0.25);
    drawField(pitch, M.oppColor, actors, ball, t);
    if (k >= 1) { seg++; t0 = now; }
    if (seg >= path.length - 1) { drawField(pitch, M.oppColor, actors, target, t); done(); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function idleLoop() {
  let t = 0;
  function f() {
    t++;
    if (!busy && !$('#match').hidden) drawField(pitch, M ? M.oppColor : '#c8102e', null, { x: 120, y: 68 }, t);
    if (!$('#title').hidden) drawField(titlePitch, '#c8102e', null, { x: 120 + Math.sin(t / 30) * 40, y: 68 + Math.cos(t / 23) * 20 }, t);
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}

// ===== Écrans =====
function show(id) { ['#title', '#match', '#mercato'].forEach(s => $(s).hidden = s !== id); window.scrollTo(0, 0); }
function modal(html, buttons) {
  $('#modal-box').innerHTML = html;
  const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap';
  buttons.forEach(([label, fn, cls]) => { const b = document.createElement('button'); b.textContent = label; if (cls) b.className = cls; b.onclick = () => { $('#modal').hidden = true; fn(); }; row.appendChild(b); });
  $('#modal-box').appendChild(row);
  $('#modal').hidden = false;
  row.querySelector('button').focus();
}

function startGame() { G = newGame(); openBooster(); }

function moveTile(k, lv, extra) {
  const mv = MOVES[k];
  return `<div class="tile move t-${mv.tier}"><span class="kind">${TIER_NAME[mv.tier]}${lv ? ' · niv. ' + (lv + 1) : ''}</span><b>${mv.name}</b><span>${mv.desc}</span>
    <span class="num">${mv.base + 10 * lv} base × ${String(mv.prec + 0.5 * lv).replace('.', ',')}</span>${extra || ''}</div>`;
}

function openBooster() {
  const pack = booster(); const chosen = [];
  const render = () => {
    $('#modal-box').innerHTML = `<div class="big">Booster de départ</div>
      <div>Tu commences avec Frappe isolée, Passe courte et Une-deux. Choisis <b>2 mouvements</b> de plus.</div>
      <div class="booster">${pack.map(k => `<div class="pickable${chosen.includes(k) ? ' on' : ''}" data-k="${k}" tabindex="0" role="button">${moveTile(k, 0)}</div>`).join('')}</div>`;
    const b = document.createElement('button'); b.textContent = `Commencer la saison (${chosen.length}/2)`; b.disabled = chosen.length !== 2;
    b.onclick = () => { chosen.forEach(k => addMove(G, k, 0)); $('#modal').hidden = true; makeOffer(G); startMatch(); };
    $('#modal-box').appendChild(b);
    $('#modal-box').querySelectorAll('.pickable').forEach(el => {
      const t = () => { const k = el.dataset.k; const i = chosen.indexOf(k); if (i >= 0) chosen.splice(i, 1); else if (chosen.length < 2) chosen.push(k); render(); };
      el.onclick = t; el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } };
    });
  };
  show('#title'); render(); $('#modal').hidden = false;
}

function startMatch() {
  M = newMatch(G); sel = [];
  M.oppColor = CLUBS[M.opp][0] === '#f4f4f4' ? '#e9e9e9' : CLUBS[M.opp][0];
  const s = SEASON[G.stage];
  show('#match'); renderMatch();
  const rule = M.rule ? `<div class="rule"><b>Règle : ${RULES[M.rule].name}</b><br>${RULES[M.rule].desc}</div>` : '';
  modal(`<div class="label">${s.comp} · ${s.label} · match ${G.stage + 1}/9</div>
    <div class="big">${s.boss ? 'Match spécial' : 'Coup d\'envoi'}</div>
    <div>Olympique contre <b>${M.opp}</b></div>
    <div>${M.opp} annonce <b>${M.oppGoals} but${M.oppGoals > 1 ? 's' : ''}</b>. Il t'en faut <b>${M.oppGoals + 1}</b> en ${M.poss} possessions.</div>
    <div>Mur du gardien : <b>${M.wall}</b> de danger par but.</div>
    ${M.ossature ? `<div>Ossature ${M.ossature} : +1 possession.</div>` : ''}${rule}`, [['Jouer', () => {}]]);
}

function renderMatch() {
  const s = SEASON[G.stage];
  $('#g-us').textContent = M.goals; $('#g-opp').textContent = M.oppGoals;
  $('#g-need').textContent = `il faut ${M.oppGoals + 1}`;
  $('#opp-name').textContent = M.opp;
  $('#m-comp').textContent = `${s.comp} · ${s.label}`;
  $('#m-poss').innerHTML = Array.from({ length: Math.max(M.possStart, M.poss) }, (_, i) => `<i class="pip${i < M.poss ? '' : ' off'}"></i>`).join('');
  $('#m-chg').textContent = M.changes;
  $('#m-wall').textContent = Math.round(M.wall * (M.rule === 'derby' ? 1.2 : 1) * Math.pow(0.9, M.pressing) * (G.staff.includes('video') ? 0.9 : 1));
  const rc = $('#m-rule'); rc.hidden = !M.rule; if (M.rule) { rc.textContent = RULES[M.rule].name; rc.title = RULES[M.rule].desc; }
  // staff & consignes
  $('#m-staff').innerHTML = [0, 1, 2, 3].map(i => G.staff[i] ? `<div class="slot"><b>${STAFF[G.staff[i]].name}</b>${STAFF[G.staff[i]].desc}</div>` : '<div class="slot empty">Place libre</div>').join('');
  const it = $('#m-items'); it.innerHTML = '';
  if (!G.items.length) it.innerHTML = '<div class="slot empty">Aucune consigne. Achète-en au mercato.</div>';
  G.items.forEach(k => {
    const b = document.createElement('button'); b.className = 'item-btn'; b.innerHTML = `${ITEMS[k].name}<small>${ITEMS[k].desc}</small>`;
    b.onclick = () => { if (busy) return; if (useItem(k, M, G)) { renderMatch(); if (M.over) endMatch(); } };
    it.appendChild(b);
  });
  // main
  const h = $('#hand'); h.innerHTML = '';
  M.hand.forEach(id => {
    const el = cardEl(id, { fatigue: M.fatigue[id] || 0, limit: hasStaff(G, 'prepa') ? 3 : 2 });
    el.tabIndex = 0; el.setAttribute('role', 'button');
    if (sel.includes(id)) el.classList.add('sel');
    const toggle = () => { if (busy) return; const i = sel.indexOf(id); if (i >= 0) sel.splice(i, 1); else if (sel.length < 5) sel.push(id); renderMatch(); };
    el.onclick = toggle; el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
    h.appendChild(el);
  });
  $('#deckinfo').textContent = `Pioche ${M.deck.length} · Défausse ${M.discard.length} · Fatigués ${M.out.length}`;
  $('#btn-play').disabled = !sel.length || busy;
  $('#btn-play').textContent = sel.length ? `Jouer l'action (${sel.length})` : 'Jouer l\'action';
  $('#btn-change').disabled = !sel.length || sel.length > 4 || M.changes <= 0 || busy;
  $('#btn-change').textContent = `Changement (${M.changes})`;
  renderCalc();
}

function renderCalc() {
  const ev = sel.length ? evaluate(sel, M, G) : null;
  if (!ev) {
    $('#c-move').textContent = 'Choisis 1 à 5 joueurs';
    $('#c-formula').textContent = '(notes + base) × précision';
    $('#c-danger').textContent = '0';
    $('#c-verdict').textContent = ''; $('#c-syn').innerHTML = '';
  } else {
    $('#c-move').textContent = ev.move ? MOVES[ev.move].name + (ev.lv ? ` niv. ${ev.lv + 1}` : '') : 'Aucun mouvement';
    $('#c-formula').textContent = `(${ev.sum} + ${ev.base}) × ${String(ev.prec).replace('.', ',')}`;
    $('#c-danger').textContent = ev.danger;
    const v = $('#c-verdict');
    v.className = 'c-verdict ' + (ev.goals ? 'goal' : 'none');
    v.textContent = !ev.move ? 'Aucun de tes mouvements ne correspond' : ev.goals === 2 ? `Doublé ! (mur ${ev.wall})` : ev.goals ? `But ! (mur ${ev.wall}, doublé à ${ev.wall * 2})` : `Arrêté : il faut ${ev.wall}`;
    $('#c-syn').innerHTML = ev.syn.map(s => `<li class="${s.startsWith('Ego :') ? 'bad' : ''}">${s}</li>`).join('');
  }
  const active = ev && ev.move;
  $('#c-moves-label').textContent = `Tes mouvements (${G.moves.length}/6)`;
  $('#c-moves').innerHTML = G.moves.map(k => { const mv = MOVES[k], lv = G.levels[k] || 0;
    return `<div class="mv${k === active ? ' on' : ''}"><div><b>${mv.name}</b>${lv ? ' <span class="lv">niv. ' + (lv + 1) + '</span>' : ''}<br><span class="hint">${mv.desc}</span></div><span class="num">${mv.base + 10 * lv} × ${String(mv.prec + 0.5 * lv).replace('.', ',')}</span></div>`; }).join('');
}

function playSelected() {
  if (busy || !sel.length) return;
  const ev = evaluate(sel, M, G);
  busy = true; renderMatch();
  animateAction(ev.ordered, ev, () => {
    const res = playAction(sel.slice(), M, G);
    sel = [];
    const b = $('#burst');
    let txt = res.scored === 2 ? 'DOUBLÉ !!' : res.scored === 1 ? 'BUT !!' : res.cancelled ? 'BUT ANNULÉ' : 'ARRÊT !';
    b.innerHTML = `<span class="${res.scored ? '' : 'miss'}">${txt}</span>`;
    if (res.sentOff) b.innerHTML += `<span class="miss" style="position:absolute;bottom:8%">${shortName(PLAYERS[res.sentOff])} exclu</span>`;
    setTimeout(() => { b.innerHTML = ''; busy = false; renderMatch(); if (M.over) endMatch(); }, 1100);
  });
}

function endMatch() {
  const r = settle(M, G);
  const won = M.over === 'win';
  G.history.push({ stage: G.stage, opp: M.opp, us: M.goals, them: M.oppGoals, won });
  const rows = won ? `<tr><td>Prime de match</td><td>+${fmt(r.prime)}</td></tr><tr><td>Écart de buts</td><td>+${fmt(r.diff)}</td></tr>
     <tr><td>Billetterie (possessions restantes)</td><td>+${fmt(r.ticket)}</td></tr>${r.comm ? `<tr><td>Directeur commercial</td><td>+${fmt(r.comm)}</td></tr>` : ''}` : '';
  const table = `<table>${rows}<tr><td>Masse salariale</td><td>-${fmt(r.wage)}</td></tr><tr><td><b>Budget</b></td><td><b>${fmt(G.budget)}</b></td></tr></table>`;
  if (!won) {
    modal(`<div class="big">Éliminé</div><div>Olympique ${M.goals} - ${M.oppGoals} ${M.opp}</div>${seasonSummary()}`, [['Nouvelle saison', startGame], ['Menu', () => show('#title'), 'ghost']]);
    return;
  }
  if (G.stage === SEASON.length - 1) {
    modal(`<div class="big">Champion d'Europe !</div><div>Olympique ${M.goals} - ${M.oppGoals} ${M.opp}</div>${seasonSummary()}`, [['Rejouer', startGame]]);
    return;
  }
  modal(`<div class="big">Victoire</div><div>Olympique ${M.goals} - ${M.oppGoals} ${M.opp}</div>${table}`, [['Aller au mercato', () => { G.stage++; G.rerolls = 0; makeOffer(G); openMercato(); }]]);
}

function seasonSummary() {
  const top = Object.entries(G.goals).sort((a, b) => b[1] - a[1])[0];
  const wins = G.history.filter(h => h.won).length;
  return `<table><tr><td>Matchs gagnés</td><td>${wins} / 9</td></tr>
    <tr><td>Meilleur buteur</td><td>${top ? PLAYERS[top[0]].name + ' (' + top[1] + ')' : 'personne'}</td></tr>
    <tr><td>Budget final</td><td>${fmt(G.budget)}</td></tr></table>`;
}

// ===== Mercato =====
function wageTotal() { return Math.round(G.squad.reduce((a, id) => a + PLAYERS[id].salary, 0) * 10) / 10; }
function buy(cost, fn) { if (G.budget < cost) return; G.budget = Math.round((G.budget - cost) * 10) / 10; fn(); openMercato(); }

function openMercato() {
  show('#mercato');
  const s = SEASON[G.stage];
  $('#merc-money').innerHTML = `Budget : <span class="${G.budget < 0 ? 'warn' : ''}">${fmt(G.budget)}</span><br>Masse salariale : ${fmt(wageTotal())} / match`;
  const rc = rerollCost(G);
  $('#btn-reroll').textContent = `Relancer (${fmt(rc)})`;
  $('#btn-reroll').disabled = G.budget < rc;
  const sp = $('#shop-players'); sp.innerHTML = '';
  G.offer.players.forEach(id => {
    const p = PLAYERS[id];
    const d = document.createElement('div'); d.className = 'offer';
    if (!id || G.squad.includes(id)) { d.innerHTML = '<div class="slot empty">Vendu</div>'; sp.appendChild(d); return; }
    d.innerHTML = `<div class="price num">${fmt(p.price)}</div>`;
    d.appendChild(cardEl(id));
    const b = document.createElement('button'); b.textContent = 'Recruter';
    b.disabled = G.budget < p.price || G.squad.length >= 18;
    b.onclick = () => buy(p.price, () => { G.squad.push(id); });
    d.appendChild(b); sp.appendChild(d);
  });
  const tile = (cls, kind, name, desc, cost, ok, fn) => {
    const d = document.createElement('div'); d.className = 'tile ' + cls;
    d.innerHTML = `<span class="kind">${kind}</span><b>${name}</b><span>${desc}</span><div class="row"><span class="num">${fmt(cost)}</span></div>`;
    const b = document.createElement('button'); b.textContent = 'Acheter'; b.disabled = !ok || G.budget < cost; b.onclick = () => buy(cost, fn);
    d.querySelector('.row').appendChild(b); return d;
  };
  const ss = $('#shop-staff'); ss.innerHTML = '';
  G.offer.staff.forEach(k => { if (G.staff.includes(k)) return; ss.appendChild(tile('staff', 'Staff', STAFF[k].name, STAFF[k].desc, STAFF[k].cost, G.staff.length < 4, () => G.staff.push(k))); });
  if (!ss.children.length) ss.innerHTML = '<div class="hint">Plus de staff disponible.</div>';
  if (G.staff.length) { const mine = document.createElement('div'); mine.className = 'hint'; mine.textContent = 'Ton staff : ' + G.staff.map(k => STAFF[k].name).join(', '); ss.appendChild(mine); }
  const si = $('#shop-items'); si.innerHTML = '';
  G.offer.items.forEach((k, i) => { if (!k) return; si.appendChild(tile('item', 'Consigne', ITEMS[k].name, ITEMS[k].desc, ITEMS[k].cost, G.items.length < 3, () => { G.items.push(k); G.offer.items[i] = null; })); });
  if (G.items.length) { const mine = document.createElement('div'); mine.className = 'hint'; mine.textContent = 'Tes consignes : ' + G.items.map(k => ITEMS[k].name).join(', '); si.appendChild(mine); }
  const sm = $('#shop-moves'); sm.innerHTML = '';
  G.offer.moves.forEach((o, i) => {
    if (!o) return;
    const cost = movePrice(o.k, o.lv);
    const d = document.createElement('div'); d.innerHTML = moveTile(o.k, o.lv, `<div class="row"><span class="num">${fmt(cost)}</span></div>`);
    const b = document.createElement('button'); b.textContent = 'Acheter';
    b.disabled = G.budget < cost || G.moves.length >= 6;
    b.onclick = () => buy(cost, () => { addMove(G, o.k, o.lv); G.offer.moves[i] = null; });
    d.querySelector('.row').appendChild(b); sm.appendChild(d.firstElementChild);
  });
  if (!sm.children.length) sm.innerHTML = '<div class="hint">Plus de mouvement en vente.</div>';
  const om = $('#own-moves'); om.innerHTML = '';
  $('#own-moves-label').textContent = `Tes mouvements (${G.moves.length}/6)` + (G.moves.length >= 6 ? ' : retire-en un pour en acheter un autre' : '');
  G.moves.forEach(k => {
    const d = document.createElement('div'); d.innerHTML = moveTile(k, G.levels[k] || 0, '<div class="row"><span></span></div>');
    const b = document.createElement('button'); b.textContent = 'Retirer'; b.className = 'danger';
    b.disabled = G.moves.length <= 1;
    b.onclick = () => { removeMove(G, k); openMercato(); };
    d.querySelector('.row').appendChild(b); om.appendChild(d.firstElementChild);
  });
  const st = $('#shop-train'); st.innerHTML = '';
  G.offer.train.forEach((k, i) => { if (!k || !G.moves.includes(k)) return; const lv = G.levels[k]; st.appendChild(tile('train', 'Entraînement', MOVES[k].name + ` → niv. ${lv + 2}`, `${MOVES[k].desc}. +10 base, +0,5 précision.`, 4 + lv * 2, true, () => { G.levels[k]++; G.offer.train[i] = null; })); });
  // effectif
  $('#squad-label').textContent = `Ton effectif (${G.squad.length} / 18 joueurs)`;
  const sq = $('#squad'); sq.innerHTML = '';
  G.squad.slice().sort((a, b) => 'GDMA'.indexOf(PLAYERS[a].pos[0]) - 'GDMA'.indexOf(PLAYERS[b].pos[0]) || PLAYERS[b].r - PLAYERS[a].r).forEach(id => {
    const c = document.createElement('div'); c.className = 'cell';
    c.appendChild(cardEl(id));
    const goals = G.goals[id] || 0;
    const b = document.createElement('button'); b.textContent = `Vendre ${fmt(sellValue(G, id))}`;
    b.title = goals ? `${goals} but${goals > 1 ? 's' : ''} : +${goals} M€ de plus-value` : 'Moitié du prix d\'achat';
    b.disabled = G.squad.length <= 8;
    b.onclick = () => { G.budget = Math.round((G.budget + sellValue(G, id)) * 10) / 10; G.squad.splice(G.squad.indexOf(id), 1); openMercato(); };
    c.appendChild(b);
    if (goals) { const g = document.createElement('span'); g.className = 'hint'; g.textContent = `${goals} but${goals > 1 ? 's' : ''} cette saison`; c.appendChild(g); }
    sq.appendChild(c);
  });
  $('#next-info').textContent = G.budget < 0
    ? 'Budget négatif : vends un joueur avant le prochain match.'
    : `Prochain : ${s.comp}, ${s.label}. Mur ${s.wall}, l'adversaire annonce ${s.opp} but${s.opp > 1 ? 's' : ''}${s.boss ? ', avec une règle spéciale' : ''}.`;
  $('#btn-next').disabled = G.budget < 0;
}

// ===== Démarrage =====
let titlePitch;
window.addEventListener('DOMContentLoaded', () => {
  pitch.cv = $('#pitch'); Object.assign(pitch, initPitch(pitch.cv));
  titlePitch = initPitch($('#title-canvas'));
  $('#btn-new').onclick = startGame;
  $('#btn-play').onclick = playSelected;
  $('#btn-change').onclick = () => { if (busy) return; if (changeCards(sel.slice(), M)) { sel = []; renderMatch(); } };
  $('#btn-reroll').onclick = () => { const c = rerollCost(G); if (G.budget < c) return; G.budget = Math.round((G.budget - c) * 10) / 10; G.rerolls++; makeOffer(G); openMercato(); };
  $('#btn-next').onclick = startMatch;
  idleLoop();
});
