import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

let prisma: PrismaClient | null = null;

export const connectDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      logger.warn('DATABASE_URL not configured, running without database');
      return;
    }

    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    // Test the connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    logger.info('🔄 Continuing without database connection for testing...');
    // Don't throw error, just continue without database
  }
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
};

export const getPrisma = () => {
  if (!prisma) {
    logger.warn('Database not connected, some features may not work');
  }
  return prisma;
};

export { prisma }; 