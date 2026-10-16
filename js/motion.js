// Tiny dependency-free motion toolkit: eased tweens, Lenis-style smooth
// wheel scrolling, scroll-linked "scrub" effects, and enter-viewport reveals.

export const ease = {
  expoOut: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  expoInOut: (t) => (t === 0 || t === 1 ? t : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  powerOut: (t) => 1 - Math.pow(1 - t, 3),
  powerInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
export const EXPO_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Animate a number from→to, calling onUpdate(value) each frame. */
export function tween({ from = 0, to = 1, duration = 1000, easing = ease.expoOut, delay = 0, onUpdate, onDone }) {
  return new Promise((resolve) => {
    const start = performance.now() + delay;
    const frame = (now) => {
      const t = clamp((now - start) / duration);
      if (now >= start) onUpdate(from + (to - from) * easing(t));
      if (t < 1) requestAnimationFrame(frame);
      else { onDone?.(); resolve(); }
    };
    requestAnimationFrame(frame);
  });
}

/* ---------- Smooth scroll ---------- */
export class SmoothScroll {
  constructor({ lerp = 0.1 } = {}) {
    this.lerp = lerp;
    this.target = window.scrollY;
    this.current = window.scrollY;
    this.locked = false;
    this.animating = false;
    this.anchorTween = null;
    this.listeners = new Set();

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (e.target.closest?.('[data-native-scroll]')) return;
      e.preventDefault();
      if (this.locked) return;
      this.anchorTween = null;
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      this.target = clamp(this.target + delta, 0, this.max());
      this.kick();
    }, { passive: false });

    // keyboard, scrollbar drag, touch: follow native scroll position
    window.addEventListener('scroll', () => {
      if (!this.animating) { this.target = this.current = window.scrollY; }
      this.emit();
    }, { passive: true });
  }
  max() { return document.documentElement.scrollHeight - innerHeight; }
  kick() {
    if (this.animating) return;
    this.animating = true;
    const loop = () => {
      this.current += (this.target - this.current) * this.lerp;
      if (Math.abs(this.target - this.current) < 0.5) this.current = this.target;
      window.scrollTo(0, this.current);
      if (this.current !== this.target) requestAnimationFrame(loop);
      else this.animating = false;
    };
    requestAnimationFrame(loop);
  }
  scrollTo(y, duration = 1400) {
    const from = window.scrollY, to = clamp(y, 0, this.max());
    const token = {};
    this.anchorTween = token;
    this.animating = true;
    return tween({
      from, to, duration, easing: ease.expoInOut,
      onUpdate: (v) => { if (this.anchorTween === token) window.scrollTo(0, v); },
      onDone: () => {
        if (this.anchorTween === token) { this.target = this.current = to; this.animating = false; }
      },
    });
  }
  stop() { this.locked = true; }
  start() { this.locked = false; this.target = this.current = window.scrollY; }
  on(fn) { this.listeners.add(fn); }
  emit() { this.listeners.forEach((fn) => fn(window.scrollY)); }
}

/* ---------- Scroll-linked effects ---------- */
const scrubs = [];
let scrubQueued = false;

/**
 * Calls fn(progress 0..1) as `el` moves through the viewport.
 * start/end: fraction of viewport height where the element's top (start) or
 * bottom (end) sits. e.g. start: 1 = element top at viewport bottom.
 */
export function scrub(el, fn, { start = 1, end = 0, startEdge = 'top', endEdge = 'bottom' } = {}) {
  scrubs.push({ el, fn, start, end, startEdge, endEdge });
  queueScrub();
}
function runScrubs() {
  scrubQueued = false;
  const vh = innerHeight;
  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    const a = r[s.startEdge] - s.start * vh; // 0 when start point reached
    const b = r[s.endEdge] - s.end * vh;     // 0 when end point reached
    const p = a >= 0 ? 0 : b <= 0 ? 1 : -a / (b - a);
    if (p !== s.last) { s.last = p; s.fn(clamp(p)); }
  }
}
function queueScrub() {
  if (scrubQueued) return;
  scrubQueued = true;
  requestAnimationFrame(runScrubs);
}
window.addEventListener('scroll', queueScrub, { passive: true });
window.addEventListener('resize', queueScrub);

/* ---------- Enter-viewport reveals ---------- */
/**
 * Plays a WAAPI animation the first time `el` enters the viewport.
 * keyframes: [from, to]. Elements are hidden (opacity 0) until revealed.
 */
export function reveal(els, keyframes, { duration = 1100, delay = 0, stagger = 0, easing = EXPO_CSS, rootMargin = '0px 0px -12% 0px', trigger = null } = {}) {
  const list = Array.isArray(els) ? els : [els];
  if (!list.length) return;
  list.forEach((el) => (el.style.opacity = '0'));
  const play = () => list.forEach((el, i) => {
    el.style.opacity = '';
    el.animate(keyframes, { duration, delay: delay + i * stagger, easing, fill: 'backwards' });
  });
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(); }
  }, { rootMargin });
  io.observe(trigger || list[0]);
}

/** Toggle a class while el is past a viewport line (fraction from top). */
export function toggleAt(el, cls, line = 0.65) {
  scrub(el, (p) => el.classList.toggle(cls, p > 0), { start: line, end: line, startEdge: 'top', endEdge: 'top' });
}
