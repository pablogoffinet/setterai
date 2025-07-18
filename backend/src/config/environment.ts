import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis le fichier racine
dotenv.config({ path: path.resolve(__dirname, '../../../default.env') });

const environment = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/linkedin_prospector',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION || '86400', 10),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Providers
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_DEFAULT_MODEL: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini',
  OPENAI_MESSAGE_GENERATION_MODEL: process.env.OPENAI_MESSAGE_GENERATION_MODEL || 'gpt-4o',
  OPENAI_DEFAULT_TEMPERATURE: parseFloat(process.env.OPENAI_DEFAULT_TEMPERATURE || '0.7'),
  OPENAI_DEFAULT_MAX_TOKENS: parseInt(process.env.OPENAI_DEFAULT_MAX_TOKENS || '1000', 10),
  
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
  CLAUDE_DEFAULT_MODEL: process.env.CLAUDE_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022',
  
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
  MISTRAL_DEFAULT_MODEL: process.env.MISTRAL_DEFAULT_MODEL || 'mistral-large-latest',
  
  // Unipile
  UNIPILE_API_KEY: process.env.UNIPILE_API_KEY || '',
  UNIPILE_API_URL: process.env.UNIPILE_API_URL || '',
  UNIPILE_WEBHOOK_SECRET: process.env.UNIPILE_WEBHOOK_SECRET || '',
  
  // Microservices URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3003',
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || 'http://localhost:3001',
  AI_ENGINE_TIMEOUT: parseInt(process.env.AI_ENGINE_TIMEOUT || '30000', 10),
  QUEUE_SERVICE_URL: process.env.QUEUE_SERVICE_URL || 'http://localhost:3002',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};

export { environment };
export default environment; 