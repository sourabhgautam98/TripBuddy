'use client';

import { Calendar } from 'lucide-react';

interface DurationSelectorProps {
  value: number;
  onChange: (val: number) => void;
}

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  const presets = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Trip Duration <span className="text-cyan-400">*</span>
        </label>
        {value > 0 ? (
          <span className="text-xs font-bold text-cyan-400">
            {value} {value === 1 ? 'Day' : 'Days'} Selected
          </span>
        ) : (
          <span className="text-xs text-amber-400/80 font-medium">Please select or type days</span>
        )}
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-2">
        {presets.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => onChange(days)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 border ${
              value === days
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
            }`}
          >
            {days} {days === 1 ? 'Day' : 'Days'}
          </button>
        ))}
      </div>

      {/* Custom Duration Input */}
      <div className="flex items-center gap-3 pt-1">
        <div className="relative flex-1">
          <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400 pointer-events-none" />
          <input
            type="number"
            min="1"
            max="60"
            value={value > 0 ? value : ''}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0) {
                onChange(Math.min(60, val));
              } else {
                onChange(0);
              }
            }}
            placeholder="Type custom days (e.g. 15, 25, 45)"
            className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">Custom (1 to 60 days)</span>
      </div>
    </div>
  );
}
