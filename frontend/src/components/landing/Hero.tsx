'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export function Hero() {
  const [destination, setDestination] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    router.push(`/plan?dest=${encodeURIComponent(destination.trim())}`);
  };

  const quickPicks = ['Jaipur', 'Goa', 'Kyoto', 'Paris', 'Udaipur', 'Bali'];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-hero-pattern">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-World Routes • Verified Places • Zero Hallucinations</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Plan Your Next Adventure with an{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            AI Travel Agent
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Not just a chatbot. An autonomous agent that researches real attractions, calculates precise transit routes, reserves dining stops, and optimizes your day-by-day map itinerary.
        </p>

        {/* Destination Search Box */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto glass-panel p-2.5 rounded-2xl border border-slate-700/80 shadow-2xl shadow-cyan-500/5 flex flex-col sm:flex-row items-center gap-2.5"
        >
          <div className="relative flex-1 w-full flex items-center">
            <MapPin className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to travel? (e.g. Jaipur, Goa, Kyoto)"
              className="w-full bg-slate-900/90 text-white pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm md:text-base placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>Start Planning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Pick Destination Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-medium mr-1 text-slate-500">Popular Trips:</span>
          {quickPicks.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => router.push(`/plan?dest=${encodeURIComponent(pick)}`)}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-all hover:border-cyan-500/40"
            >
              📍 {pick}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
