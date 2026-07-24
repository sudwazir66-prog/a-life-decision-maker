import React, { useState } from 'react';
import { DecisionEvaluation, UserContext } from '../types';
import { ADVISORS } from '../utils/advisors';
import { 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Scale, 
  ShieldAlert, 
  Calendar, 
  Copy, 
  Check, 
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  TrendingUp,
  Brain,
  Clock
} from 'lucide-react';

interface SimulationResultsProps {
  result: DecisionEvaluation;
  userContext: UserContext;
  onReset: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  result,
  userContext,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'advisors' | 'comparison' | 'risks' | 'outcomes' | 'whatif'>('advisors');
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);

  // Sensitivity Simulator Local State
  const [whatIfRunway, setWhatIfRunway] = useState(userContext.financial_runway || '6-12 months');
  const [whatIfRisk, setWhatIfRisk] = useState(userContext.risk_tolerance || 3);
  const [whatIfPriority, setWhatIfPriority] = useState(userContext.primary_priority || 'Learning & Mastery');

  const optionALabel = result.options?.find((o) => o.id === 'A')?.label || 'Option A';
  const optionBLabel = result.options?.find((o) => o.id === 'B')?.label || 'Option B';

  const rec = result.final_recommendation;
  const perspectives = result.perspectives;

  // Calculate advisor consensus vs disagreement
  const advisorList = [
    { id: 'financial_advisor', ...perspectives?.financial_advisor },
    { id: 'teacher', ...perspectives?.teacher },
    { id: 'psychologist', ...perspectives?.psychologist },
    { id: 'entrepreneur', ...perspectives?.entrepreneur },
    { id: 'future_you', ...perspectives?.future_you },
  ];

  const votes = {
    A: advisorList.filter((a) => a.verdict === 'A').length,
    B: advisorList.filter((a) => a.verdict === 'B').length,
    either: advisorList.filter((a) => a.verdict === 'either').length,
    more_info_needed: advisorList.filter((a) => a.verdict === 'more_info_needed').length,
  };

  const hasDisagreement = votes.A > 0 && votes.B > 0;

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'A':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Prefers {optionALabel}
          </span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Prefers {optionBLabel}
          </span>
        );
      case 'either':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Neutral / Either Choice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Needs More Info
          </span>
        );
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 55) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence Verdict';
    if (score >= 60) return 'Moderate Advantage';
    if (score >= 45) return 'Balanced / Close Call';
    return 'High Uncertainty / Toss-up';
  };

  const handleCopyMarkdown = () => {
    const text = `# Life Decision Simulation Report

## Decision Summary
${result.decision_summary}

**Option A:** ${optionALabel}
**Option B:** ${optionBLabel}

---

## Final Recommendation
- **Choice:** ${rec.choice === 'A' ? optionALabel : rec.choice === 'B' ? optionBLabel : rec.choice}
- **Confidence Score:** ${rec.confidence_score}/100 (${getConfidenceLabel(rec.confidence_score)})
- **Deciding Factor:** ${rec.one_line_reason}
- **Flip Caveat:** ${rec.caveat}

---

## Advisor Perspectives

### 👨‍💼 Financial Advisor (Money & Capital)
**Verdict:** ${perspectives.financial_advisor.verdict}
*${perspectives.financial_advisor.reasoning}*

### 👩‍🏫 Learning Mentor (Skills & Growth)
**Verdict:** ${perspectives.teacher.verdict}
*${perspectives.teacher.reasoning}*

### 🧠 Psychologist (Mental Health & Burnout)
**Verdict:** ${perspectives.psychologist.verdict}
*${perspectives.psychologist.reasoning}*

### 🚀 Entrepreneur (Upside & Momentum)
**Verdict:** ${perspectives.entrepreneur.verdict}
*${perspectives.entrepreneur.reasoning}*

### 👴 Future You (5 Years Out)
**Verdict:** ${perspectives.future_you.verdict}
*"${perspectives.future_you.reasoning}"*

---
Simulated via AI Life Decision Simulator.
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Title */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Simulation Complete
            </span>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Risk Level: {userContext.risk_tolerance || 3}/5</span>
              <span>•</span>
              <span>Priority: {userContext.primary_priority || 'Balanced'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            "{result.decision_summary}"
          </h2>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-200">
              Option A: <span className="text-indigo-400">{optionALabel}</span>
            </div>
            <span className="text-slate-500 text-xs font-bold">VS</span>
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-slate-200">
              Option B: <span className="text-purple-400">{optionBLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Balanced Recommendation Synthesis
            </span>
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {rec.choice === 'A' && `Lean Toward ${optionALabel}`}
                {rec.choice === 'B' && `Lean Toward ${optionBLabel}`}
                {rec.choice === 'either' && `Either Option is Viable`}
                {rec.choice === 'need_more_info' && `More Context Needed Before Choosing`}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              <span className="text-indigo-600">Core Deciding Factor:</span> {rec.one_line_reason}
            </p>
          </div>

          {/* Calibrated Confidence Score Dial */}
          <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Calibrated Confidence
            </div>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-4xl font-black text-slate-900">{rec.confidence_score}</span>
              <span className="text-sm font-bold text-slate-400">/100</span>
            </div>
            <div className={`mt-2 px-3 py-1 rounded-full text-[11px] font-bold border ${getConfidenceColor(rec.confidence_score)}`}>
              {getConfidenceLabel(rec.confidence_score)}
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400 max-w-[180px]">
              Reflects evidence strength, not stakes
            </p>
          </div>
        </div>

        {/* Flip Caveat Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-900 uppercase tracking-wider">
              The Critical Flip Caveat
            </span>
            <p className="text-amber-800 leading-relaxed font-medium">
              "{rec.caveat}"
            </p>
          </div>
        </div>

        {/* Advisor Breakdown Snapshot Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Scale className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Advisor Panel Breakdown ({votes.A} for A, {votes.B} for B)
              </h4>
              <p className="text-[11px] text-slate-500">
                {hasDisagreement 
                  ? '🔥 Visible debate between advisors — explore their competing biases below!'
                  : 'Strong consensus across advisor lenses.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
              {optionALabel}: {votes.A}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
              {optionBLabel}: {votes.B}
            </span>
            {votes.either > 0 && (
              <span className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700">
                Neutral: {votes.either}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Deep Dive Sections */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('advisors')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'advisors'
              ? 'bg-white text-indigo-600 border border-slate-200 border-b-white -mb-px shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="tab-advisors"
        >
          <span className="flex items-center space-x-1.5">
            <span>👥 The 5 Advisors ({advisorList.length})</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-white text-indigo-600 border border-slate-200 border-b-white -mb-px shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="tab-comparison"
        >
          <span className="flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Comparison Matrix & Pros/Cons</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'risks'
              ? 'bg-white text-indigo-600 border border-slate-200 border-b-white -mb-px shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="tab-risks"
        >
          <span className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Risk Spectrum ({result.risks?.length || 0})</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outcomes')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'outcomes'
              ? 'bg-white text-indigo-600 border border-slate-200 border-b-white -mb-px shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="tab-outcomes"
        >
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Timeline Trajectory</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'whatif'
              ? 'bg-white text-indigo-600 border border-slate-200 border-b-white -mb-px shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          id="tab-whatif"
        >
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            <span>What-If Stress Test</span>
          </span>
        </button>
      </div>

      {/* TAB 1: THE 5 ADVISORS */}
      {activeTab === 'advisors' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Individual Advisor Evaluations & Competing Biases
            </h3>
            <span className="text-xs text-slate-500">
              Click any advisor to expand
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(ADVISORS).map(([key, meta]) => {
              const adv = perspectives?.[key as keyof typeof perspectives];
              if (!adv) return null;

              const isExpanded = expandedAdvisor === key || expandedAdvisor === null;

              return (
                <div
                  key={key}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${meta.accentBorder} border-slate-200`}
                >
                  <div
                    onClick={() => setExpandedAdvisor(expandedAdvisor === key ? null : key)}
                    className="flex items-start justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xs ${meta.iconBg}`}>
                        {meta.emoji}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {meta.name}
                          </h4>
                          <span className="text-xs text-slate-400">• {meta.role}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {meta.focusArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getVerdictBadge(adv.verdict)}
                      <button 
                        type="button" 
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Reasoning Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-start space-x-2 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                        <MessageSquareQuote className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <p className="italic">
                          "{adv.reasoning}"
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        *Advisor Bias: {meta.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPARISON MATRIX & PROS/CONS */}
      {activeTab === 'comparison' && (
        <div className="space-y-8">
          {/* Criterion Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Criterion Comparison Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-3">Criterion</th>
                    <th className="p-3 text-indigo-700 bg-indigo-50/50">{optionALabel}</th>
                    <th className="p-3 text-purple-700 bg-purple-50/50">{optionBLabel}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.comparison?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-500" />
                        {item.criterion}
                      </td>
                      <td className="p-3 text-slate-700 bg-indigo-50/20 font-medium">
                        {item.option_a}
                      </td>
                      <td className="p-3 text-slate-700 bg-purple-50/20 font-medium">
                        {item.option_b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pros & Cons Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A Pros & Cons */}
            <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Option A
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {optionALabel}
                </h4>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pros
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.pros_cons?.A?.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-600" /> Cons
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.pros_cons?.A?.cons?.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 bg-red-50/50 p-2 rounded-lg border border-red-100">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Option B Pros & Cons */}
            <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Option B
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {optionBLabel}
                </h4>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pros
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.pros_cons?.B?.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-600" /> Cons
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.pros_cons?.B?.cons?.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 bg-red-50/50 p-2 rounded-lg border border-red-100">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RISK SPECTRUM */}
      {activeTab === 'risks' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Risk Spectrum & Downside Severity
            </h3>
            <span className="text-xs text-slate-500">Categorized by potential impact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.risks?.map((r, i) => {
              const isHigh = r.severity === 'high';
              const isMedium = r.severity === 'medium';

              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isHigh
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : isMedium
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      isHigh ? 'bg-red-200 text-red-900' : isMedium ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {r.severity} Severity
                    </span>

                    <span className="font-semibold text-[11px] text-slate-600">
                      Applies to: {r.applies_to === 'A' ? optionALabel : r.applies_to === 'B' ? optionBLabel : 'Both Options'}
                    </span>
                  </div>

                  <p className="font-medium leading-relaxed">
                    {r.risk}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: OUTCOMES TIMELINE */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Projected Trajectory Horizons
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Short Term */}
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Short-Term Horizon (6-12 Months)
                </span>
                
                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-lg border border-blue-100 text-xs">
                    <span className="font-bold text-indigo-700 block mb-1">{optionALabel}:</span>
                    <p className="text-slate-700 leading-relaxed">{result.outcomes?.short_term?.A}</p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-blue-100 text-xs">
                    <span className="font-bold text-purple-700 block mb-1">{optionBLabel}:</span>
                    <p className="text-slate-700 leading-relaxed">{result.outcomes?.short_term?.B}</p>
                  </div>
                </div>
              </div>

              {/* Long Term */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-600" /> Long-Term Horizon (5 Years)
                </span>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs">
                    <span className="font-bold text-indigo-700 block mb-1">{optionALabel}:</span>
                    <p className="text-slate-700 leading-relaxed">{result.outcomes?.long_term?.A}</p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs">
                    <span className="font-bold text-purple-700 block mb-1">{optionBLabel}:</span>
                    <p className="text-slate-700 leading-relaxed">{result.outcomes?.long_term?.B}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHAT-IF STRESS TEST SIMULATOR */}
      {activeTab === 'whatif' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Hypothetical "What-If" Sensitivity Stress Test
            </h3>
            <p className="text-xs text-slate-500">
              Adjust variables dynamically to see how personal constraints alter advisor leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {/* Runway */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Financial Runway Buffer
              </label>
              <select
                value={whatIfRunway}
                onChange={(e) => setWhatIfRunway(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Tight (< 3 months)">Tight (&lt; 3 months)</option>
                <option value="Moderate (3-6 months)">Moderate (3-6 months)</option>
                <option value="Comfortable (6-12 months)">Comfortable (6-12 months)</option>
                <option value="Substantial (12+ months)">Substantial (12+ months)</option>
              </select>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Risk Tolerance Level ({whatIfRisk}/5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={whatIfRisk}
                onChange={(e) => setWhatIfRisk(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Shifted Core Priority
              </label>
              <select
                value={whatIfPriority}
                onChange={(e) => setWhatIfPriority(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Financial Growth & Security">Financial Growth & Security</option>
                <option value="Learning & Skill Mastery">Learning & Skill Mastery</option>
                <option value="Mental Peace & Burnout Avoidance">Mental Peace & Burnout Avoidance</option>
                <option value="Upside & Career Velocity">Upside & Career Velocity</option>
              </select>
            </div>
          </div>

          {/* Dynamic Sensitivity Impact Analysis Box */}
          <div className="p-5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-3">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600" />
              Advisor Sensitivity Forecast
            </h4>

            {whatIfRisk <= 2 && (
              <p className="text-indigo-900 leading-relaxed">
                ⚠️ <strong>Conservative shift (Risk Level {whatIfRisk}):</strong> The Financial Advisor 👨‍💼 and Psychologist 🧠 gain stronger veto leverage. High-variance choices will be heavily penalized unless backed by 12+ months of liquid savings.
              </p>
            )}

            {whatIfRisk >= 4 && (
              <p className="text-indigo-900 leading-relaxed">
                🚀 <strong>High Growth shift (Risk Level {whatIfRisk}):</strong> The Entrepreneur 🚀 and Learning Mentor 👩‍🏫 gain maximum sway. As long as runway avoids debt crisis, high-upside learning moves become dominant.
              </p>
            )}

            {whatIfPriority.includes('Mental Peace') && (
              <p className="text-indigo-900 leading-relaxed">
                🧠 <strong>Mental Peace shift:</strong> The Psychologist 🧠 flags any option with severe burnout, travel friction, or ambiguity as unsustainable regardless of monetary ROI.
              </p>
            )}

            {whatIfRunway.includes('Tight') && (
              <p className="text-red-900 bg-red-100/80 p-2.5 rounded-lg border border-red-200 leading-relaxed font-semibold">
                🚨 <strong>Tight Financial Runway (&lt; 3 months):</strong> All advisors concur that financial survival overrides long-term optionality until a 6-month buffer is established.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-2 transition-colors cursor-pointer"
          id="simulate-another-decision-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Simulate Another Decision</span>
        </button>

        <button
          onClick={handleCopyMarkdown}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center space-x-2 transition-colors cursor-pointer"
          id="copy-report-markdown-btn"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Report Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Report (Markdown)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
