'use client';

import { CheckCircle2, Loader2, Sparkles, Bot } from 'lucide-react';
import { AgentEvent } from '@/types';

interface AgentExecutionStepperProps {
  destination: string;
  events: AgentEvent[];
  currentStep: string;
  isDone: boolean;
  error: string | null;
}

export function AgentExecutionStepper({
  destination,
  events,
  currentStep,
  isDone,
  error,
}: AgentExecutionStepperProps) {
  const steps = [
    { key: 'places', label: 'Finding attractions & heritage sights', doneTypes: ['places_found', 'calculating_routes', 'finding_restaurants', 'building_itinerary', 'itinerary_ready'] },
    { key: 'routes', label: 'Calculating travel times & distances', doneTypes: ['routes_calculated', 'finding_restaurants', 'building_itinerary', 'itinerary_ready'] },
    { key: 'food', label: 'Finding top-rated local dining & cafes', doneTypes: ['restaurants_found', 'building_itinerary', 'itinerary_ready'] },
    { key: 'schedule', label: 'Building time schedule & daily slots', doneTypes: ['building_itinerary', 'optimizing_itinerary', 'itinerary_ready'] },
    { key: 'optimize', label: 'Optimizing routes to reduce transit time', doneTypes: ['itinerary_ready'] },
  ];

  const receivedTypes = new Set(events.map((e) => e.type));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 relative overflow-hidden animate-pulse-subtle">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              Autonomous Travel Agent
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Tools
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generating your {destination} itinerary with real-world geospatial data
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400 font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isDone ? 'Trip Ready' : 'Executing'}</span>
        </div>
      </div>

      {/* Stepper List */}
      <div className="space-y-4 mb-6">
        {steps.map((step, idx) => {
          const isStepCompleted = step.doneTypes.some((t) => receivedTypes.has(t as any)) || isDone;
          const isStepActive = !isStepCompleted && !isDone;

          return (
            <div key={step.key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {isStepCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isStepActive ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span
                  className={`font-medium ${
                    isStepCompleted
                      ? 'text-slate-200'
                      : isStepActive
                      ? 'text-cyan-300 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  isStepCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isStepActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                {isStepCompleted ? 'DONE' : isStepActive ? 'RUNNING' : 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Live Message Stream */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
        {!isDone && !error && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />}
        <p className="text-xs text-slate-300 font-mono truncate">
          {error ? `⚠️ Error: ${error}` : currentStep}
        </p>
      </div>
    </div>
  );
}
