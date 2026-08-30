'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trip, Activity, OptimizationMetrics } from '@/types';
import { api } from '@/lib/api';
import { TripHeader } from '@/components/trip/TripHeader';
import { DayTabs } from '@/components/trip/DayTabs';
import { Timeline } from '@/components/trip/Timeline';
import { TripMap } from '@/components/map/TripMap';
import { HotelRecommendationCard } from '@/components/trip/HotelRecommendationCard';
import { RestaurantRecommendationCard } from '@/components/trip/RestaurantRecommendationCard';
import { BikeRentalCard } from '@/components/trip/BikeRentalCard';
import { CarRentalCard } from '@/components/trip/CarRentalCard';
import { PublicTransitCard } from '@/components/trip/PublicTransitCard';
import { ModifyActivityModal } from '@/components/trip/ModifyActivityModal';
import { OptimizationModal } from '@/components/trip/OptimizationModal';
import { PhotoGalleryModal } from '@/components/trip/PhotoGalleryModal';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  // Modals state
  const [selectedActivityToModify, setSelectedActivityToModify] = useState<Activity | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  const [selectedActivityForGallery, setSelectedActivityForGallery] = useState<Activity | null>(null);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMetrics, setOptimizationMetrics] = useState<OptimizationMetrics | null>(null);
  const [isOptimizationModalOpen, setIsOptimizationModalOpen] = useState(false);

  const fetchTrip = async () => {
    try {
      const data = await api.getTrip(tripId);
      setTrip(data);
      if (data.itinerary?.[0]?.activities?.[0]) {
        setActiveActivityId(data.itinerary[0].activities[0].id);
      }
    } catch (err) {
      console.error('Failed to load trip', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleOptimizeTrip = async () => {
    if (!trip || isOptimizing) return;
    setIsOptimizing(true);
    try {
      const result = await api.optimizeTrip(tripId);
      setTrip(result.trip);
      setOptimizationMetrics(result.optimization);
      setIsOptimizationModalOpen(true);
    } catch (err) {
      alert('Failed to optimize trip');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleModifyActivitySubmit = async (action: 'replace' | 'remove', prompt?: string) => {
    if (!selectedActivityToModify) return;
    try {
      const updatedTrip = await api.modifyActivity(
        tripId,
        activeDay,
        selectedActivityToModify.id,
        action,
        prompt
      );
      setTrip(updatedTrip);
    } catch (err) {
      alert('Failed to modify activity');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading your AI Itinerary...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Trip Not Found</h2>
        <p className="text-xs text-slate-400">The requested itinerary could not be located.</p>
        <Link
          href="/plan"
          className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Create a New Trip
        </Link>
      </div>
    );
  }

  const currentDayPlan = trip.itinerary.find((d) => d.day === activeDay) || trip.itinerary[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/plan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </Link>
      </div>

      {/* Trip Header */}
      <TripHeader
        trip={trip}
        onOptimizeClick={handleOptimizeTrip}
        isOptimizing={isOptimizing}
      />

      {/* Recommended Hotels & Stays Section */}
      <HotelRecommendationCard
        hotels={trip.hotels}
        destinationName={trip.destination.name}
      />

      {/* Recommended Dining & Cafes Section */}
      <RestaurantRecommendationCard
        restaurants={trip.restaurants}
        destinationName={trip.destination.name}
      />

      {/* Transport-Specific Recommendation Card */}
      {trip.preferences.transport === 'bike' && (
        <BikeRentalCard rentals={trip.bikeRentals} />
      )}
      {trip.preferences.transport === 'car' && (
        <CarRentalCard rentals={trip.carRentals} />
      )}
      {trip.preferences.transport === 'public' && (
        <PublicTransitCard transit={trip.publicTransit} />
      )}

      {/* Main Split View: Timeline (Left) & Interactive Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Day Tabs & Timeline */}
        <div className="lg:col-span-7 flex flex-col">
          <DayTabs
            days={trip.itinerary}
            activeDay={activeDay}
            onSelectDay={(d) => {
              setActiveDay(d);
              const firstAct = trip.itinerary.find((day) => day.day === d)?.activities[0];
              if (firstAct) setActiveActivityId(firstAct.id);
            }}
          />

          {currentDayPlan && (
            <Timeline
              dayPlan={currentDayPlan}
              activeActivityId={activeActivityId}
              onSelectActivity={(id) => setActiveActivityId(id)}
              onChangeActivity={(activity) => {
                setSelectedActivityToModify(activity);
                setIsModifyModalOpen(true);
              }}
              onOpenGallery={(activity) => {
                setSelectedActivityForGallery(activity);
              }}
            />
          )}
        </div>

        {/* Right Column: Sticky Interactive Map */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 h-[500px] lg:h-[720px] w-full">
          <TripMap
            dayPlan={currentDayPlan}
            activeActivityId={activeActivityId}
            onSelectActivity={(id) => setActiveActivityId(id)}
          />
        </div>
      </div>

      {/* Modify Activity Dialog */}
      <ModifyActivityModal
        activity={selectedActivityToModify}
        dayNumber={activeDay}
        isOpen={isModifyModalOpen}
        onClose={() => {
          setIsModifyModalOpen(false);
          setSelectedActivityToModify(null);
        }}
        onSubmit={handleModifyActivitySubmit}
      />

      {/* Photo Gallery Modal */}
      <PhotoGalleryModal
        activity={selectedActivityForGallery}
        isOpen={Boolean(selectedActivityForGallery)}
        onClose={() => setSelectedActivityForGallery(null)}
      />

      {/* Optimization Modal */}
      <OptimizationModal
        metrics={optimizationMetrics}
        isOpen={isOptimizationModalOpen}
        onClose={() => setIsOptimizationModalOpen(false)}
      />
    </div>
  );
}
