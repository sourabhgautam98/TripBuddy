'use client';

import { useState, useEffect } from 'react';
import { AgentEvent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useSSE(tripId: string | null, onReady?: (event: AgentEvent) => void) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('Initializing travel agent...');
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    const eventSource = new EventSource(`${API_BASE_URL}/api/agent/${tripId}/stream`);

    const handleEvent = (event: MessageEvent) => {
      try {
        const data: AgentEvent = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);
        if (data.message) {
          setCurrentStep(data.message);
        }

        if (data.type === 'itinerary_ready') {
          setIsDone(true);
          if (onReady) onReady(data);
          eventSource.close();
        }

        if (data.type === 'agent_error') {
          setError(data.message);
          eventSource.close();
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    const eventTypes = [
      'agent_started',
      'searching_places',
      'places_found',
      'calculating_routes',
      'routes_calculated',
      'finding_restaurants',
      'restaurants_found',
      'finding_rentals',
      'rentals_found',
      'building_itinerary',
      'optimizing_itinerary',
      'itinerary_ready',
      'agent_error',
    ];

    for (const type of eventTypes) {
      eventSource.addEventListener(type, handleEvent);
    }

    eventSource.onerror = (err) => {
      console.warn('SSE stream closed or disconnected', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [tripId, onReady]);

  return { events, currentStep, isDone, error };
}
