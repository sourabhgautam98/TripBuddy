'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trip } from '@/types';
import { api } from '@/lib/api';
import { MapPin, Calendar, Trash2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (e: React.MouseEvent, tripId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading saved trips...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Saved Trips
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access and manage all your AI-generated travel itineraries
          </p>
        </div>

        <Link
          href="/plan"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all self-start"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Trips Saved Yet</h3>
          <p className="text-xs text-slate-400">
            Tell the AI where you want to go and watch it build your complete map itinerary!
          </p>
          <Link
            href="/plan"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="font-bold text-lg flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {trip.destination.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300">
                    {trip.duration} Days
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20 capitalize">
                      💰 {trip.preferences.budget || 'Moderate'}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20 capitalize">
                      🏍️ {trip.preferences.transport || 'Bike'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {trip.destination.tagline || 'Customized AI Itinerary with verified route timings.'}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, trip.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
