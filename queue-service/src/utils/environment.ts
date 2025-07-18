import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3002),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
});

export const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return value;
}; 