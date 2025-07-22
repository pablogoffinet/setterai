import express from 'express';
import cors from 'cors';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'linkedin-prospector-api',
    version: '1.1.1',
    database: 'disabled',
    mode: 'simple'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'LinkedIn Prospector API is running!',
    environment: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 10000,
    features: ['health-check', 'cors', 'basic-routing'],
    database: 'disabled - running in simple mode'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LinkedIn Prospector API',
    version: '1.1.1',
    mode: 'simple',
    endpoints: {
      health: '/health',
      test: '/test'
    },
    status: 'All systems operational'
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const port = parseInt(process.env.PORT || '10000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Simple Server running on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
  console.log(`🎯 Mode: Simple (no database)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 