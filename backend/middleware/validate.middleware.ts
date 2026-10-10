import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }))

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      })
      return
    }

    req.body = result.data
    next()
  }
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'params',
        message: issue.message,
      }))

      res.status(400).json({
        success: false,
        message: 'Invalid route parameters',
        errors: formattedErrors,
      })
      return
    }

    req.params = result.data as unknown as Record<string, string>
    next()
  }
}
