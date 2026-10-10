import { z } from 'zod'

export const priorityEnum = ['Low', 'Medium', 'High'] as const
export const statusEnum = ['upcoming', 'completed', 'missed'] as const

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .default(''),
  dueDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  priority: z.enum(priorityEnum),
  status: z.enum(statusEnum).optional(),
})

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be 200 characters or fewer')
      .optional(),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional(),
    dueDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
      .optional(),
    priority: z.enum(priorityEnum).optional(),
    status: z.enum(statusEnum).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })

export const todoIdParamSchema = z.object({
  id: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'Invalid todo ID format (must be 24-character hex ObjectId)',
    ),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoIdParam = z.infer<typeof todoIdParamSchema>
