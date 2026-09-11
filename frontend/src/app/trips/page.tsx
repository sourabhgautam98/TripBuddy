'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trip } from '@/types';
import { api } from '@/lib/api';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Loader2,
  Search,
  Database,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrips = async () => {
    try {
      const data = await api.listTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      trip.destination.name.toLowerCase().includes(q) ||
      (trip.destination.country && trip.destination.country.toLowerCase().includes(q)) ||
      trip.preferences.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading saved trips </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Saved Trips ({trips.length})
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Open any previously generated itinerary instantly without calling external AI or Places APIs again.
          </p>
        </div>

        <Link
          href="/plan"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Search Bar & Quick Filter */}
      {trips.length > 0 && (
        <div className="mb-8 space-y-3">
          <div className="relative max-w-md">
            <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Jaipur, Goa) or interest..."
              className="w-full bg-slate-900/90 text-white pl-10 pr-9 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm placeholder:text-slate-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click any trip below to load the full map, itinerary, hotels & transit directly from Mongo.</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {trips.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Trips Saved Yet</h3>
          <p className="text-xs text-slate-400">
            You haven't generated any trips yet. Tell the AI where you want to go and it will save your verified itinerary here!
          </p>
          <Link
            href="/plan"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            Plan Your First Trip
          </Link>
        </div>
      ) : filteredTrips.length === 0 ? (
        /* No Search Match */
        <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm text-slate-300">
            No saved trips match "<strong className="text-cyan-300">{searchQuery}</strong>"
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        /* Trip Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const totalActivities =
              trip.itinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0;

            return (
              <Link
                key={trip.id}
                href={`/trip/${trip.id}`}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-2xl transition-all duration-300 border border-slate-800/80 bg-slate-900/40"
              >
                {/* Image Banner */}
                <div className="h-44 w-full bg-slate-800 relative overflow-hidden">
                  {trip.destination.coverImage ? (
                    <img
                      src={trip.destination.coverImage}
                      alt={trip.destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-bold text-lg flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {trip.destination.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md border border-slate-700 text-cyan-300 font-bold">
                      {trip.duration} Days
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        🛵 Bike • 🚗 Car • 🚌 Transit
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-emerald-500/20 capitalize">
                        {trip.preferences.pace || 'Balanced'} Pace
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {trip.destination.tagline ||
                        `${totalActivities} verified stops, curated hotels, and local dining.`}
                    </p>
                  </div>

                  {/* Footer: Pure Read-Only GET Link */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>View Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      View Only
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
