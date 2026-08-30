'use client';

import { useState } from 'react';
import { Hotel } from '@/types';
import { Hotel as HotelIcon, Star, ExternalLink, RefreshCw } from 'lucide-react';

interface HotelRecommendationCardProps {
  hotels?: Hotel[];
  destinationName: string;
}

export function HotelRecommendationCard({ hotels, destinationName }: HotelRecommendationCardProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  if (!hotels || hotels.length === 0) return null;

  const pageSize = 4;
  const total = hotels.length;

  const handleRefresh = () => {
    setIsRotating(true);
    setStartIndex((prev) => (prev + pageSize) % total);
    setTimeout(() => setIsRotating(false), 400);
  };

  // Get current slice
  const displayedHotels = [];
  for (let i = 0; i < Math.min(pageSize, total); i++) {
    displayedHotels.push(hotels[(startIndex + i) % total]);
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 mb-6">
      <div className="flex items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <HotelIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Recommended Hotels & Stays in {destinationName}</h4>
            <p className="text-[11px] text-slate-400">
              Top verified accommodations near primary sightseeing attractions
            </p>
          </div>
        </div>

        {total > pageSize && (
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Refresh Stays</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedHotels.map((hotel, idx) => (
          <div
            key={`${hotel.id || hotel.name}-${idx}`}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h5 className="font-bold text-xs text-white truncate">{hotel.name}</h5>
                {hotel.rating && (
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5 flex-shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {hotel.rating}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {hotel.address || `Central ${destinationName}`}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-purple-300 font-medium">Boutique Stay</span>

              <a
                href={
                  hotel.mapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    hotel.name + ' hotel ' + destinationName
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>View on Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
