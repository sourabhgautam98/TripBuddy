import { Request, Response, NextFunction } from 'express';
import { placesService } from '../services/google/places.service.js';
import { CURATED_DESTINATIONS } from '../services/google/curatedData.js';

export const placeController = {
  async searchPlaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, location, category } = req.query;
      const results = await placesService.searchPlaces({
        query: String(query || 'attractions'),
        location: location ? String(location) : undefined,
        category: category ? String(category) : undefined,
      });

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPlaceDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { placeId } = req.params;
      const details = await placesService.getPlaceDetails(placeId);

      if (!details) {
        res.status(404).json({ success: false, error: 'Place details not found' });
        return;
      }

      res.json({
        success: true,
        data: details,
      });
    } catch (error) {
      next(error);
    }
  },

  getPopularDestinations(req: Request, res: Response): void {
    const list = Object.values(CURATED_DESTINATIONS).map((d) => ({
      name: d.name,
      country: d.country,
      tagline: d.tagline,
      coverImage: d.coverImage,
      popularInterests: d.popularInterests,
      center: d.center,
    }));

    res.json({
      success: true,
      data: list,
    });
  },
};
