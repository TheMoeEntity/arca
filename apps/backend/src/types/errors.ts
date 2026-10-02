// apps/backend/src/types/errors.ts

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppError';
    // Critical: fixes instanceof checks when extending built-ins in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class TenantNotFoundError extends AppError {
  constructor(tenantId: string) {
    super(`Tenant '${tenantId}' not found or inactive`, 404, 'TENANT_NOT_FOUND');
  }
}

export class TenantMismatchError extends AppError {
  constructor() {
    super('Resource does not belong to your organization', 403, 'TENANT_MISMATCH');
  }
}