import React, { useState, useEffect } from 'react';
import { UserContext, DecisionEvaluation, SavedSimulation } from './types';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { SimulationResults } from './components/SimulationResults';
import { SavedSimulationsDrawer } from './components/SavedSimulationsDrawer';
import { SafetyCrisisBanner } from './components/SafetyCrisisBanner';
import { PRESET_PROMPTS } from './data/presets';
import { AlertCircle, Compass, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_life_decision_simulations_v1';

export default function App() {
  const [currentResult, setCurrentResult] = useState<DecisionEvaluation | null>(null);
  const [currentContext, setCurrentContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load saved history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Cycle loading steps for pleasant feedback
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const steps = [
      'Convening 5 specialized advisors...',
      'Financial Advisor 👨‍💼 evaluating cash runway & ROI...',
      'Learning Mentor 👩‍🏫 assessing skill trajectory...',
      'Psychologist 🧠 weighing burnout & temperament...',
      'Entrepreneur 🚀 calculating upside & momentum...',
      'Future You 👴 reflecting from 5 years out...',
      'Synthesizing advisor debate & calibrating confidence...',
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  const saveToHistory = (context: UserContext, result: DecisionEvaluation) => {
    const newSim: SavedSimulation = {
      id: Date.now().toString(),
      title: result.decision_summary || context.prompt.slice(0, 60),
      timestamp: Date.now(),
      userContext: context,
      result,
    };

    const updated = [newSim, ...history.filter((h) => h.id !== newSim.id)].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleEvaluate = async (context: UserContext) => {
    setIsLoading(true);
    setError(null);
    setCurrentContext(context);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const data: DecisionEvaluation = await response.json();
      setCurrentResult(data);

      if (!data.is_safety_crisis) {
        saveToHistory(context, data);
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'An error occurred during evaluation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setCurrentContext(null);
    setError(null);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  const loadingMessages = [
    'Convening 5 specialized advisors...',
    'Financial Advisor 👨‍💼 evaluating cash runway & ROI...',
    'Learning Mentor 👩‍🏫 assessing skill trajectory...',
    'Psychologist 🧠 weighing burnout & temperament...',
    'Entrepreneur 🚀 calculating upside & momentum...',
    'Future You 👴 reflecting from 5 years out...',
    'Synthesizing advisor debate & calibrating confidence...',
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        onSelectPresets={() => handleReset()}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start space-x-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold block">Simulation Error</span>
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-bold text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-2xl animate-pulse">
              <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Simulating Advisor Panel
              </h3>
              <p className="text-sm font-semibold text-indigo-600 animate-fade-in transition-all">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === loadingStep ? 'bg-indigo-600 w-6' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Router */}
        {!isLoading && (
          <>
            {currentResult ? (
              currentResult.is_safety_crisis ? (
                <SafetyCrisisBanner
                  message={currentResult.safety_message}
                  onReset={handleReset}
                />
              ) : (
                currentContext && (
                  <SimulationResults
                    result={currentResult}
                    userContext={currentContext}
                    onReset={handleReset}
                  />
                )
              )
            ) : (
              <DecisionForm onSubmit={handleEvaluate} isLoading={isLoading} />
            )}
          </>
        )}
      </main>

      {/* History Slide-over Drawer */}
      <SavedSimulationsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        simulations={history}
        onSelectSimulation={(sim) => {
          setCurrentResult(sim.result);
          setCurrentContext(sim.userContext);
          setError(null);
        }}
        onDeleteSimulation={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">AI Life Decision Simulator</span>
            <span>— Autonomous multi-perspective reasoning</span>
          </div>

          <p className="text-slate-400">
            Advisors provide structured reasoning & tradeoffs. Always retain full personal autonomy.
          </p>
        </div>
      </footer>
    </div>
  );
}
