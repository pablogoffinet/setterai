import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import { environment } from '@/config/environment';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';
import { setupSwagger } from '@/config/swagger';

// Routes
import authRoutes from '@/routes/auth';
import conversationRoutes from '@/routes/conversations';
import agentRoutes from '@/routes/agents';
import channelRoutes from '@/routes/channels';
import campaignRoutes from '@/routes/campaigns';
import webhookRoutes from '@/routes/webhooks';
import testRoutes from './routes/test';

const app = express();

async function startServer() {
  try {
    // Validate environment variables
    const env = environment;
    
    // Connect to databases (optional for testing)
    try {
      await connectDatabase();
    } catch (error) {
      logger.warn('Database connection failed, running in mock mode:', error.message);
    }
    // await connectRedis(); // Skip Redis for now
    
    // Security middleware
    app.use(helmet());
    app.use(cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', limiter);
    
    // General middleware
    app.use(compression());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      next();
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'saas-messaging-backend',
        version: process.env.npm_package_version || '1.0.0',
      });
    });
    
    // Simple test route
    app.get('/test', (req, res) => {
      res.json({
        success: true,
        message: 'Route de test fonctionne !',
        timestamp: new Date().toISOString()
      });
    });
    
    // API routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/webhooks', webhookRoutes);

// Test routes
app.use('/api/test', testRoutes);
    
    // Setup Swagger documentation
    setupSwagger(app);
    
    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);
    
    // Start server
    const port = env.PORT;
    app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📚 API Documentation available at http://localhost:${port}/api/docs`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer(); 