import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth.middleware.js'
import { validateBody } from '../../middleware/validate.middleware.js'
import { signInSchema, signUpSchema } from '../../schemas/user.schema.js'
import { getMe, signIn, signUp } from './user.controller.js'

const router = Router()

router.post('/signup', validateBody(signUpSchema), signUp)
router.post('/signin', validateBody(signInSchema), signIn)
router.get('/me', authenticateToken, getMe)

export default router
