import EmptyState from './EmptyState.tsx'
import TodoCard from './TodoCard.tsx'
import type { Todo, TodoStatus } from '../types/todo.ts'

type TodoColumnProps = {
  emptyMessage: string
  onToggleComplete: (todoId: string) => void
  status: TodoStatus
  title: string
  todos: Todo[]
}

function TodoColumn({
  emptyMessage,
  onToggleComplete,
  status,
  title,
  todos,
}: TodoColumnProps) {
  return (
    <section className="todo-column" aria-labelledby={`${status}-title`}>
      <div className="todo-column__header">
        <h2 id={`${status}-title`}>{title}</h2>
        <span>{todos.length}</span>
      </div>

      <div className="todo-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoCard
              key={todo.id}
              onToggleComplete={onToggleComplete}
              todo={todo}
            />
          ))
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    </section>
  )
}

export default TodoColumn
