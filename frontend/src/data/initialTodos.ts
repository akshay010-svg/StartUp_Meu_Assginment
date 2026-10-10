import type { Todo } from '../types/todo.ts'

export const initialTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Prepare sprint notes',
    description: 'Write the short list of priorities before the planning call.',
    dueDate: '2026-10-12',
    priority: 'High',
    status: 'upcoming',
  },
  {
    id: 'todo-2',
    title: 'Review database schema',
    description: 'Check the todo and user fields before wiring MongoDB models.',
    dueDate: '2026-10-14',
    priority: 'Medium',
    status: 'upcoming',
  },
  {
    id: 'todo-3',
    title: 'Publish UI wireframe',
    description: 'Share the completed dashboard layout with the team.',
    dueDate: '2026-10-08',
    priority: 'Low',
    status: 'completed',
  },
  {
    id: 'todo-4',
    title: 'Send status update',
    description: 'This item is overdue and should appear in the missed section.',
    dueDate: '2026-10-06',
    priority: 'Medium',
    status: 'missed',
  },
]
