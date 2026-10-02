// apps/backend/src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/types/errors';
import { env } from '@/config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. Known, intentionally thrown application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // 2. Zod validation error that escaped the controller
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // 3. Unknown error — never leak internals in production
  console.error('[Arca] Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err instanceof Error
            ? err.message
            : 'Unknown error',
    },
  });
}