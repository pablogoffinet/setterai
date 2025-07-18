import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  OPENAI_API_KEY: Joi.string().optional(),
  AZURE_OPENAI_API_KEY: Joi.string().optional(),
  AZURE_OPENAI_ENDPOINT: Joi.string().optional(),
  AZURE_OPENAI_API_VERSION: Joi.string().optional(),
  AZURE_OPENAI_DEPLOYMENT_NAME: Joi.string().optional(),
  CLAUDE_API_KEY: Joi.string().optional(),
  MISTRAL_API_KEY: Joi.string().optional(),
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