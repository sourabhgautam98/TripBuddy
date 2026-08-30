'use client';

import { useState } from 'react';
import { Activity } from '@/types';
import { X, Sparkles, RefreshCw, Trash2, Bot } from 'lucide-react';

interface ModifyActivityModalProps {
  activity: Activity | null;
  dayNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: 'replace' | 'remove', prompt?: string) => Promise<void>;
}

export function ModifyActivityModal({
  activity,
  dayNumber,
  isOpen,
  onClose,
  onSubmit,
}: ModifyActivityModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activity) return null;

  const handleAction = async (action: 'replace' | 'remove') => {
    setLoading(true);
    try {
      await onSubmit(action, prompt);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Replace with an outdoor scenic viewpoint',
    'Replace with a local artisan bazaar / shopping street',
    'Replace with a peaceful garden or cafe',
    'Replace with an architectural photography spot',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Modify Activity</h3>
            <p className="text-xs text-slate-400">
              Day {dayNumber} • Current: <strong>{activity.title}</strong>
            </p>
          </div>
        </div>

        {/* Input for custom AI replacement */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            What would you prefer instead?
          </label>
          <div className="relative">
            <Bot className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Replace this with an outdoor activity or scenic sunset spot"
              className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-400 block font-medium">Quick Suggestions:</span>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => setPrompt(qp)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
                >
                  ✨ {qp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleAction('remove')}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Stop</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('replace')}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{loading ? 'Recalculating Routes...' : 'Apply AI Replacement'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
