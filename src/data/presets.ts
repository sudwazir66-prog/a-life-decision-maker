export interface PresetPrompt {
  id: string;
  title: string;
  category: string;
  prompt: string;
  optionA: string;
  optionB: string;
  runway: string;
  riskTolerance: number;
  priority: string;
}

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'career-startup',
    title: 'Big Tech Offer vs. Seed Startup Founder',
    category: 'Career',
    prompt: 'I received a senior software engineer offer at a Big Tech company ($220k total comp, great WLB). At the same time, my former manager asked me to join a Seed-funded startup as a founding engineer with 2% equity and $130k salary. I have $45k in savings and no dependents.',
    optionA: 'Accept Big Tech Offer',
    optionB: 'Join Seed Startup as Founding Engineer',
    runway: '12+ months',
    riskTolerance: 4,
    priority: 'Learning & Mastery',
  },
  {
    id: 'relocation-partner',
    title: 'Relocate Overseas for Partner vs. Local Career Growth',
    category: 'Relocation',
    prompt: 'My partner got a 3-year assignment in London with her firm. I have a burgeoning career in Chicago where I just got promoted to Director. If I move, I will likely have to take a remote contractor role or pause working for 6 months while securing a visa.',
    optionA: 'Move to London with Partner',
    optionB: 'Stay in Chicago & Try Long Distance',
    runway: '6-12 months',
    riskTolerance: 3,
    priority: 'Mental Peace & Balance',
  },
  {
    id: 'grad-school',
    title: 'Self-Funded MBA vs. On-the-job Upskilling',
    category: 'Education',
    prompt: 'I was accepted into a Top 10 MBA program. Tuition and living costs will be $160k in debt. Alternatively, I can stay at my current product management role ($110k/yr) and pursue internal promotion or online executive courses.',
    optionA: 'Attend Top 10 MBA Program',
    optionB: 'Stay in PM Role & Self-Study',
    runway: '6-12 months',
    riskTolerance: 2,
    priority: 'Financial Growth',
  },
  {
    id: 'buy-home',
    title: 'Buy Starter Home Now vs. Keep Renting & Investing',
    category: 'Finance',
    prompt: 'I have $70k saved. I am debating buying a $380k condo in my city with high mortgage rates, or continuing to rent a nice apartment for $2,100/mo while investing my surplus savings into index funds.',
    optionA: 'Buy Starter Condo Now',
    optionB: 'Rent & Invest Surplus',
    runway: '12+ months',
    riskTolerance: 2,
    priority: 'Financial Growth',
  },
  {
    id: 'sabbatical',
    title: 'Take 6-Month Career Sabbatical vs. Push Through Burnout',
    category: 'Well-being',
    prompt: 'I am experiencing severe burnout after 6 years in high-volume management consulting. I have $60k in liquid savings. I want to take a 6-month unpaid break to travel and recharge before pivoting careers, but I fear the gap on my resume.',
    optionA: 'Take 6-Month Unpaid Sabbatical',
    optionB: 'Stay Employed & Job Hunt On The Side',
    runway: '12+ months',
    riskTolerance: 3,
    priority: 'Mental Peace & Balance',
  },
];
