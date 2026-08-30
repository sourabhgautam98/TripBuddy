'use client';

import { CarRental } from '@/types';
import { Car, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

interface CarRentalCardProps {
  rentals?: CarRental[];
}

export function CarRentalCard({ rentals }: CarRentalCardProps) {
  if (!rentals || rentals.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/15 mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Car className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Recommended Car Rentals & City Cabs</h4>
          <p className="text-[11px] text-slate-400">
            Verified self-drive cars, family sedans, SUVs, and full-day chauffeur services
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rentals.map((rental) => (
          <div
            key={rental.id || rental.name}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h5 className="font-bold text-xs text-white truncate">{rental.name}</h5>
                <span className="text-[10px] font-semibold text-blue-400 flex items-center gap-0.5 flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                {rental.address}
              </p>

              {rental.typesAvailable && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {rental.typesAvailable.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              {rental.phone ? (
                <a
                  href={`tel:${rental.phone}`}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span className="truncate">{rental.phone}</span>
                </a>
              ) : (
                <span className="text-slate-400">Self-Drive / Cab</span>
              )}

              {rental.mapsUrl && (
                <a
                  href={rental.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>Map</span>
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
