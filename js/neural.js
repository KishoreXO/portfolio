// Interactive neural-network background: drifting nodes, proximity links,
// pulses travelling along links, and a cursor that pulls nearby nodes in.

export function initNeural(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const ACCENT = [124, 200, 184];
  const mouse = { x: -9999, y: -9999, active: false };
  let w = 0, h = 0, dpr = 1, nodes = [], pulses = [], raf = 0, visible = true;
  let linkDist = 140;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    linkDist = w < 640 ? 110 : 150;
    const count = Math.round(Math.min(90, Math.max(32, (w * h) / 16000)));
    nodes = Array.from({ length: count }, () => {
      const x = Math.random() * w, y = Math.random() * h;
      return {
        x, y, ox: x, oy: y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.4 + 0.6,
        hub: Math.random() < 0.06,
      };
    });
    pulses = [];
  }

  function spawnPulse() {
    const a = nodes[(Math.random() * nodes.length) | 0];
    let best = null, bd = Infinity;
    for (const b of nodes) {
      if (b === a) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < linkDist && d < bd && Math.random() > 0.3) { best = b; bd = d; }
    }
    if (best) pulses.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.012 });
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      // gentle spring back toward home so the field never clumps
      n.vx += (n.ox - n.x) * 0.0004;
      n.vy += (n.oy - n.y) * 0.0004;
      if (mouse.active) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 200 && d > 1) {
          const f = (1 - d / 200) * 0.03;
          n.vx += (dx / d) * f; n.vy += (dy / d) * f;
        }
      }
      n.vx *= 0.97; n.vy *= 0.97;
      n.vx += (Math.random() - 0.5) * 0.006;
      n.vy += (Math.random() - 0.5) * 0.006;
    }

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkDist * linkDist) continue;
        const d = Math.sqrt(d2);
        let alpha = (1 - d / linkDist) * 0.12;
        if (mouse.active) {
          const md = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2);
          if (md < 180) alpha += (1 - md / 180) * 0.22;
        }
        ctx.strokeStyle = `rgba(${ACCENT},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    // mouse links
    if (mouse.active) {
      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < 160) {
          ctx.strokeStyle = `rgba(${ACCENT},${((1 - d / 160) * 0.22).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }
    }

    // pulses: "signals" firing between neurons
    if (Math.random() < 0.025 && pulses.length < 6) spawnPulse();
    pulses = pulses.filter((p) => {
      p.t += p.speed * 0.6;
      if (p.t >= 1) return false;
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, `rgba(${ACCENT},0.55)`);
      g.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    // nodes
    for (const n of nodes) {
      let a = n.hub ? 0.55 : 0.28;
      if (mouse.active) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < 160) a = Math.min(0.8, a + (1 - d / 160) * 0.5);
      }
      ctx.fillStyle = n.hub ? `rgba(${ACCENT},${a})` : `rgba(220,230,240,${a})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r + 0.6 : n.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() {
    if (!visible) { raf = 0; return; }
    step();
    raf = requestAnimationFrame(loop);
  }

  const hero = canvas.parentElement;
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  hero.addEventListener('pointerleave', () => { mouse.active = false; });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf && !reduced) loop();
  }).observe(canvas);

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); if (reduced) step(); }, 150);
  });

  resize();
  if (reduced) step(); else loop();
}
