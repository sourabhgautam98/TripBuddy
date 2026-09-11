'use client';

import { DayPlan, Activity } from '@/types';
import { ActivityCard } from './ActivityCard';

interface TimelineProps {
  dayPlan: DayPlan;
  activeActivityId: string | null;
  onSelectActivity: (id: string) => void;
  onChangeActivity?: (activity: Activity) => void;
  onOpenGallery?: (activity: Activity) => void;
}

export function Timeline({
  dayPlan,
  activeActivityId,
  onSelectActivity,
  onOpenGallery,
}: TimelineProps) {
  const activities = dayPlan.activities || [];

  return (
    <div className="space-y-4">
      {activities.map((act, index) => (
        <div key={act.id} className="space-y-4">
          <ActivityCard
            activity={act}
            index={index}
            isActive={activeActivityId === act.id}
            onSelect={() => onSelectActivity(act.id)}
            onOpenGallery={() => onOpenGallery && onOpenGallery(act)}
          />
        </div>
      ))}
    </div>
  );
}
