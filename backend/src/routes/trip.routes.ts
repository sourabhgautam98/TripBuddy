import { Router } from 'express';
import { tripController } from '../controllers/trip.controller.js';

export const tripRouter = Router();

tripRouter.post('/', tripController.createTrip);
tripRouter.get('/', tripController.listTrips);
tripRouter.get('/:tripId', tripController.getTrip);
tripRouter.patch('/:tripId', tripController.updateTrip);
tripRouter.delete('/:tripId', tripController.deleteTrip);
tripRouter.post('/:tripId/optimize', tripController.optimizeTrip);
tripRouter.post('/:tripId/modify-activity', tripController.modifyActivity);
