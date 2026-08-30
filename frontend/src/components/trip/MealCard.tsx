'use client';

import { MealRecommendation } from '@/types';
import { Utensils, Star, MapPin, Sparkles } from 'lucide-react';

interface MealCardProps {
  meal: MealRecommendation;
}

export function MealCard({ meal }: MealCardProps) {
  const isLunch = meal.mealType === 'lunch';

  return (
    <div className="my-4 glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-950/15">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Utensils className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                {meal.time} • {meal.mealType}
              </span>
              {meal.rating && (
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {meal.rating}
                </span>
              )}
              {meal.priceLevel && (
                <span className="text-xs text-slate-400 font-mono">{meal.priceLevel}</span>
              )}
            </div>

            <h4 className="text-base font-bold text-white mb-0.5">
              {meal.restaurantName}
            </h4>

            {meal.cuisine && (
              <p className="text-xs text-slate-400 mb-1">{meal.cuisine}</p>
            )}

            {meal.recommendedFor && (
              <p className="text-xs text-amber-200/90 flex items-center gap-1.5 mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Must Try: <strong>{meal.recommendedFor}</strong></span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
