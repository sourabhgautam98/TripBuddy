'use client';

import { useEffect, useRef } from 'react';
import { Activity, DayPlan } from '@/types';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';

interface TripMapProps {
  dayPlan?: DayPlan;
  activeActivityId: string | null;
  onSelectActivity: (activityId: string) => void;
}

export function TripMap({ dayPlan, activeActivityId, onSelectActivity }: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet dynamically via CDN or window.L if available to avoid SSR issues
    const initLeaflet = async () => {
      // Inject Leaflet CSS if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject Leaflet script if not present
      if (!(window as any).L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const centerLat = dayPlan?.activities[0]?.latitude || 26.9124;
        const centerLng = dayPlan?.activities[0]?.longitude || 75.7873;

        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView([centerLat, centerLng], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers & polylines
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      if (!dayPlan?.activities || dayPlan.activities.length === 0) return;

      const latLngs: [number, number][] = [];

      dayPlan.activities.forEach((act, index) => {
        if (!act.latitude || !act.longitude) return;

        latLngs.push([act.latitude, act.longitude]);
        const isActive = act.id === activeActivityId;

        // Custom HTML Marker with Step Number
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
              <div class="w-8 h-8 rounded-full ${
                isActive
                  ? 'bg-amber-500 ring-4 ring-amber-500/40 text-slate-950 scale-110'
                  : 'bg-cyan-500 ring-2 ring-slate-900 text-slate-950'
              } font-extrabold text-xs flex items-center justify-center shadow-xl">
                ${index + 1}
              </div>
              <div class="absolute -bottom-1 w-2 h-2 bg-inherit rotate-45"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([act.latitude, act.longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
              <strong style="display: block; font-size: 13px; margin-bottom: 2px;">${index + 1}. ${act.title}</strong>
              <div style="color: #64748b; font-size: 11px;">${act.startTime} — ${act.endTime}</div>
              <p style="margin-top: 4px; color: #334155;">${act.description.slice(0, 100)}...</p>
            </div>
          `);

        marker.on('click', () => {
          onSelectActivity(act.id);
        });

        if (isActive) {
          marker.openPopup();
        }

        markersRef.current.push(marker);
      });

      // Draw polyline connecting stops
      if (latLngs.length > 1) {
        polylineRef.current = L.polyline(latLngs, {
          color: '#06b6d4',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(map);
      }

      // Fit bounds to show all markers of the day
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    };

    initLeaflet();
  }, [dayPlan, activeActivityId, onSelectActivity]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] lg:min-h-full z-0" />

      {/* Floating Info Overlay */}
      <div className="absolute top-4 left-4 z-10 glass-panel px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-none flex items-center gap-2 text-xs">
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-white">
          {dayPlan ? `Day ${dayPlan.day} Route (${dayPlan.activities.length} stops)` : 'Route Overview'}
        </span>
      </div>
    </div>
  );
}
