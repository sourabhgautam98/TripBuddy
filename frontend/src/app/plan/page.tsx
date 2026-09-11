'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, LocationSuggestion } from '@/lib/api';
import { Trip } from '@/types';
import { useSSE } from '@/hooks/useSSE';
import { DurationSelector } from '@/components/planning/DurationSelector';
import { InterestSelector } from '@/components/planning/InterestSelector';
import { PaceSelector } from '@/components/planning/PaceSelector';
import { AgentExecutionStepper } from '@/components/chat/AgentExecutionStepper';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Bot,
  MessageSquarePlus,
  AlertCircle,
  LocateFixed,
  Loader2,
  CheckCircle2,
  Navigation,
  Compass,
  Bookmark,
} from 'lucide-react';

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDest = searchParams.get('dest') || '';

  // Clean initial state
  const [destination, setDestination] = useState(initialDest);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    area?: string;
    city?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // Autocomplete dropdown state
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);

  // Fetch saved trips from MongoDB on mount to allow instant reopening without API calls
  useEffect(() => {
    api
      .listTrips()
      .then((trips) => setSavedTrips(trips))
      .catch(() => setSavedTrips([]));
  }, []);

  // Check if destination typed matches an already saved trip in MongoDB
  const matchingSavedTrip =
    destination.trim().length >= 2
      ? savedTrips.find((t) => {
          const destLower = destination.trim().toLowerCase();
          const tripNameLower = t.destination.name.toLowerCase();
          return tripNameLower.includes(destLower) || destLower.includes(tripNameLower);
        })
      : null;

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!destination.trim() || destination.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await api.autocompleteLocations(destination);
        setSuggestions(results);
      } catch (err) {
        // silent fallback
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [destination]);

  // GPS Location Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationSuccessMsg(null);
    setValidationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.reverseGeocode(latitude, longitude);
          const formatted = res.formattedName || `${res.locality || res.city}, ${res.city}`;
          setDestination(formatted);
          setUserLocation({
            latitude,
            longitude,
            area: res.locality || res.suburb,
            city: res.city,
          });
          setLocationSuccessMsg(`📍 Location detected: ${formatted}`);
          setShowSuggestions(false);
        } catch (err: any) {
          setValidationError('Could not reverse-geocode your GPS location. Please type your city or area manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setValidationError('Location access denied. Please type your destination city or area manually.');
        } else {
          setValidationError('Could not retrieve GPS coordinates. Please type your area or city.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectSuggestion = (item: LocationSuggestion) => {
    setDestination(item.name);
    if (item.latitude && item.longitude) {
      setUserLocation({
        latitude: item.latitude,
        longitude: item.longitude,
        area: item.area,
        city: item.city,
      });
    }
    setShowSuggestions(false);
    setLocationSuccessMsg(`Selected: ${item.name}`);
    if (validationError) setValidationError(null);
  };

  // Form Validation
  const isValid =
    destination.trim().length > 0 &&
    duration > 0 &&
    interests.length > 0 &&
    pace !== '';

  // SSE Stream
  const { events, currentStep, isDone, error } = useSSE(createdTripId, (event) => {
    setTimeout(() => {
      if (createdTripId) {
        router.push(`/trip/${createdTripId}`);
      }
    }, 1200);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) {
      if (!destination.trim()) setValidationError('Please enter a destination city or area.');
      else if (duration <= 0) setValidationError('Please select trip duration (e.g. 2 Days, 3 Days).');
      else if (interests.length === 0) setValidationError('Please select at least 1 interest.');
      else if (!pace) setValidationError('Please select travelling places per day.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      const trip = await api.createTrip({
        destination: destination.trim(),
        duration,
        preferences: {
          interests,
          transport: 'bike', // Automatically provides all mobility options (Bike, Car, Public Transit)
          pace,
          customPrompt: customPrompt.trim() || undefined,
          userLocation: userLocation || undefined,
        },
      });
      setCreatedTripId(trip.id);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to start planning');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* If planning is in progress with live SSE */}
      {createdTripId ? (
        <div className="space-y-6 animate-fade-in">
          <AgentExecutionStepper
            destination={destination}
            events={events}
            currentStep={currentStep}
            isDone={isDone}
            error={error}
          />
        </div>
      ) : (
        /* Planning Form */
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 animate-fade-in">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Hyper-Local Travel Concierge</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Design Your Personalized Itinerary
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Detect your exact location or enter any area/city to get verified hotels, bike/car rentals, public transit, and a tailored sightseeing plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Destination & Location Input */}
            <div className="space-y-2.5" ref={autocompleteRef}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Starting Location / Destination Area <span className="text-cyan-400">*</span>
                </label>
                {!destination.trim() && (
                  <span className="text-xs text-amber-400/80 font-medium">Required</span>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>

                <input
                  type="text"
                  value={destination}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                    setLocationSuccessMsg(null);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Type area or city"
                  required
                  className="w-full bg-slate-900 text-white pl-12 pr-44 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm md:text-base placeholder:text-slate-500 transition-colors shadow-inner"
                />

                {/* GPS Detect Location Button */}
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${isLocating
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait'
                        : 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white hover:scale-105 active:scale-95'
                      }`}
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <LocateFixed className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Use My Location</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 animate-fade-in max-h-72 overflow-y-auto">
                    <div className="px-3.5 py-2 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-cyan-400/90 flex items-center justify-between">
                      <span>Matching Localities & Cities</span>
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    {suggestions.map((item, idx) => (
                      <button
                        key={`${item.name}-${idx}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-4 py-2.5 text-left hover:bg-cyan-500/10 flex items-start gap-3 transition-colors group"
                      >
                        <Navigation className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-300">
                            {item.name}
                          </div>
                          {item.subTitle && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.subTitle}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Detected Badge */}
              {locationSuccessMsg && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{locationSuccessMsg}</span>
                </div>
              )}

              {/* Existing Saved Itinerary Match Banner (Zero API Calls) */}
              {matchingSavedTrip && (
                <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/30 mt-0.5">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          Existing Itinerary in Database
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          Zero API Calls
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        You already generated a <strong>{matchingSavedTrip.duration}-Day {matchingSavedTrip.destination.name}</strong> itinerary saved in MongoDB.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/trip/${matchingSavedTrip.id}`)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    <span>Open Saved {matchingSavedTrip.destination.name} Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Quick Suggestions of Previously Saved Trips */}
              {!destination.trim() && savedTrips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-cyan-400" />
                    <span>Saved in MongoDB:</span>
                  </span>
                  {savedTrips.slice(0, 3).map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => router.push(`/trip/${saved.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold transition-all flex items-center gap-1"
                    >
                      <span>📍 {saved.destination.name} ({saved.duration}D)</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Duration Selector */}
            <DurationSelector
              value={duration}
              onChange={(d) => {
                setDuration(d);
                if (validationError) setValidationError(null);
              }}
            />

            {/* Interest Selector */}
            <InterestSelector
              selected={interests}
              onChange={(i) => {
                setInterests(i);
                if (validationError) setValidationError(null);
              }}
            />

            {/* Pace / Places per day Selector */}
            <PaceSelector
              value={pace}
              onChange={(p) => {
                setPace(p);
                if (validationError) setValidationError(null);
              }}
            />

            {/* Optional Custom Instructions / Special Desires */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Custom Instructions & Special Requests{' '}
                    <span className="text-slate-500 font-normal capitalize">(Optional)</span>
                  </label>
                </div>
                <span className="text-[11px] text-cyan-400/90 font-medium hidden sm:inline">
                  ⚡ ≥50% Daily Stops Guaranteed to Match
                </span>
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Explain your specific desires: e.g. 'see the river and riverside spots', 'photography sunset viewpoints', 'mountain ridges and peaceful treks', 'famous street sweets & cafes'..."
                rows={3}
                className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm placeholder:text-slate-500 resize-none transition-colors"
              />

              {/* Quick Suggestion Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Quick ideas (click to auto-fill):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '🌊 See rivers & water streams',
                    '📸 Photography & scenic viewpoints',
                    '🏔️ Mountain peaks & ridge trails',
                    '☕ Famous local street food & cafes',
                    '🌿 Quiet nature walks & hidden gems',
                    '🛕 Ancient temples & spiritual ghats',
                  ].map((idea) => {
                    const cleanText = idea.replace(/^[^\s]+\s/, '');
                    const isSelected = customPrompt
                      .toLowerCase()
                      .includes(cleanText.toLowerCase().slice(0, 8));
                    return (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setCustomPrompt(idea.replace(/^[^\s]+\s/, ''))}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                          }`}
                      >
                        {idea}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all ${isValid && !isSubmitting
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
              >
                <Sparkles className={`w-5 h-5 ${isValid ? 'fill-slate-950' : 'text-slate-500'}`} />
                <span>
                  {isSubmitting
                    ? 'Starting AI Agent...'
                    : isValid
                      ? 'Generate Itinerary with AI Agent'
                      : 'Complete Required Options to Generate'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading planner...</div>}>
      <PlanContent />
    </Suspense>
  );
}
