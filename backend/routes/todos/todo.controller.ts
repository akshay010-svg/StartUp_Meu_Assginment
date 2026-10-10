import type { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import type { AuthRequest } from '../../middleware/auth.middleware.js'
import { Todo, type TodoStatus } from '../../models/Todo.js'
import type { CreateTodoInput, UpdateTodoInput } from '../../schemas/todo.schema.js'

function computePendingStatus(dueDate: string): TodoStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueAt = new Date(`${dueDate}T00:00:00`)
  return dueAt < today ? 'missed' : 'upcoming'
}

export async function getTodos(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const userId = new Types.ObjectId(req.user.userId)
    const todos = await Todo.find({ userId }).sort({ dueDate: 1, createdAt: -1 })

    // Keep status accurate based on current date for non-completed items
    const updatedTodos = todos.map((todo) => {
      const todoObj = todo.toJSON()
      if (todoObj.status !== 'completed') {
        const computed = computePendingStatus(todoObj.dueDate)
        if (todoObj.status !== computed) {
          todo.status = computed
          // Fire and forget internal update for consistency
          todo.save().catch(() => {})
          todoObj.status = computed
        }
      }
      return todoObj
    })

    res.status(200).json({
      success: true,
      count: updatedTodos.length,
      todos: updatedTodos,
    })
  } catch (error) {
    next(error)
  }
}

export async function createTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const body = req.body as CreateTodoInput
    const userId = new Types.ObjectId(req.user.userId)

    const initialStatus =
      body.status || computePendingStatus(body.dueDate)

    const todo = await Todo.create({
      userId,
      title: body.title,
      description: body.description ?? '',
      dueDate: body.dueDate,
      priority: body.priority,
      status: initialStatus,
    })

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: todo.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const { id } = req.params as { id: string }
    const updates = req.body as UpdateTodoInput
    const userId = new Types.ObjectId(req.user.userId)

    const todo = await Todo.findOne({ _id: id, userId })
    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to access it',
      })
      return
    }

    if (updates.title !== undefined) todo.title = updates.title
    if (updates.description !== undefined) todo.description = updates.description
    if (updates.priority !== undefined) todo.priority = updates.priority
    if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate

    if (updates.status !== undefined) {
      todo.status = updates.status
    } else if (updates.dueDate !== undefined && todo.status !== 'completed') {
      todo.status = computePendingStatus(todo.dueDate)
    }

    await todo.save()

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      todo: todo.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function toggleTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const { id } = req.params as { id: string }
    const userId = new Types.ObjectId(req.user.userId)

    const todo = await Todo.findOne({ _id: id, userId })
    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to access it',
      })
      return
    }

    todo.status =
      todo.status === 'completed'
        ? computePendingStatus(todo.dueDate)
        : 'completed'

    await todo.save()

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.status}`,
      todo: todo.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const { id } = req.params as { id: string }
    const userId = new Types.ObjectId(req.user.userId)

    const deleted = await Todo.findOneAndDelete({ _id: id, userId })
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to access it',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      id,
    })
  } catch (error) {
    next(error)
  }
}
