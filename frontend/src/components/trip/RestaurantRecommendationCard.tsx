'use client';

import { useState } from 'react';
import { Restaurant } from '@/types';
import { Utensils, Star, ExternalLink, RefreshCw } from 'lucide-react';

interface RestaurantRecommendationCardProps {
  restaurants?: Restaurant[];
  destinationName: string;
}

export function RestaurantRecommendationCard({ restaurants, destinationName }: RestaurantRecommendationCardProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  if (!restaurants || restaurants.length === 0) return null;

  const pageSize = 4;
  const total = restaurants.length;

  const handleRefresh = () => {
    setIsRotating(true);
    setStartIndex((prev) => (prev + pageSize) % total);
    setTimeout(() => setIsRotating(false), 400);
  };

  // Get current slice
  const displayedRestaurants = [];
  for (let i = 0; i < Math.min(pageSize, total); i++) {
    displayedRestaurants.push(restaurants[(startIndex + i) % total]);
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 mb-6">
      <div className="flex items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Recommended Food & Dining in {destinationName}</h4>
            <p className="text-[11px] text-slate-400">
              Authentic local eateries, street delicacies, and must-visit food spots
            </p>
          </div>
        </div>

        {total > pageSize && (
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-800/50 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Refresh Dining</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedRestaurants.map((rest, idx) => (
          <div
            key={`${rest.id || rest.name}-${idx}`}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h5 className="font-bold text-xs text-white truncate">{rest.name}</h5>
                {rest.rating && (
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5 flex-shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {rest.rating}
                  </span>
                )}
              </div>

              {rest.localityBadge && (
                <div className="mb-1.5">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {rest.localityBadge}
                  </span>
                </div>
              )}

              <p className="text-[11px] text-amber-300/90 font-medium truncate mb-1">
                {rest.cuisine || 'Local Specialties'}
              </p>
              {rest.recommendedDish && (
                <p className="text-[10px] text-emerald-400 font-medium line-clamp-1 mb-1">
                  ✨ Must try: {rest.recommendedDish}
                </p>
              )}
              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 leading-relaxed">
                {rest.address || `Central ${destinationName}`}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400">{rest.priceLevel || 'Authentic Taste'}</span>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  rest.name + ' ' + destinationName
                )}`}
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
