import React, { useState } from 'react';
import { UserContext } from '../types';
import { PRESET_PROMPTS, PresetPrompt } from '../data/presets';
import { 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  HelpCircle, 
  DollarSign, 
  ShieldAlert, 
  Clock, 
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (context: UserContext) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced context variables
  const [financialRunway, setFinancialRunway] = useState('6-12 months');
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [timeHorizon, setTimeHorizon] = useState('6-12 months');
  const [primaryPriority, setPrimaryPriority] = useState('Learning & Mastery');

  const handleSelectPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setOptionA(preset.optionA);
    setOptionB(preset.optionB);
    setFinancialRunway(preset.runway);
    setRiskTolerance(preset.riskTolerance);
    setPrimaryPriority(preset.priority);
    setShowAdvanced(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSubmit({
      prompt: prompt.trim(),
      optionA_override: optionA.trim() || undefined,
      optionB_override: optionB.trim() || undefined,
      financial_runway: financialRunway,
      risk_tolerance: riskTolerance,
      time_horizon: timeHorizon,
      primary_priority: primaryPriority,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Multi-Perspective Synthetic Reasoning Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simulate Your Next High-Stakes Choice
        </h2>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Evaluate careers, relocation, business ventures, degrees, or personal investments through five specialized advisors with competing professional biases.
        </p>
      </div>

      {/* Preset Prompts Selector */}
      <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Explore Realistic Life Scenarios
          </span>
          <span className="text-xs text-slate-400">Click to auto-populate</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {preset.category}
                </span>
                <span className="text-[10px] text-slate-400">Risk {preset.riskTolerance}/5</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {preset.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <label htmlFor="decision-prompt" className="block text-sm font-bold text-slate-800 mb-2">
            What high-stakes decision are you facing? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="decision-prompt"
            required
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I received a $180k job offer at a stable corporate firm in New York, but my friend wants me to co-found a stealth AI startup in San Francisco with $20k initial investment. I have $35k in savings and 2 years of experience..."
            className="w-full p-4 text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Include specific numbers, locations, salaries, timelines, or partner details if available.
          </p>
        </div>

        {/* Option A & Option B overrides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="option-a-label" className="block text-xs font-bold text-slate-700 mb-1.5">
              Option A Label <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="option-a-label"
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. Corporate Firm in NY"
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="option-b-label" className="block text-xs font-bold text-slate-700 mb-1.5">
              Option B Label <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="option-b-label"
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. AI Startup in SF / Stay Course"
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Advanced Context Toggle */}
        <div className="mb-6 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            id="toggle-advanced-context"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Personal Constraints' : 'Add Personal Constraints & Risk Tolerance (+ accuracy)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Financial Runway */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Savings Runway / Buffer
                </label>
                <select
                  value={financialRunway}
                  onChange={(e) => setFinancialRunway(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                >
                  <option value="Tight (< 3 months)">Tight (&lt; 3 months)</option>
                  <option value="Moderate (3-6 months)">Moderate (3-6 months)</option>
                  <option value="Comfortable (6-12 months)">Comfortable (6-12 months)</option>
                  <option value="Substantial (12+ months)">Substantial (12+ months)</option>
                  <option value="High Debt / Vulnerable">High Debt / Vulnerable</option>
                </select>
              </div>

              {/* Risk Tolerance Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Personal Risk Tolerance: Level {riskTolerance}/5
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {riskTolerance === 1 && 'Conservative'}
                    {riskTolerance === 2 && 'Cautious'}
                    {riskTolerance === 3 && 'Balanced'}
                    {riskTolerance === 4 && 'Growth-Seeking'}
                    {riskTolerance === 5 && 'High Risk / Aggressive'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Decision Horizon */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Decision Timeline
                </label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                >
                  <option value="Immediate (This week)">Immediate (This week)</option>
                  <option value="Short term (1-3 months)">Short term (1-3 months)</option>
                  <option value="Medium term (6-12 months)">Medium term (6-12 months)</option>
                  <option value="Long term (1+ year)">Long term (1+ year)</option>
                </select>
              </div>

              {/* Primary Priority */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-purple-600" />
                  Primary Priority Right Now
                </label>
                <select
                  value={primaryPriority}
                  onChange={(e) => setPrimaryPriority(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                >
                  <option value="Financial Growth & Security">Financial Growth & Security</option>
                  <option value="Learning & Skill Mastery">Learning & Skill Mastery</option>
                  <option value="Mental Peace & Burnout Avoidance">Mental Peace & Burnout Avoidance</option>
                  <option value="Upside & Career Velocity">Upside & Career Velocity</option>
                  <option value="Relationship & Family Harmony">Relationship & Family Harmony</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Simulates 5 distinct professional advisors + confidence calibration</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            id="run-simulation-submit-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Convening 5 Advisors...</span>
              </>
            ) : (
              <>
                <span>Simulate Decision</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
