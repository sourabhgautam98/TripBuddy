import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} mins`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining === 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : `${hours}h ${remaining}m`;
}

export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function formatDuration(durationSeconds: number): string {
  const minutes = Math.round(durationSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMins} min`;
}
