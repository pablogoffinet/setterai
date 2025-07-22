import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { environment } from '../config/environment';

const env = environment;

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: env.LOG_LEVEL,
    format: consoleFormat,
  }),
];

// Skip file logs in production on Render (no write permissions)
// Use console logging only for cloud deployments

// Create logger instance
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: fileFormat,
  defaultMeta: { 
    service: 'saas-messaging-backend',
    timestamp: new Date().toISOString(),
  },
  transports,
  // Handle exceptions
  exceptionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  // Handle rejections
  rejectionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// Stream for morgan HTTP logging
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
}; 