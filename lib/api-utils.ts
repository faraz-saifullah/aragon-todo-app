import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * API utility functions for consistent error handling and responses
 */

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

/**
 * Handle API errors and return appropriate responses
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Validation errors (Zod)
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: Record<string, unknown> };
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this unique field already exists' },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          { error: 'Database error', details: prismaError },
          { status: 500 }
        );
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { data, ...(message && { message }) },
    { status }
  );
}

