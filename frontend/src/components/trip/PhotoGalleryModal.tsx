'use client';

import { useState, useEffect } from 'react';
import { Activity } from '@/types';
import { X, ChevronLeft, ChevronRight, MapPin, Star, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoGalleryModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoGalleryModal({ activity, isOpen, onClose }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract photos list with fallbacks
  const photos = activity?.photos && activity.photos.length > 0
    ? activity.photos
    : activity?.photoUrl
    ? [activity.photoUrl]
    : [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      ];

  // Reset index when modal opens with a new activity
  useEffect(() => {
    setCurrentIndex(0);
  }, [activity?.id, isOpen]);

  // Keyboard navigation: Left/Right arrow and Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || !activity) return null;

  const currentPhotoUrl = photos[currentIndex] || photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>Verified Place Photos ({photos.length})</span>
              </span>

              {activity.isCustomMatch && (
                <span className="text-[11px] font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{activity.customTag || 'Special Request Match'}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
              {activity.title}
            </h2>

            {activity.address && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span>{activity.address}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo Display Stage */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden select-none">
          <img
            key={currentPhotoUrl}
            src={currentPhotoUrl}
            alt={`${activity.title} photo ${currentIndex + 1}`}
            className="max-h-[55vh] sm:max-h-[62vh] w-full object-contain transition-opacity duration-300 animate-fade-in"
          />

          {/* Prev Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Photo Counter Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-xl backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail Strip & Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {photos.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Right Action Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {activity.mapsUrl && (
              <a
                href={activity.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={currentPhotoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/40 transition-colors"
            >
              <span>Full Size Photo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
