import Button from './Button.tsx'
import type { Todo } from '../types/todo.ts'

type TodoCardProps = {
  onToggleComplete: (todoId: string) => void
  todo: Todo
}

function TodoCard({ onToggleComplete, todo }: TodoCardProps) {
  const isCompleted = todo.status === 'completed'

  return (
    <article className="todo-card">
      <div className="todo-card__header">
        <h3>{todo.title}</h3>
        <span className={`priority priority--${todo.priority.toLowerCase()}`}>
          {todo.priority}
        </span>
      </div>
      <p>{todo.description}</p>
      <div className="todo-card__footer">
        <time dateTime={todo.dueDate}>{todo.dueDate}</time>
        <Button
          onClick={() => onToggleComplete(todo.id)}
          variant={isCompleted ? 'secondary' : 'ghost'}
        >
          {isCompleted ? 'Reopen' : 'Complete'}
        </Button>
      </div>
    </article>
  )
}

export default TodoCard
