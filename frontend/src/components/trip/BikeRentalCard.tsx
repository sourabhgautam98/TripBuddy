'use client';

import { BikeRental } from '@/types';
import { Bike, Star, Phone, MapPin, ExternalLink } from 'lucide-react';

interface BikeRentalCardProps {
  rentals?: BikeRental[];
}

export function BikeRentalCard({ rentals }: BikeRentalCardProps) {
  if (!rentals || rentals.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Recommended Bike & Scooter Rentals</h4>
            <p className="text-[11px] text-slate-400">
              Verified local two-wheeler rental hubs near the main transit corridors
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h5 className="font-bold text-xs text-white truncate">{rental.name}</h5>
                {rental.rating && (
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {rental.rating}
                  </span>
                )}
              </div>

              {rental.localityBadge && (
                <div className="mb-1.5">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {rental.localityBadge}
                  </span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 truncate mb-2">{rental.address}</p>

              {rental.typesAvailable && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {rental.typesAvailable.map((type) => (
                    <span
                      key={type}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              {rental.phone ? (
                <a
                  href={`tel:${rental.phone}`}
                  className="text-slate-300 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>{rental.phone}</span>
                </a>
              ) : (
                <span className="text-slate-500">Walk-in available</span>
              )}

              {rental.mapsUrl && (
                <a
                  href={rental.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
