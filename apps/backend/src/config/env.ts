// apps/backend/src/config/env.ts
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_BASE_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Argon2
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(4),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\n[Arca] ❌ Server refused to start — invalid environment:\n');
  console.error(result.error.flatten().fieldErrors);
  console.error('\nCheck your .env file against .env.example\n');
  process.exit(1);
}

export const env = result.data;

// Convenience derived value — used when splitting ALLOWED_ORIGINS string
export const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());