'use client';

import Link from 'next/link';
import { POPULAR_DESTINATIONS } from '@/lib/constants';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

export function PopularDestinations() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Curated Destinations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Explore Handcrafted AI Itineraries
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-md mt-2 md:mt-0">
          Discover vetted heritage landmarks, realistic transit routes, and local culinary hotspots curated by the AI agent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {POPULAR_DESTINATIONS.map((dest) => (
          <div
            key={dest.name}
            className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Image Container */}
            <div className="relative h-52 w-full overflow-hidden bg-slate-800">
              <img
                src={dest.coverImage}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="font-bold text-lg flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {dest.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300">
                  {dest.country}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {dest.tagline}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {dest.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Plan Action */}
              <Link
                href={`/plan?dest=${encodeURIComponent(dest.name)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400 transition-all group/btn"
              >
                <span>Plan {dest.name} Trip</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
