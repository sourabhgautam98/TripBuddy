'use client';

import { PublicTransitInfo } from '@/types';
import { Bus, MapPin, Info, ArrowRight, Train } from 'lucide-react';

interface PublicTransitCardProps {
  transit?: PublicTransitInfo;
}

export function PublicTransitCard({ transit }: PublicTransitCardProps) {
  if (!transit) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 bg-teal-950/15 mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
          <Bus className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Public Transit & City Bus Routes for {transit.destination}</h4>
          <p className="text-[11px] text-slate-400">
            {transit.transitSummary || 'Local buses, metro lines, and feeder routes connecting tourist attractions'}
          </p>
        </div>
      </div>

      {transit.popularBuses && transit.popularBuses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {transit.popularBuses.map((bus, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold text-[10px] uppercase">
                    {bus.routeNumber}
                  </span>
                  {bus.frequency && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {bus.frequency}
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-xs text-white mb-2">{bus.name}</h5>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate text-slate-300">{bus.from}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-teal-400 flex-shrink-0" />
                    <span className="truncate text-slate-300">{bus.to}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {transit.tips && transit.tips.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            {transit.tips.map((tip, idx) => (
              <p key={idx}>• {tip}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
