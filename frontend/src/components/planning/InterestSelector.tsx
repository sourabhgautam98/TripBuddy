'use client';

import { INTEREST_OPTIONS } from '@/lib/constants';

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

export function InterestSelector({ selected, onChange }: InterestSelectorProps) {
  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        onChange(selected.filter((item) => item !== id));
      }
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          What do you enjoy?
        </label>
        <span className="text-[11px] text-slate-400">Select 1 or more</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INTEREST_OPTIONS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold border transition-all text-left ${
                isSelected
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/80'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
