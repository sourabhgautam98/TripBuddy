import { Request, Response, NextFunction } from 'express';
import { CreateTripInputSchema, ModifyActivityInputSchema } from '../types/index.js';
import { TripRepository } from '../models/Trip.model.js';
import { travelAgentService } from '../services/agent/travelAgent.service.js';
import { optimizeItinerary } from '../services/itinerary/itineraryOptimizer.js';
import { itineraryService } from '../services/itinerary/itinerary.service.js';
import { getDestinationData } from '../services/google/curatedData.js';
import { resolveDynamicPhoto } from '../services/google/imageResolver.service.js';

export const tripController = {
  async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreateTripInputSchema.parse(req.body);
      const destData = getDestinationData(parsed.destination);
      const dynamicPhoto = await resolveDynamicPhoto(parsed.destination);

      const trip = await TripRepository.create({
        destination: {
          name: destData.name,
          country: destData.country,
          latitude: parsed.preferences.userLocation?.latitude || destData.center.latitude,
          longitude: parsed.preferences.userLocation?.longitude || destData.center.longitude,
          tagline: destData.tagline,
          coverImage: dynamicPhoto || destData.coverImage,
          popularInterests: destData.popularInterests,
          areaName: destData.areaName,
          parentCity: destData.parentCity,
          isLocalizedArea: destData.isLocalizedArea,
        },
        duration: parsed.duration,
        startDate: parsed.startDate,
        preferences: parsed.preferences,
        status: 'generating',
      });

      // Trigger agent asynchronously
      setTimeout(() => {
        travelAgentService.processPlanTrip(trip.id).catch((err) => {
          console.error('Async trip generation error:', err);
        });
      }, 50);

      res.status(201).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const trip = await TripRepository.findById(tripId);

      if (!trip) {
        res.status(404).json({ success: false, error: 'Trip not found' });
        return;
      }

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  },

  async listTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trips = await TripRepository.findAll();
      res.json({
        success: true,
        data: trips,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const updated = await TripRepository.update(tripId, req.body);

      if (!updated) {
        res.status(404).json({ success: false, error: 'Trip not found' });
        return;
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const deleted = await TripRepository.delete(tripId);

      res.json({
        success: deleted,
        message: deleted ? 'Trip deleted successfully' : 'Trip not found',
      });
    } catch (error) {
      next(error);
    }
  },

  async optimizeTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const trip = await TripRepository.findById(tripId);

      if (!trip) {
        res.status(404).json({ success: false, error: 'Trip not found' });
        return;
      }

      const optimization = await optimizeItinerary(
        trip.itinerary,
        trip.preferences.transport
      );

      const updated = await TripRepository.update(tripId, {
        itinerary: optimization.itinerary,
      });

      res.json({
        success: true,
        data: {
          trip: updated,
          optimization: optimization.metrics,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async modifyActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId } = req.params;
      const parsed = ModifyActivityInputSchema.parse(req.body);

      const trip = await TripRepository.findById(tripId);
      if (!trip) {
        res.status(404).json({ success: false, error: 'Trip not found' });
        return;
      }

      const modified = await itineraryService.modifyActivity(
        trip,
        parsed.day,
        parsed.activityId,
        parsed.action === 'remove' ? 'remove' : 'replace',
        parsed.prompt
      );

      const updated = await TripRepository.update(tripId, {
        itinerary: modified.itinerary,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
