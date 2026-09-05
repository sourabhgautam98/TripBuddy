'use client';

import { Trip } from '@/types';
import { Sparkles, MapPin, Calendar, Zap, DollarSign, Bike, Compass } from 'lucide-react';

interface TripHeaderProps {
  trip: Trip;
  onOptimizeClick: () => void;
  isOptimizing: boolean;
}

export function TripHeader({ trip, onOptimizeClick, isOptimizing }: TripHeaderProps) {
  const getTransportIcon = (mode?: string) => {
    switch (mode) {
      case 'bike':
        return '🏍️ Bike';
      case 'car':
        return '🚗 Car';
      case 'cab':
        return '🚕 Cab';
      case 'public':
        return '🚌 Public';
      default:
        return '🚶 Walking';
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
      {/* Background Image / Gradient */}
      {trip.destination.coverImage && (
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={trip.destination.coverImage}
            alt={trip.destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {/* Destination Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{trip.destination.name}, {trip.destination.country || 'India'}</span>
            </div>
            {trip.destination.isLocalizedArea && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                📍 Hyper-Local Area Itinerary
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            {trip.destination.name} — {trip.duration} Day AI Trip
          </h1>

          <p className="text-sm text-slate-400 max-w-2xl">
            {trip.destination.tagline || 'Personalized, realistic day-by-day travel plan with verified route times.'}
          </p>

          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}
            </span>

            <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <span>{getTransportIcon(trip.preferences.transport)}</span>
            </span>

            <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-800/90 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm capitalize">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {trip.preferences.pace || 'Balanced'} Pace
            </span>

            {trip.preferences.interests.map((interest) => (
              <span
                key={interest}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shadow-sm"
              >
                ✨ {interest}
              </span>
            ))}
          </div>

          {/* Special Request / Custom Instructions Banner */}
          {trip.preferences.customPrompt && (
            <div className="mt-4 p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center gap-3 shadow-lg shadow-cyan-950/50">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    🎯 Special Request Active (Enforced ≥50% Daily Stops)
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-200 italic">
                  "{trip.preferences.customPrompt}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Optimize My Trip */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOptimizeClick}
            disabled={isOptimizing}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{isOptimizing ? 'Optimizing Routes...' : '✨ Optimize My Trip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
