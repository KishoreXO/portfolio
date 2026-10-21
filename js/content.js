// All site text lives here. Edit this file to update the portfolio;
// layout and animation code read from it and never need touching.

export const site = {
  name: 'Kishore Muniyasamy',
  firstName: 'Kishore',
  lastName: 'Muniyasamy',
  location: 'Chennai, India',
  email: 'kishoremuniyasamy4@gmail.com',
  resume: 'assets/Kishore_Muniyasamy_CV.pdf',
  links: {
    github: 'https://github.com/KishoreXO',
    linkedin: 'https://www.linkedin.com/in/kishore-muniyasamy-6009093aa/',
  },
  roles: [
    'AI / ML Engineer',
    'Applied machine learning',
    'Real-time data systems',
    'Open-source builder',
    'CSE @ Sathyabama',
  ],
  tagline:
    'I turn messy, real-world data into software people can rely on, from statistical models and live data pipelines to polished dashboards and tested, open-source releases.',
};

export const about = {
  lines: [
    "I'm a Computer Science undergraduate specializing in AI and Machine Learning at Sathyabama Institute of Science and Technology, Chennai.",
    'I build across the whole stack: a live Formula 1 strategy engine with Bayesian tyre models and Monte Carlo race simulation, a self-hosted job-matching platform, and an agent that survives Minecraft on its own.',
    'What ties it together is care for the details: honest uncertainty instead of false precision, real tests, privacy by default, and interfaces people enjoy using.',
    "I'm looking for internships, research, and project opportunities in AI and ML, and I'm working toward training my own models.",
  ],
  stats: [
    { value: 3, suffix: '', label: 'Open-source projects' },
    { value: 97, suffix: '%', label: 'F1 strategy calls within 1 s of optimal' },
    { value: 40, suffix: '+', label: 'Automated test suites' },
    { value: 2029, suffix: '', label: 'Graduating class' },
  ],
};

export const projects = [
  {
    id: 'hammertime',
    index: '01',
    name: 'Hammertime',
    kind: 'Live Formula 1 race-strategy desk',
    license: 'Open source · MIT',
    repo: 'https://github.com/KishoreXO/Hammertime',
    image: '', // e.g. 'assets/projects/hammertime.webp'
    stack: ['Python', 'NumPy', 'FastAPI', 'React', 'TypeScript', 'Vite', 'OpenF1'],
    summary:
      'Follows a Formula 1 race as it happens and tells you, lap by lap, whether a car should box now, open its pit window, or stay out, on which tyre and why.',
    highlights: [
      'Strategy engine: fuel-corrected lap times, a Bayesian tyre-degradation model per driver, pit loss by track status, traffic-aware rejoins, and undercut maths.',
      'Monte Carlo simulation of the rest of the race, reporting an 80% range for every plan instead of a single guess.',
      'Measured, not claimed: 97% of decisions within 1 s of the hindsight-optimal plan in simulation, and backtested against real team stops from 2023 onwards.',
      'Seven-tab live dashboard with a GPS track map, timing, race trace, and what-if simulator; replays any race since 2023 or follows one live.',
    ],
  },
  {
    id: 'kestrel',
    index: '02',
    name: 'Kestrel',
    kind: 'Self-hosted AI job-matching platform',
    license: 'Open source · MIT',
    repo: 'https://github.com/KishoreXO/kestrel-jobs',
    // To show a screenshot instead of the animated visual, save it as
    // assets/projects/kestrel.webp and set image: 'assets/projects/kestrel.webp'
    image: '',
    stack: ['Python', 'uv', 'SQLite', 'Node.js', 'Docker', 'GitHub Actions', 'LLM APIs'],
    summary:
      'A privacy-first app that pulls openings from official job APIs and custom feeds, then surfaces only the roles that genuinely fit your profile.',
    highlights: [
      'Decision-model filtering: a local keyword prefilter, then decision models score every job on yes/no checks and weighted fit rubrics, with an optional LLM pass for nuanced calls.',
      'Shows a job only at score ≥ 0.85 with 85% confidence, plus an explanation and skill-gap view.',
      'LLM-ready: plug in hosted APIs or local models (Ollama, LM Studio, llama.cpp, vLLM) for deeper judgement. Keys never leave your machine.',
      'Preference learning from feedback, application tracker, and robots.txt-respecting, rate-limited, audited scraping.',
    ],
  },
  {
    id: 'mint',
    index: '03',
    name: 'Mint',
    kind: 'Autonomous Minecraft survival agent',
    license: 'Open source · MIT',
    repo: 'https://github.com/KishoreXO/mint-minecraft-bot',
    image: '', // e.g. 'assets/projects/mint.webp'
    stack: ['JavaScript', 'Node.js', 'Mineflayer', 'PrismarineJS', 'ESLint'],
    summary:
      'An agent that plays Minecraft survival on its own, from empty hands to a full diamond kit, across eight progression phases.',
    highlights: [
      'Priority-based behavior scheduler with a per-tick reflex layer for lava, drowning, hostile mobs, and falls.',
      'AI decision model for judgement calls like fight or flee, queried ahead of time so the agent never stalls, with a rule-based fallback.',
      'Live web dashboard: 3D world view, behavior brain board, decision stream, death replay, and cross-run history.',
      '35 automated test suites, including swimming tests on the real physics engine.',
    ],
  },
];

export const skills = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript'] },
  {
    group: 'AI / ML',
    items: [
      'Bayesian modelling',
      'Monte Carlo simulation',
      'LLM integration',
      'Autonomous agents',
      'Local models (Ollama, LM Studio)',
    ],
  },
  {
    group: 'Tools',
    items: ['NumPy', 'FastAPI', 'React', 'Node.js', 'Docker', 'Git', 'GitHub Actions', 'uv', 'SQLite', 'Playwright'],
  },
  {
    group: 'Practices',
    items: ['Automated testing', 'Real-time dashboards', 'Backtesting and evaluation', 'Privacy by default', 'Open-source documentation'],
  },
];

export const marquee = {
  items: [
    'Python', 'TypeScript', 'LLMs', 'NumPy', 'Agents', 'FastAPI',
    'Ollama', 'React', 'Docker', 'Monte Carlo', 'Node.js', 'SQLite',
  ],
  // Shown in white; everything else stays grey. Names must match `items` exactly.
  highlight: ['Python', 'LLMs', 'Agents', 'Ollama', 'Docker'],
};

export const journey = [
  {
    when: '2025 — 2029',
    title: 'B.E. Computer Science & Engineering (AI & ML)',
    place: 'Sathyabama Institute of Science and Technology, Chennai',
    body: 'Specializing in artificial intelligence and machine learning.',
  },
  {
    when: 'Open source',
    title: 'Mint — autonomous Minecraft agent',
    place: 'JavaScript · Mineflayer',
    body: 'Behavior scheduling, reflexes, AI-assisted decisions, and a live 3D dashboard.',
  },
  {
    when: 'Open source',
    title: 'Kestrel — AI job matching',
    place: 'Python · Data pipelines',
    body: 'Pulls openings from official job APIs, scores how well each fits, and explains every match. Private by default.',
  },
  {
    when: 'Open source',
    title: 'Hammertime — live F1 strategy',
    place: 'Python · TypeScript · Simulation',
    body: 'A real-time race-strategy engine with Bayesian tyre models, Monte Carlo simulation, and a live dashboard.',
  },
  {
    when: 'Next',
    title: 'Training my own models',
    place: 'Research interest',
    body: 'Applied ML, simulation, and models that know how sure they are.',
    future: true,
  },
];
