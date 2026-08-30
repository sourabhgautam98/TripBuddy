'use client';

import { OptimizationMetrics } from '@/types';
import { X, Sparkles, CheckCircle, ArrowRight, Route, Clock, Zap } from 'lucide-react';
import { formatDistance, formatDuration } from '@/lib/utils';

interface OptimizationModalProps {
  metrics: OptimizationMetrics | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OptimizationModal({ metrics, isOpen, onClose }: OptimizationModalProps) {
  if (!isOpen || !metrics) return null;

  const beforeDist = formatDistance(metrics.beforeDistanceMeters);
  const afterDist = formatDistance(metrics.afterDistanceMeters);
  const distSaved = formatDistance(metrics.distanceSavedMeters);

  const beforeTime = formatDuration(metrics.beforeDurationSeconds);
  const afterTime = formatDuration(metrics.afterDurationSeconds);
  const timeSaved = formatDuration(metrics.timeSavedSeconds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-amber-500/40 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Route Optimized!</h3>
            <p className="text-xs text-slate-400">Eliminated zigzagging & transit delays</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-5">
          <p className="text-xs text-amber-200 font-medium leading-relaxed">
            {metrics.summary}
          </p>
        </div>

        {/* Before vs After Metric Cards */}
        <div className="space-y-3 mb-6">
          {/* Distance */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">Transit Distance</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 line-through">{beforeDist}</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="text-emerald-400 font-bold">{afterDist}</span>
            </div>
          </div>

          {/* Time */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium">Estimated Transit Time</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 line-through">{beforeTime}</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="text-emerald-400 font-bold">{afterTime}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Apply & View Updated Map</span>
        </button>
      </div>
    </div>
  );
}
