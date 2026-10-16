// Text effects: split a heading into characters for staggered reveals,
// and a decode/scramble cycler for the hero role line.

export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const chars = [];
  for (const c of text) {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = c === ' ' ? ' ' : c;
    s.setAttribute('aria-hidden', 'true');
    el.appendChild(s);
    chars.push(s);
  }
  return chars;
}

export function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'word';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ';

export function scrambleTo(el, target, { duration = 900 } = {}) {
  const from = el.textContent;
  const len = Math.max(from.length, target.length);
  const queue = [];
  for (let i = 0; i < len; i++) {
    const start = Math.floor(Math.random() * (duration * 0.4));
    const end = start + Math.floor(duration * 0.3 + Math.random() * duration * 0.3);
    queue.push({ from: from[i] || '', to: target[i] || '', start, end, glyph: '' });
  }
  const t0 = performance.now();
  return new Promise((resolve) => {
    function frame(now) {
      const t = now - t0;
      let out = '', done = 0;
      for (const q of queue) {
        if (t >= q.end) { out += q.to; done++; }
        else if (t >= q.start) {
          if (!q.glyph || Math.random() < 0.28) q.glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          out += q.glyph;
        } else out += q.from;
      }
      el.textContent = out;
      if (done === queue.length) resolve();
      else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

export function cycleRoles(el, roles, { hold = 2600, reduced = false } = {}) {
  if (reduced) { el.textContent = roles[0]; return; }
  let i = 0;
  const next = async () => {
    i = (i + 1) % roles.length;
    await scrambleTo(el, roles[i]);
    setTimeout(next, hold);
  };
  setTimeout(next, hold);
}
