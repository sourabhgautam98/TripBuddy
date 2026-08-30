'use client';

import { Activity } from '@/types';
import { Star, MapPin, Clock, ExternalLink, RefreshCw, Route, Bike, Hourglass, Sparkles, Camera } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onChangeClick: () => void;
  onOpenGallery?: () => void;
}

export function ActivityCard({
  activity,
  index,
  isActive,
  onSelect,
  onChangeClick,
  onOpenGallery,
}: ActivityCardProps) {
  const travel = activity.travelFromPrevious;
  const photoCount = activity.photos?.length || (activity.photoUrl ? 1 : 0);

  return (
    <div className="relative">
      {/* Travel from Previous Stop Connector */}
      {travel && (
        <div className="flex items-center gap-3 my-3 ml-6 pl-4 border-l-2 border-dashed border-slate-700 text-xs text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300 shadow-sm">
            <Bike className="w-3.5 h-3.5 text-cyan-400" />
            <span>{travel.distanceFormatted || 'Transit'}</span>
            <span className="text-slate-600">•</span>
            <span>~{travel.durationFormatted || '15 mins'}</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {travel.instructions}
          </span>
        </div>
      )}

      {/* Main Activity Card */}
      <div
        onClick={onSelect}
        className={`glass-card p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
          isActive
            ? 'border-cyan-400 shadow-xl shadow-cyan-500/10 bg-slate-800/90'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {/* Step Number Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-md ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Timing & Meta Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {activity.isCustomMatch && (
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950/90 px-2.5 py-1 rounded-lg border border-cyan-400/60 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>{activity.customTag || '🎯 Special Request Match'}</span>
                </span>
              )}

              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open: {activity.openingHours || '09:00 AM - 06:00 PM'}</span>
              </span>

              <span className="text-xs font-medium text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <Hourglass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Suggested: ~{Math.round(activity.estimatedDurationMinutes / 60 * 10) / 10 || 1.5} hrs</span>
              </span>

              {activity.rating && (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {activity.rating}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
              {activity.title}
            </h3>

            {activity.address && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-2.5 truncate">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span>{activity.address}</span>
              </p>
            )}

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activity.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
              {/* View Photos Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenGallery) onOpenGallery();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-cyan-200 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Photos ({photoCount})</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeClick();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Change Activity</span>
              </button>

              {activity.mapsUrl && (
                <a
                  href={activity.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-800 transition-colors"
                >
                  <span>View on Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
