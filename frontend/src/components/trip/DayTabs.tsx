'use client';

import { DayPlan } from '@/types';
import { Calendar, Route } from 'lucide-react';
import { formatDistance, formatDuration } from '@/lib/utils';

interface DayTabsProps {
  days: DayPlan[];
  activeDay: number;
  onSelectDay: (day: number) => void;
}

export function DayTabs({ days, activeDay, onSelectDay }: DayTabsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
      {days.map((day) => {
        const isActive = activeDay === day.day;
        const totalDistKm = day.totalDistanceMeters ? (day.totalDistanceMeters / 1000).toFixed(1) : null;

        return (
          <button
            key={day.day}
            type="button"
            onClick={() => onSelectDay(day.day)}
            className={`px-5 py-3 rounded-2xl border text-left flex-shrink-0 transition-all duration-200 ${
              isActive
                ? 'bg-slate-800 text-white border-cyan-500 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className={`font-extrabold text-sm ${isActive ? 'text-cyan-400' : 'text-slate-200'}`}>
                Day {day.day}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {day.activities.length} stops
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate max-w-[160px]">
              {day.title}
            </p>
            {totalDistKm && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                <Route className="w-3 h-3 text-cyan-400" />
                <span>{totalDistKm} km transit</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
