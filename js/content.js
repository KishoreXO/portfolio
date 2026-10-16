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
    'Autonomous agents',
    'LLM applications',
    'CSE @ Sathyabama',
  ],
  tagline:
    'I build autonomous agents and LLM-powered software end to end, from decision logic to tested, open-source releases.',
};

export const about = {
  lines: [
    "I'm a Computer Science undergraduate specializing in AI and Machine Learning at Sathyabama Institute of Science and Technology.",
    'I like systems that make their own decisions: agents that plan, react, and recover, and LLM pipelines that are typed, tested, and honest about their confidence.',
    "I'm looking for research and project opportunities in AI, and working toward building my own model.",
  ],
  stats: [
    { value: 2, suffix: '', label: 'Open-source projects' },
    { value: 35, suffix: '', label: 'Automated test suites' },
    { value: 8, suffix: '', label: 'Agent progression phases' },
    { value: 2029, suffix: '', label: 'Graduating class' },
  ],
};

export const projects = [
  {
    id: 'kestrel',
    index: '01',
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
    index: '02',
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
  { group: 'Languages', items: ['Python', 'JavaScript'] },
  {
    group: 'AI / ML',
    items: ['LLM integration', 'Decision models', 'Autonomous agents', 'Local models (Ollama, LM Studio)'],
  },
  {
    group: 'Tools',
    items: ['Node.js', 'Mineflayer', 'Docker', 'Git', 'GitHub Actions', 'uv', 'SQLite', 'ESLint', 'Playwright'],
  },
  {
    group: 'Practices',
    items: ['Automated testing', 'Web dashboards', 'Responsible data collection', 'Open-source documentation'],
  },
];

export const marquee = {
  items: [
    'Python', 'Node.js', 'LLMs', 'SQLite', 'Agents', 'Playwright',
    'Ollama', 'GitHub Actions', 'Docker', 'Mineflayer', 'vLLM', 'llama.cpp',
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
    place: 'Python · Decision models',
    body: 'Decision-model job filtering with confidence thresholds, optional LLM support, and privacy by default.',
  },
  {
    when: 'Next',
    title: 'Building my own AI model',
    place: 'Research interest',
    body: 'Autonomous agents, decision-making systems, and custom models.',
    future: true,
  },
];
