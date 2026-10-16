import { site, about, projects, skills, marquee, journey } from './content.js';
import { initNeural } from './neural.js';
import { splitChars, splitWords, cycleRoles } from './text-fx.js';
import { initCursor, initMagnetic } from './cursor.js';
import { mountProjectVisual } from './project-viz.js';
import { SmoothScroll, tween, ease, clamp, scrub, reveal, toggleAt, EXPO_CSS } from './motion.js';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONS = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2 .9v11.6h16V6.4l-8 5.6-8-5.6ZM5.6 6l6.4 4.5L18.4 6H5.6Z"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l6 6v12.5A1.5 1.5 0 0 1 18.5 22h-12A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2H6Zm7 1.5V9h5.5L13 3.5ZM8 13h8v1.5H8V13Zm0 3.5h8V18H8v-1.5Z"/></svg>',
};
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

/* ---------- Render content ---------- */
function render() {
  $('#tagline').textContent = site.tagline;
  $('#roleText').textContent = site.roles[0];

  $('#aboutText').innerHTML = about.lines.map((l) => `<p>${esc(l)}</p>`).join('');
  $('#stats').innerHTML = about.stats
    .map((s) => `<div class="stat"><dt>${esc(s.label)}</dt><dd data-count="${s.value}">${s.value}${esc(s.suffix)}</dd></div>`)
    .join('');

  $('#projects').innerHTML = projects
    .map(
      (p) => `
    <article class="project" data-project="${esc(p.id)}">
      <div class="project__visual"><span class="project__visual-tag">${esc(p.name)} · live</span></div>
      <div class="project__body">
        <div class="project__top"><span class="project__index">${esc(p.index)}</span><span>${esc(p.license)}</span></div>
        <h3 class="project__name">${esc(p.name)}</h3>
        <p class="project__kind">${esc(p.kind)}</p>
        <p class="project__summary">${esc(p.summary)}</p>
        <ul class="project__list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
        <a class="project__link" href="${esc(p.repo)}" target="_blank" rel="noopener" data-magnetic>
          View on GitHub <span class="arrow">${ARROW}</span>
        </a>
      </div>
    </article>`
    )
    .join('');
  projects.forEach((p) => mountProjectVisual($(`[data-project="${p.id}"] .project__visual`), p, { reduced }));

  const items = marquee.map((m) => `<span class="marquee__item">${esc(m)}</span>`).join('');
  $('#marquee').innerHTML = items + items;

  $('#skillsGrid').innerHTML = skills
    .map(
      (g) => `
    <div class="skill-card">
      <div class="skill-card__head"><h3>${esc(g.group)}</h3><span class="skill-card__count">${String(g.items.length).padStart(2, '0')}</span></div>
      <div class="chips">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>
    </div>`
    )
    .join('');

  $('#timeline').innerHTML = journey
    .map(
      (j) => `
    <li class="tl${j.future ? ' tl--future' : ''}">
      <span class="tl__when">${esc(j.when)}</span>
      <div>
        <h3 class="tl__title">${esc(j.title)}</h3>
        <p class="tl__place">${esc(j.place)}</p>
        <p class="tl__body">${esc(j.body)}</p>
      </div>
    </li>`
    )
    .join('');

  $('#emailAddr').textContent = site.email;
  const socials = [
    { label: 'GitHub', href: site.links.github, icon: ICONS.github },
    { label: 'LinkedIn', href: site.links.linkedin, icon: ICONS.linkedin },
    { label: 'Email', href: `mailto:${site.email}`, icon: ICONS.mail },
    { label: 'Resume', href: site.resume, icon: ICONS.file, download: true },
  ].filter((s) => s.href);
  $('#socials').innerHTML = socials
    .map(
      (s) =>
        `<li><a href="${esc(s.href)}" ${s.download ? 'download' : 'target="_blank" rel="noopener"'} data-magnetic>${s.icon}${esc(s.label)}</a></li>`
    )
    .join('');
  $('#year').textContent = new Date().getFullYear();
}

/* ---------- Smooth scroll ---------- */
let smooth = null;
function initScroll() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduced && fine) smooth = new SmoothScroll({ lerp: 0.095 });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    const target = href === '#top' ? null : $(href);
    if (href !== '#top' && !target) return;
    e.preventDefault();
    closeMenu();
    const y = target ? target.getBoundingClientRect().top + window.scrollY : 0;
    if (smooth) smooth.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  });
}

/* ---------- Nav ---------- */
function initNav() {
  const nav = $('#nav');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = $$('.nav__links a');
  const sections = links.map((a) => $(a.getAttribute('href')));
  const setActive = () => {
    const mid = innerHeight / 2;
    let current = null;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = links[i];
    });
    links.forEach((l) => l.classList.toggle('is-active', l === current));
  };
  window.addEventListener('scroll', setActive, { passive: true });

  const burger = $('.nav__burger'), menu = $('#mobileMenu');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      smooth?.stop();
      $$('a', menu).forEach((a, i) =>
        a.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: i * 60, easing: EXPO_CSS, fill: 'backwards' })
      );
    } else smooth?.start();
  });
}
function closeMenu() {
  const burger = $('.nav__burger');
  if (burger.getAttribute('aria-expanded') === 'true') burger.click();
}

/* ---------- Hero intro ---------- */
function intro(chars) {
  if (reduced) return;
  chars.forEach((c, i) =>
    c.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 1100, delay: 80 + i * 22, easing: EXPO_CSS, fill: 'backwards' })
  );
  const up = [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }];
  ['.nav', '.hero__eyebrow', '.hero__role', '.hero__tagline', '.hero__ctas', '.hero__meta'].forEach((sel, i) =>
    $(sel).animate(up, { duration: 1000, delay: (sel === '.nav' ? 0 : 350) + i * 70, easing: EXPO_CSS, fill: 'backwards' })
  );
  $('#neural').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, easing: 'ease-out', fill: 'backwards' });
}

/* ---------- Scroll animations ---------- */
const UP = (y = 40) => [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }];

function initReveals() {
  if (reduced) return;

  // hero drifts and fades as you scroll away
  const heroContent = $('.hero__content'), outline = $('.hero__line--outline');
  scrub($('.hero'), (p) => {
    heroContent.style.transform = `translateY(${-p * 18}%)`;
    heroContent.style.opacity = String(1 - p * 0.85);
    outline.style.transform = `translateX(${p * 6}%)`;
  }, { start: 0, end: 0, startEdge: 'top', endEdge: 'bottom' });

  $$('[data-reveal]').forEach((el) => reveal(el, UP(40)));

  // about: words light up as you read
  const words = $$('#aboutText p').flatMap((p) => splitWords(p));
  scrub($('#aboutText'), (p) => {
    const lit = p * words.length * 1.1;
    words.forEach((w, i) => (w.style.opacity = String(0.18 + 0.82 * clamp(lit - i))));
  }, { start: 0.8, end: 0.45 });

  // stats count up
  $$('.stat').forEach((stat, i) => {
    const dd = $('[data-count]', stat);
    const end = +dd.dataset.count;
    const from = end > 1000 ? end - 40 : 0;
    dd.textContent = from;
    reveal(stat, UP(30), { delay: i * 80 });
    new IntersectionObserver((entries, io) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      tween({ from, to: end, duration: 1800, delay: i * 80, easing: ease.powerOut, onUpdate: (v) => (dd.textContent = Math.round(v)) });
    }, { rootMargin: '0px 0px -10% 0px' }).observe(stat);
  });

  // projects: clip-path reveal + staggered contents + spotlight border
  $$('.project').forEach((card) => {
    reveal(card, [
      { opacity: 0, transform: 'translateY(80px)', clipPath: 'inset(12% 6% 12% 6% round 24px)' },
      { opacity: 1, transform: 'none', clipPath: 'inset(0% 0% 0% 0% round 24px)' },
    ], { duration: 1400 });
    reveal($$('.project__name, .project__kind, .project__summary, .project__list li, .chip, .project__link', card), UP(24), {
      duration: 900, delay: 250, stagger: 40, trigger: card,
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // skills
  $$('.skill-card').forEach((c, i) => {
    reveal(c, UP(50), { delay: (i % 2) * 100 });
    reveal($$('.chip', c), [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'none' }], {
      duration: 600, delay: 200 + (i % 2) * 100, stagger: 35, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', trigger: c,
    });
  });
  const mq = $('.marquee');
  scrub($('.skills'), (p) => (mq.style.transform = `rotate(-2deg) scale(1.04) translateX(${-p * 6}%)`), { start: 1, end: 0 });

  // timeline rail draws, dots light up
  const fill = $('#timelineFill');
  scrub($('.timeline-wrap'), (p) => (fill.style.transform = `scaleY(${p})`), { start: 0.65, end: 0.65 });
  $$('.tl').forEach((li) => {
    toggleAt(li, 'is-active', 0.65);
    reveal(li, [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'none' }]);
  });

  // contact headline
  reveal($$('.contact__line'), [{ opacity: 0, transform: 'translateY(60%) skewY(4deg)' }, { opacity: 1, transform: 'none' }], { duration: 1300, stagger: 120 });
}

/* ---------- Copy email ---------- */
function initEmail() {
  const btn = $('#copyEmail'), hint = $('#emailHint');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      hint.textContent = 'Copied to clipboard ✓';
    } catch {
      window.location.href = `mailto:${site.email}`;
      return;
    }
    hint.classList.add('accent');
    setTimeout(() => { hint.textContent = 'Click to copy'; hint.classList.remove('accent'); }, 2200);
  });
}

/* ---------- Boot ---------- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
render();
const chars = $$('[data-split]').flatMap((el) => splitChars(el));
initScroll();
initNav();
initCursor();
initMagnetic();
initEmail();
initNeural($('#neural'), { reduced });
cycleRoles($('#roleText'), site.roles, { reduced });
initReveals();
intro(chars);
