import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { config } from '../../config/index.js'
import { User } from '../../models/User.js'
import type { AuthRequest } from '../../middleware/auth.middleware.js'
import type { SignInInput, SignUpInput } from '../../schemas/user.schema.js'

function generateToken(userId: string, email: string): string {
  const signOptions: SignOptions = {
    expiresIn: '7d',
  }
  return jwt.sign({ userId, email }, config.JWT_SECRET, signOptions)
}

export async function signUp(
  req: Request<unknown, unknown, SignUpInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      })
      return
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = generateToken(user._id.toString(), user.email)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function signIn(
  req: Request<unknown, unknown, SignInInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
      return
    }

    const token = generateToken(user._id.toString(), user.email)

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
      return
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    })
  } catch (error)
    {
    next(error)
  }
}
