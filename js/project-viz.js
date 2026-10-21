// Animated canvas illustrations for the project cards.
// Each runs only while on screen. If a screenshot exists at project.image,
// it replaces the animation automatically.

const ACCENT = '124,200,184';
const MONO = '500 11px "JetBrains Mono", ui-monospace, monospace';

function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const state = { w: 0, h: 0 };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    state.w = r.width; state.h = r.height;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  return { ctx, state };
}

function runWhenVisible(canvas, draw, reduced) {
  let raf = 0, visible = false, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(50, now - last); last = now;
    draw(dt);
    raf = visible ? requestAnimationFrame(loop) : 0;
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (reduced) { draw(16); return; }
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }, { threshold: 0.05 }).observe(canvas);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* Kestrel: jobs flow from sources → keyword prefilter → decision-model checks → matches (score ≥ 0.85) */
function kestrel(canvas, reduced) {
  const { ctx, state } = setupCanvas(canvas);
  const SOURCES = ['Greenhouse', 'Lever', 'Ashby', 'USAJOBS', 'Adzuna', 'RSS'];
  const GATES = ['exp', 'qual', 'loc', 'auth', 'legit'];
  let jobs = [], spawnT = 0, scanned = 0, shown = 0, matches = [];

  const cols = () => {
    const { w } = state;
    const src = Math.max(w * 0.14, 84);
    return { src, pre: src + (w - src) * 0.3, llm: src + (w - src) * 0.56, out: w - Math.max(44, w * 0.11) };
  };

  function spawn() {
    const { h } = state;
    const lane = (Math.random() * SOURCES.length) | 0;
    const top = h * 0.22, span = h * 0.58;
    jobs.push({
      x: cols().src, y: top + (lane + 0.5) * (span / SOURCES.length),
      ty: h * 0.51, lane, stage: 0, alpha: 1, dead: false,
      passPre: Math.random() > 0.3,
      score: Math.random() * 0.3 + 0.7,
      gates: GATES.map(() => Math.random() > 0.06),
    });
    scanned++;
  }

  return function draw(dt) {
    const { w, h } = state;
    const c = cols();
    ctx.clearRect(0, 0, w, h);

    // grid backdrop
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // stage columns
    ctx.font = MONO; ctx.textAlign = 'center';
    const stages = [[c.pre, 'PREFILTER'], [c.llm, w < 560 ? 'AI' : 'AI DECISION'], [c.out, 'MATCHES']];
    for (const [x, label] of stages) {
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.moveTo(x, Math.max(h * 0.17, 66)); ctx.lineTo(x, h * 0.85); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(163,171,184,0.9)';
      ctx.fillText(label, x, Math.max(h * 0.13, 56));
    }

    // sources
    ctx.textAlign = 'right';
    const top = h * 0.22, span = h * 0.58;
    SOURCES.forEach((s, i) => {
      const y = top + (i + 0.5) * (span / SOURCES.length);
      ctx.fillStyle = 'rgba(107,115,128,1)';
      ctx.fillText(s, c.src - 12, y + 4);
      ctx.fillStyle = `rgba(${ACCENT},0.5)`;
      ctx.beginPath(); ctx.arc(c.src, y, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    // gate chips
    const gw = Math.min(46, w * 0.07);
    GATES.forEach((g, i) => {
      const y = h * 0.3 + i * (h * 0.4 / (GATES.length - 1));
      ctx.fillStyle = 'rgba(23,28,37,0.95)';
      roundRect(ctx, c.llm - gw / 2, y - 9, gw, 18, 9); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke();
      ctx.fillStyle = 'rgba(163,171,184,1)'; ctx.textAlign = 'center';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(g, c.llm, y + 3.5);
    });
    ctx.font = MONO;

    // spawn + move jobs
    spawnT += dt;
    if (spawnT > 420) { spawnT = 0; spawn(); }
    const speed = Math.max(0.06, w / 9000) * dt;

    for (const j of jobs) {
      if (j.dead) { j.alpha -= dt / 600; j.y += dt * 0.02; continue; }
      j.x += speed;
      if (j.stage === 0) j.y += (j.ty - j.y) * 0.02 * (dt / 16);
      if (j.stage === 0 && j.x >= c.pre) { j.stage = 1; if (!j.passPre) j.dead = true; }
      else if (j.stage === 1 && j.x >= c.llm) {
        j.stage = 2;
        if (!j.gates.every(Boolean) || j.score < 0.85) j.dead = true;
      } else if (j.stage === 2 && j.x >= c.out - 14) {
        j.stage = 3; j.dead = true; j.alpha = 0; shown++;
        matches.unshift({ score: j.score, t: 0 });
        matches = matches.slice(0, 5);
      }
    }
    jobs = jobs.filter((j) => j.alpha > 0);

    for (const j of jobs) {
      const passing = j.stage >= 2 && !j.dead;
      ctx.globalAlpha = Math.max(0, j.alpha);
      ctx.fillStyle = j.dead ? 'rgba(255,120,120,0.55)' : passing ? `rgba(${ACCENT},1)` : 'rgba(220,230,240,0.85)';
      roundRect(ctx, j.x - 9, j.y - 5, 18, 10, 3); ctx.fill();
      if (passing) {
        ctx.shadowColor = `rgba(${ACCENT},0.8)`; ctx.shadowBlur = 12;
        roundRect(ctx, j.x - 9, j.y - 5, 18, 10, 3); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }

    // matches stack
    ctx.textAlign = 'left';
    matches.forEach((m, i) => {
      m.t = Math.min(1, m.t + dt / 400);
      const y = h * 0.26 + i * 30;
      const x = Math.min(c.out - 34, w - 76);
      ctx.globalAlpha = m.t * (1 - i * 0.16);
      ctx.fillStyle = 'rgba(124,200,184,0.1)';
      roundRect(ctx, x, y, 68, 22, 6); ctx.fill();
      ctx.strokeStyle = `rgba(${ACCENT},0.45)`; ctx.stroke();
      ctx.fillStyle = `rgba(${ACCENT},1)`;
      ctx.fillText(m.score.toFixed(2), x + 10, y + 15);
      ctx.fillStyle = 'rgba(163,171,184,1)';
      ctx.fillText('✓', x + 52, y + 15);
      ctx.globalAlpha = 1;
    });

    // footer counters
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(107,115,128,1)';
    ctx.fillText(`scanned ${scanned}`, 20, h - 22);
    ctx.fillStyle = `rgba(${ACCENT},1)`;
    ctx.fillText(`shown ${shown}  ·  threshold ≥ 0.85`, 20 + ctx.measureText(`scanned ${scanned}`).width + 18, h - 22);
  };
}

/* Mint: 8-phase progression board, threat radar, and a live decision stream */
function mint(canvas, reduced) {
  const { ctx, state } = setupCanvas(canvas);
  const PHASES = ['Wood', 'Crafting', 'Stone', 'Food', 'Shelter', 'Iron', 'Mining', 'Diamonds'];
  const LOG = [
    ['sched', 'chop oak_log ×12'],
    ['sched', 'craft wooden_pickaxe'],
    ['reflex', 'lava ahead → back off'],
    ['sched', 'mine stone ×24'],
    ['ai', 'zombie ×2 → fight'],
    ['sched', 'smelt raw_iron ×6'],
    ['reflex', 'drowning → surface'],
    ['ai', 'creeper close → flee'],
    ['sched', 'strip-mine y=-58'],
    ['memory', 'saved: diamond_ore'],
    ['sched', 'craft diamond_pickaxe'],
  ];
  let t = 0, phase = 0, phaseT = 0, logs = [], logT = 0, logI = 0, sweep = 0;
  const blips = [];

  return function draw(dt) {
    const { w, h } = state;
    ctx.clearRect(0, 0, w, h);
    t += dt; phaseT += dt; logT += dt; sweep += dt * 0.0022;
    if (phaseT > 1300) { phaseT = 0; phase = (phase + 1) % (PHASES.length + 2); }
    if (logT > 900) {
      logT = 0;
      logs.unshift({ ...{ k: LOG[logI][0], v: LOG[logI][1] }, a: 0 });
      logI = (logI + 1) % LOG.length;
      logs = logs.slice(0, 6);
    }
    if (Math.random() < dt / 700) blips.push({ a: Math.random() * Math.PI * 2, r: 0.25 + Math.random() * 0.7, life: 1, hostile: Math.random() < 0.4 });

    // grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 14; x < w; x += 22) for (let y = 14; y < h; y += 22) ctx.fillRect(x, y, 1, 1);

    // progression board
    const pad = 22, top = 72;
    const cols = 4, gap = 8;
    const cw = (w - pad * 2 - gap * (cols - 1)) / cols, ch = 46;
    ctx.font = MONO; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(163,171,184,0.9)';
    ctx.fillText('BRAIN BOARD', pad, top - 16);
    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(${ACCENT},1)`;
    ctx.fillText(`phase ${Math.min(phase + 1, 8)}/8`, w - pad, top - 16);
    ctx.textAlign = 'left';

    PHASES.forEach((p, i) => {
      const x = pad + (i % cols) * (cw + gap);
      const y = top + Math.floor(i / cols) * (ch + gap);
      const done = i < phase, active = i === phase;
      ctx.fillStyle = done ? 'rgba(124,200,184,0.10)' : 'rgba(23,28,37,0.9)';
      roundRect(ctx, x, y, cw, ch, 8); ctx.fill();
      ctx.strokeStyle = active ? `rgba(${ACCENT},${0.5 + 0.5 * Math.sin(t / 160)})` : done ? `rgba(${ACCENT},0.35)` : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1; ctx.stroke();
      if (active) {
        const prog = phaseT / 1300;
        ctx.fillStyle = `rgba(${ACCENT},0.5)`;
        ctx.fillRect(x + 8, y + ch - 7, (cw - 16) * prog, 2);
      }
      ctx.fillStyle = done || active ? 'rgba(238,241,245,1)' : 'rgba(107,115,128,1)';
      ctx.font = '500 12px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(p, x + 10, y + 21);
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = done ? `rgba(${ACCENT},1)` : 'rgba(107,115,128,0.9)';
      ctx.fillText(done ? '✓ done' : active ? 'running…' : `P${i + 1}`, x + 10, y + 36);
    });

    // radar
    const boardBottom = top + 2 * ch + gap;
    const narrow = w < 520;
    const rr = Math.min(w * (narrow ? 0.13 : 0.2), (h - boardBottom) * 0.36);
    const rx = pad + rr, ry = boardBottom + (h - boardBottom) / 2 + 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(rx, ry, (rr * k) / 3, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(rx - rr, ry); ctx.lineTo(rx + rr, ry); ctx.moveTo(rx, ry - rr); ctx.lineTo(rx, ry + rr); ctx.stroke();
    const grad = ctx.createConicGradient ? ctx.createConicGradient(sweep, rx, ry) : null;
    if (grad) {
      grad.addColorStop(0, `rgba(${ACCENT},0.35)`);
      grad.addColorStop(0.12, `rgba(${ACCENT},0)`);
      grad.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(rx, ry, rr, 0, Math.PI * 2); ctx.fill();
    }
    for (const b of blips) {
      b.life -= dt / 3000;
      ctx.fillStyle = b.hostile ? `rgba(255,120,120,${b.life})` : `rgba(${ACCENT},${b.life})`;
      ctx.beginPath(); ctx.arc(rx + Math.cos(b.a) * b.r * rr, ry + Math.sin(b.a) * b.r * rr, 3, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = blips.length - 1; i >= 0; i--) if (blips[i].life <= 0) blips.splice(i, 1);
    ctx.fillStyle = 'rgba(238,241,245,1)';
    ctx.beginPath(); ctx.arc(rx, ry, 3, 0, Math.PI * 2); ctx.fill();

    // decision stream
    const lx = rx + rr + (narrow ? 18 : 26);
    ctx.font = narrow ? '500 10px "JetBrains Mono", monospace' : MONO;
    ctx.fillStyle = 'rgba(163,171,184,0.9)';
    ctx.fillText('DECISION STREAM', lx, ry - rr + 4);
    logs.forEach((l, i) => {
      l.a = Math.min(1, l.a + dt / 300);
      const y = ry - rr + 28 + i * 20;
      if (y > h - 10) return;
      ctx.globalAlpha = l.a * (1 - i * 0.14);
      const col = l.k === 'reflex' ? 'rgba(255,170,120,1)' : l.k === 'ai' ? `rgba(${ACCENT},1)` : 'rgba(107,115,128,1)';
      ctx.fillStyle = col;
      ctx.fillText(`[${l.k}]`, lx, y);
      ctx.fillStyle = 'rgba(220,226,234,1)';
      ctx.fillText(l.v, lx + (narrow ? 58 : 70), y);
      ctx.globalAlpha = 1;
    });
  };
}

/* Hammertime: lap times degrading per stint, a Monte Carlo fan for the rest of the race, and the live call */
function hammertime(canvas, reduced) {
  const { ctx, state } = setupCanvas(canvas);
  const LAPS = 57, PIT = 22, WIN = [18, 24];
  const TYRE = { M: { deg: 0.09, off: 0, col: '255,214,102' }, H: { deg: 0.05, off: 0.3, col: '236,240,245' } };
  const T_MIN = 90.8, T_MAX = 94.8;
  const pace = (lap, deg, pit) => {
    const onH = lap > pit, age = onH ? lap - pit - 1 : lap - 1;
    const t = onH ? TYRE.H : TYRE.M;
    return 92 + t.off + (onH ? TYRE.H.deg : deg) * age - 0.03 * lap;
  };
  let noise = [], lap = reduced ? 30 : 1, lapT = 0, traces = [], band = [], fanA = 0, t = 0;

  function newRace() {
    noise = Array.from({ length: LAPS + 1 }, () => (Math.random() - 0.5) * 0.28);
  }
  function simulate() {
    traces = [];
    for (let k = 0; k < 28; k++) {
      const deg = TYRE.M.deg * (0.8 + Math.random() * 0.4);
      const pit = lap >= PIT ? PIT : Math.max(lap + 1, PIT + Math.round((Math.random() - 0.5) * 4));
      const tr = [];
      for (let l = lap; l <= LAPS; l++) tr.push(l === lap ? pace(l, TYRE.M.deg, PIT) + noise[l] : pace(l, deg, pit) + (Math.random() - 0.5) * 0.3);
      traces.push(tr);
    }
    band = traces[0].map((_, i) => {
      const v = traces.map((tr) => tr[i]).sort((a, b) => a - b);
      return [v[Math.floor(v.length * 0.1)], v[Math.floor(v.length * 0.5)], v[Math.ceil(v.length * 0.9) - 1]];
    });
    fanA = 0;
  }
  newRace(); simulate();

  const call = () =>
    lap === PIT ? ['BOX NOW', ACCENT] :
    lap >= WIN[0] && lap < PIT ? ['WINDOW OPEN', '255,190,110'] :
    ['STAY OUT', '163,171,184'];

  return function draw(dt) {
    const { w, h } = state;
    const narrow = w < 520;
    ctx.clearRect(0, 0, w, h);
    t += dt; lapT += dt; fanA = Math.min(1, fanA + dt / 350);
    if (lapT > (lap === PIT ? 1400 : 480)) {
      lapT = 0; lap++;
      if (lap > LAPS + 6) { lap = 1; newRace(); }
      if (lap <= LAPS) simulate();
    }
    const L = Math.min(lap, LAPS);

    // grid backdrop
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    const pad = 22, top = Math.max(h * 0.27, 112), bottom = h - 48;
    const X = (l) => pad + ((l - 1) / (LAPS - 1)) * (w - pad * 2);
    const Y = (s) => bottom - ((s - T_MIN) / (T_MAX - T_MIN)) * (bottom - top);

    // header: lap counter, tyre, call badge
    ctx.font = MONO; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(163,171,184,0.9)';
    ctx.fillText(`LAP ${String(L).padStart(2, '0')}/${LAPS}`, pad, 66);
    const onH = L > PIT, tyre = onH ? 'H' : 'M';
    const age = onH ? L - PIT - 1 : L - 1;
    const tx = pad + ctx.measureText(`LAP 00/${LAPS}`).width + 22;
    ctx.strokeStyle = `rgba(${TYRE[tyre].col},1)`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tx, 62, 7, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = `rgba(${TYRE[tyre].col},1)`; ctx.textAlign = 'center';
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillText(tyre, tx, 65);
    ctx.font = MONO; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(107,115,128,1)';
    ctx.fillText(`age ${age}`, tx + 14, 66);

    const [label, col] = lap > LAPS ? ['FINISHED', '163,171,184'] : call();
    ctx.font = '600 11px "JetBrains Mono", monospace';
    const bw = ctx.measureText(label).width + 22, bx = w - pad - bw;
    const hot = label === 'BOX NOW';
    if (hot) { ctx.shadowColor = `rgba(${col},0.9)`; ctx.shadowBlur = 10 + 6 * Math.sin(t / 120); }
    ctx.fillStyle = `rgba(${col},${hot ? 0.22 : 0.1})`;
    roundRect(ctx, bx, 51, bw, 22, 6); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(${col},0.7)`; ctx.stroke();
    ctx.fillStyle = `rgba(${col},1)`; ctx.textAlign = 'center';
    ctx.fillText(label, bx + bw / 2, 66);
    if (!narrow) {
      ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.textAlign = 'right';
      ctx.fillStyle = hot ? `rgba(${ACCENT},1)` : 'rgba(107,115,128,1)';
      ctx.fillText(hot ? 'CONFIRMED · models + sim agree' : 'Bayesian tyre model', bx - 12, 66);
    }
    ctx.font = MONO;

    // pit window
    ctx.fillStyle = 'rgba(255,190,110,0.06)';
    ctx.fillRect(X(WIN[0]), top - 8, X(WIN[1]) - X(WIN[0]), bottom - top + 8);
    ctx.fillStyle = 'rgba(255,190,110,0.7)'; ctx.textAlign = 'center';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillText(narrow ? 'WINDOW' : 'PIT WINDOW', (X(WIN[0]) + X(WIN[1])) / 2, top - 14);

    // axis
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.moveTo(pad, bottom + 0.5); ctx.lineTo(w - pad, bottom + 0.5); ctx.stroke();
    ctx.fillStyle = 'rgba(107,115,128,1)';
    for (const l of [1, 10, 20, 30, 40, 50, LAPS]) {
      ctx.fillRect(X(l), bottom, 1, 4);
      ctx.fillText(String(l), X(l), bottom + 16);
    }

    // pit stop marker
    if (L >= PIT) {
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = `rgba(${ACCENT},0.5)`;
      ctx.beginPath(); ctx.moveTo(X(PIT), top - 4); ctx.lineTo(X(PIT), bottom); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${ACCENT},1)`;
      ctx.fillText('PIT', X(PIT), bottom - 6 - (bottom - top) * 0.02);
    }

    // Monte Carlo fan for the rest of the race
    if (lap <= LAPS && band.length > 1) {
      ctx.save();
      ctx.beginPath(); ctx.rect(pad, top, w - pad * 2, bottom - top); ctx.clip();
      ctx.globalAlpha = fanA;
      ctx.fillStyle = `rgba(${ACCENT},0.12)`;
      ctx.beginPath();
      band.forEach(([lo], i) => { const x = X(L + i), y = Y(lo); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      for (let i = band.length - 1; i >= 0; i--) ctx.lineTo(X(L + i), Y(band[i][2]));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(${ACCENT},0.07)`;
      for (const tr of traces.slice(0, 14)) {
        ctx.beginPath();
        tr.forEach((s, i) => { const x = X(L + i), y = Y(s); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.stroke();
      }
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = `rgba(${ACCENT},0.8)`;
      ctx.beginPath();
      band.forEach(([, mid], i) => { const x = X(L + i), y = Y(mid); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // completed laps
    for (let l = 1; l <= L; l++) {
      const s = pace(l, TYRE.M.deg, PIT) + noise[l];
      const c = TYRE[l > PIT ? 'H' : 'M'].col;
      const latest = l === L && lap <= LAPS;
      ctx.fillStyle = `rgba(${c},${latest ? 1 : 0.75})`;
      ctx.beginPath(); ctx.arc(X(l), Y(s), latest ? 3.5 : 2.2, 0, Math.PI * 2); ctx.fill();
      if (latest) {
        ctx.strokeStyle = `rgba(${c},${0.5 + 0.4 * Math.sin(t / 140)})`;
        ctx.beginPath(); ctx.arc(X(l), Y(s), 7, 0, Math.PI * 2); ctx.stroke();
      }
    }

    // footer legend
    ctx.textAlign = 'left'; ctx.font = MONO;
    ctx.fillStyle = 'rgba(107,115,128,1)';
    const f1 = 'lap time vs lap';
    ctx.fillText(f1, pad, h - 14);
    ctx.fillStyle = `rgba(${ACCENT},1)`;
    ctx.fillText(narrow ? 'Monte Carlo · 80% range' : 'Monte Carlo rest-of-race · 80% range', pad + ctx.measureText(f1).width + 18, h - 14);
  };
}

const VIZ = { hammertime, kestrel, mint };

export function mountProjectVisual(container, project, { reduced = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const make = VIZ[project.id];
  if (make) {
    const draw = make(canvas, reduced);
    // fonts can load after first paint; redraw once they're ready
    runWhenVisible(canvas, draw, reduced);
  }

  if (project.image) {
    const img = new Image();
    img.alt = `${project.name} screenshot`;
    img.loading = 'lazy';
    img.onload = () => { container.appendChild(img); canvas.remove(); };
    img.src = project.image;
  }
}
