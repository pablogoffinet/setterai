import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { validateEnv } from './utils/environment';

const app = express();

async function startServer() {
  try {
    // Validate environment
    const env = validateEnv();
    
    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));

    // Health check
    app.get('/health', (_, res) => {
      res.json({
        status: 'ok',
        service: 'queue-service',
        timestamp: new Date().toISOString(),
      });
    });

    // Simple job endpoints
    app.post('/jobs/message', async (req, res) => {
      try {
        logger.info('Message job received', { data: req.body });
        res.json({ success: true, jobId: `msg-${Date.now()}` });
      } catch (error) {
        logger.error('Error processing message job:', error);
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    app.post('/jobs/ai-process', async (req, res) => {
      try {
        logger.info('AI process job received', { data: req.body });
        res.json({ success: true, jobId: `ai-${Date.now()}` });
      } catch (error) {
        logger.error('Error processing AI job:', error);
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Start server
    const port = env.PORT;
    app.listen(port, () => {
      logger.info(`🚀 Queue Service running on port ${port}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 