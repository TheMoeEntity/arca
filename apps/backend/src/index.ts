import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './types/errors';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'arca-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/test-error', () => {
  throw new Error('intentional test error');
});

// Not Found Handler
app.use(() => {
  throw new NotFoundError();
});

// Error Handler
app.use(errorHandler);
// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.info(`[Arca] API running → http://localhost:${PORT}`),
   console.info(`[Arca] ✓ Environment → ${env.NODE_ENV}\n`);
});