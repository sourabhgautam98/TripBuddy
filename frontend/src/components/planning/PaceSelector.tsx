'use client';

import { PACE_OPTIONS } from '@/lib/constants';

interface PaceSelectorProps {
  value: string;
  onChange: (pace: string) => void;
}

export function PaceSelector({ value, onChange }: PaceSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Travelling Places & Sights Per Day <span className="text-cyan-400">*</span>
        </label>
        {!value && (
          <span className="text-xs text-amber-400/80 font-medium">Please select places/day</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PACE_OPTIONS.map((item) => {
          const isSelected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{item.icon}</span>
                <span className="font-bold text-xs sm:text-sm">{item.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
