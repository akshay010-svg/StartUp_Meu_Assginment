import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[Error Middleware]', err)

  // Handle Zod validation errors if caught here
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    })
    return
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err && err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid format for ${err.path}: ${err.value}`,
    })
    return
  }

  // Handle body-parser JSON syntax error
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
    })
    return
  }

  // Generic fallback
  const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 500
  const message =
    statusCode === 500
      ? 'Internal server error occurred'
      : err.message || 'An unexpected error occurred'

  res.status(statusCode).json({
    success: false,
    message,
  })
}
