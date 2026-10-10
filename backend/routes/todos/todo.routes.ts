import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth.middleware.js'
import {
  validateBody,
  validateParams,
} from '../../middleware/validate.middleware.js'
import {
  createTodoSchema,
  todoIdParamSchema,
  updateTodoSchema,
} from '../../schemas/todo.schema.js'
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from './todo.controller.js'

const router = Router()

// All todo endpoints require authentication
router.use(authenticateToken)

router.get('/', getTodos)
router.post('/', validateBody(createTodoSchema), createTodo)
router.put(
  '/:id',
  validateParams(todoIdParamSchema),
  validateBody(updateTodoSchema),
  updateTodo,
)
router.patch('/:id/toggle', validateParams(todoIdParamSchema), toggleTodo)
router.delete('/:id', validateParams(todoIdParamSchema), deleteTodo)

export default router
