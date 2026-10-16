// Custom dot + trailing ring cursor, and magnetic elements that drift toward
// the pointer. Only enabled on fine pointers (mouse/trackpad).

export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return false;

  document.documentElement.classList.add('has-cursor');
  const root = document.querySelector('.cursor');
  const dot = root.querySelector('.cursor__dot');
  const ring = root.querySelector('.cursor__ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  root.classList.add('is-hidden');

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    root.classList.remove('is-hidden');
  });
  document.addEventListener('pointerleave', () => root.classList.add('is-hidden'));

  (function follow() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(follow);
  })();

  const hoverables = 'a, button, [data-magnetic], .chip';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(hoverables)) root.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverables) && !e.relatedTarget?.closest?.(hoverables)) root.classList.remove('is-hover');
  });
  return true;
}

// Spring physics give the elastic "snap back" when the pointer leaves.
export function initMagnetic() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = el.classList.contains('btn') ? 0.35 : 0.25;
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, running: false };
    const tick = () => {
      s.vx = (s.vx + (s.tx - s.x) * 0.16) * 0.72;
      s.vy = (s.vy + (s.ty - s.y) * 0.16) * 0.72;
      s.x += s.vx; s.y += s.vy;
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      const settled = Math.abs(s.tx - s.x) < 0.05 && Math.abs(s.ty - s.y) < 0.05 && Math.abs(s.vx) < 0.05;
      if (settled && s.tx === 0 && s.ty === 0) { el.style.transform = ''; s.running = false; return; }
      requestAnimationFrame(tick);
    };
    const run = () => { if (!s.running) { s.running = true; requestAnimationFrame(tick); } };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      s.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      s.ty = (e.clientY - (r.top + r.height / 2)) * strength;
      run();
    });
    el.addEventListener('pointerleave', () => { s.tx = 0; s.ty = 0; run(); });
  });
}
