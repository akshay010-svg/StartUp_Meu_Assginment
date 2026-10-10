import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export interface UserPayload {
  userId: string
  email: string
}

export interface AuthRequest extends Request {
  user?: UserPayload
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied: No Bearer token provided',
    })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied: Token is missing',
    })
    return
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access denied: Invalid or expired token',
    })
  }
}
