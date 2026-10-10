export type TodoStatus = 'upcoming' | 'completed' | 'missed'

export type TodoPriority = 'Low' | 'Medium' | 'High'

export type Todo = {
  id: string
  title: string
  description: string
  dueDate: string
  priority: TodoPriority
  status: TodoStatus
}

export type TodoDraft = Omit<Todo, 'id' | 'status'>
