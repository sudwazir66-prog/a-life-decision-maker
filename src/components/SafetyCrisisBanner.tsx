import React from 'react';
import { HeartHandshake, PhoneCall, ShieldAlert, RotateCcw } from 'lucide-react';

interface SafetyCrisisBannerProps {
  message?: string;
  onReset: () => void;
}

export const SafetyCrisisBanner: React.FC<SafetyCrisisBannerProps> = ({ message, onReset }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border-2 border-red-200 rounded-3xl p-8 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            We Care About Your Safety & Well-being
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {message ||
              'This situation appears to involve personal safety, distress, or high-vulnerability circumstances. Automated decision frameworks are not equipped for situations involving crisis or harm.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-left space-y-3 max-w-lg mx-auto">
          <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-red-600" />
            Free, Confidential Support Available 24/7
          </h4>
          <ul className="text-xs text-red-800 space-y-2">
            <li className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
              <span className="font-bold">National Suicide & Crisis Lifeline (US)</span>
              <a href="tel:988" className="font-extrabold text-red-600 underline">Call or Text 988</a>
            </li>
            <li className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
              <span className="font-bold">Crisis Text Line</span>
              <span className="font-extrabold text-red-600">Text HOME to 741741</span>
            </li>
            <li className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
              <span className="font-bold">International Resources</span>
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="font-extrabold text-indigo-600 underline">findahelpline.com</a>
            </li>
          </ul>
        </div>

        <div>
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white inline-flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Decision Simulator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
