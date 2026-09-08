
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

import { logger } from './utils/logger.js';

export function createApp(): express.Application {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL
  ];

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests without Origin header
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`CORS blocked request from origin: ${origin} `);
      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Cache-Control',
      'X-Requested-With',
      'Origin',
    ],

    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  // Explicitly handle preflight requests
  app.options('*', cors(corsOptions));

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
