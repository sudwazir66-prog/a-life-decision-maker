import React from 'react';
import { Compass, History, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
  onSelectPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onReset,
  onSelectPresets,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group"
          id="app-header-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight leading-none">
                AI Life Decision Simulator
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                5-Advisor Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Balanced, multi-lens reasoning for high-stakes choices
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onSelectPresets}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            id="preset-examples-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Decisions</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            id="history-drawer-btn"
            title="Saved decision simulations"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            id="new-simulation-btn"
            title="Start new decision"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
