import React from 'react';
import { SavedSimulation } from '../types';
import { X, Trash2, Calendar, Award, ArrowRight, History } from 'lucide-react';

interface SavedSimulationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  simulations: SavedSimulation[];
  onSelectSimulation: (sim: SavedSimulation) => void;
  onDeleteSimulation: (id: string) => void;
  onClearAll: () => void;
}

export const SavedSimulationsDrawer: React.FC<SavedSimulationsDrawerProps> = ({
  isOpen,
  onClose,
  simulations,
  onSelectSimulation,
  onDeleteSimulation,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">Simulation History</h3>
            <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              {simulations.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {simulations.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved decision simulations yet</p>
              <p className="text-xs text-slate-400">
                Run a decision simulation to save and revisit advisor evaluations anytime.
              </p>
            </div>
          ) : (
            simulations.map((sim) => {
              const rec = sim.result.final_recommendation;
              const dateStr = new Date(sim.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={sim.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSimulation(sim.id);
                      }}
                      className="text-slate-300 hover:text-red-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete simulation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    "{sim.title}"
                  </h4>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-indigo-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Choice: {rec?.choice} ({rec?.confidence_score}%)
                    </span>

                    <button
                      onClick={() => {
                        onSelectSimulation(sim);
                        onClose();
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {simulations.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
            >
              Clear All History
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
