import { Trip, OptimizationMetrics, Destination } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  async createTrip(payload: {
    destination: string;
    duration: number;
    preferences: {
      interests: string[];
      budget?: string;
      transport: string;
      pace: string;
      customPrompt?: string;
    };
  }): Promise<Trip> {
    const res = await fetch(`${API_BASE_URL}/api/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create trip');
    }

    const data = await res.json();
    return data.data;
  },

  async getTrip(tripId: string): Promise<Trip> {
    const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch trip');
    }

    const data = await res.json();
    return data.data;
  },

  async listTrips(): Promise<Trip[]> {
    const res = await fetch(`${API_BASE_URL}/api/trips`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch trips');
    }

    const data = await res.json();
    return data.data;
  },

  async deleteTrip(tripId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      method: 'DELETE',
    });

    return res.ok;
  },

  async optimizeTrip(tripId: string): Promise<{ trip: Trip; optimization: OptimizationMetrics }> {
    const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focus: 'minimize_travel' }),
    });

    if (!res.ok) {
      throw new Error('Failed to optimize trip');
    }

    const data = await res.json();
    return data.data;
  },

  async modifyActivity(
    tripId: string,
    day: number,
    activityId: string,
    action: 'replace' | 'remove',
    prompt?: string
  ): Promise<Trip> {
    const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/modify-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, day, activityId, action, prompt }),
    });

    if (!res.ok) {
      throw new Error('Failed to modify activity');
    }

    const data = await res.json();
    return data.data;
  },

  async sendAgentMessage(tripId: string, message: string): Promise<{ reply: string; trip: Trip }> {
    const res = await fetch(`${API_BASE_URL}/api/agent/${tripId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error('Failed to send message');
    }

    const data = await res.json();
    return data.data;
  },

  async getPopularDestinations(): Promise<Destination[]> {
    const res = await fetch(`${API_BASE_URL}/api/places/destinations`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data;
  },
};
