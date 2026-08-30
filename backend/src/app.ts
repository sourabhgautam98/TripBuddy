import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

export function createApp(): express.Application {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [
        env.FRONTEND_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Logging
  app.use(requestLogger);

  // Rate Limiting
  app.use('/api', apiLimiter);

  // API Routes
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
