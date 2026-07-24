export interface AdvisorMeta {
  key: string;
  name: string;
  role: string;
  emoji: string;
  iconBg: string;
  badgeBg: string;
  accentBorder: string;
  description: string;
  focusArea: string;
}

export const ADVISORS: Record<string, AdvisorMeta> = {
  financial_advisor: {
    key: 'financial_advisor',
    name: 'Financial Advisor',
    role: 'Money & Capital Strategist',
    emoji: '👨‍💼',
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    accentBorder: 'border-l-4 border-l-emerald-500',
    description: 'Evaluates income, cost of living, opportunity cost, debt, savings runway, and long-term financial ROI.',
    focusArea: 'Financial Solvency & Runway',
  },
  teacher: {
    key: 'teacher',
    name: 'Learning Mentor',
    role: 'Skill & Knowledge Advisor',
    emoji: '👩‍🏫',
    iconBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    accentBorder: 'border-l-4 border-l-blue-500',
    description: 'Evaluates skill acquisition, compounding knowledge, curiosity, and career optionality.',
    focusArea: 'Growth & Optionality',
  },
  psychologist: {
    key: 'psychologist',
    name: 'Psychologist',
    role: 'Mental Health & Temperament Specialist',
    emoji: '🧠',
    iconBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    accentBorder: 'border-l-4 border-l-purple-500',
    description: 'Evaluates stress load, burnout risk, personal identity, relationship impact, and psychological fit.',
    focusArea: 'Mental Health & Burnout',
  },
  entrepreneur: {
    key: 'entrepreneur',
    name: 'Entrepreneur',
    role: 'Venture & Upside Catalyst',
    emoji: '🚀',
    iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    accentBorder: 'border-l-4 border-l-amber-500',
    description: 'Evaluates momentum, speed, upside potential, and high-reward opportunities while flagging recklessness.',
    focusArea: 'Upside & Momentum',
  },
  future_you: {
    key: 'future_you',
    name: 'Future You (5 Years Out)',
    role: 'Reflective Self Perspective',
    emoji: '👴',
    iconBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700',
    accentBorder: 'border-l-4 border-l-slate-600',
    description: 'Reflects in first-person from 5 years in the future, looking back on the real tradeoffs made.',
    focusArea: '5-Year Hindsight & Regret Minimization',
  },
};
