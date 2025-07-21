import express from 'express';
import cors from 'cors';

const app = express();

// 🔒 PROTECTION CRITIQUE contre les vulnérabilités Multer
process.on("uncaughtException", (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err.message);
  
  // Protection spécifique contre les bugs Multer connus
  if (err.message === "Unexpected end of form" || 
      err.message.includes("malformed multipart") ||
      err.message.includes("empty field name")) {
    console.warn('⚠️ Multer vulnerability detected - continuing...');
    return; // Continue sans crasher
  }
  
  // Pour toute autre exception critique, arrêter proprement
  console.error('💥 CRITICAL ERROR - Shutting down gracefully...');
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'linkedin-prospector-api',
    version: '1.1.1'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'LinkedIn Prospector API is running!',
    environment: process.env.NODE_ENV || 'unknown',
    port: process.env.PORT || 3000
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LinkedIn Prospector API',
    version: '1.1.1',
    endpoints: {
      health: '/health',
      test: '/test'
    }
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
const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
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