import AppShell from '../components/AppShell.tsx'
import TodoColumn from '../components/TodoColumn.tsx'
import type { Todo, TodoStatus } from '../types/todo.ts'

type DashboardPageProps = {
  onCreateTodo: () => void
  onSignOut: () => void
  onToggleComplete: (todoId: string) => void
  todos: Todo[]
  userName: string
}

const sections: {
  emptyMessage: string
  status: TodoStatus
  title: string
}[] = [
  {
    emptyMessage: 'No upcoming work. Add a todo when you are ready.',
    status: 'upcoming',
    title: 'Upcoming todos',
  },
  {
    emptyMessage: 'Completed items will appear here.',
    status: 'completed',
    title: 'Completed todos',
  },
  {
    emptyMessage: 'Nothing missed. Nice and calm.',
    status: 'missed',
    title: 'Missed todos',
  },
]

function DashboardPage({
  onCreateTodo,
  onSignOut,
  onToggleComplete,
  todos,
  userName,
}: DashboardPageProps) {
  return (
    <AppShell
      activeView="dashboard"
      onCreateTodo={onCreateTodo}
      onSignOut={onSignOut}
      userName={userName}
    >
      <main className="page">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Home</p>
            <h1>Good to see you, {userName}</h1>
          </div>
          <p>
            Keep the day simple: review what is next, what is done, and what
            needs attention.
          </p>
        </section>

        <section className="summary-grid" aria-label="Todo summary">
          {sections.map((section) => (
            <div className="summary-item" key={section.status}>
              <span>
                {todos.filter((todo) => todo.status === section.status).length}
              </span>
              <p>{section.title}</p>
            </div>
          ))}
        </section>

        <div className="todo-board">
          {sections.map((section) => (
            <TodoColumn
              emptyMessage={section.emptyMessage}
              key={section.status}
              onToggleComplete={onToggleComplete}
              status={section.status}
              title={section.title}
              todos={todos.filter((todo) => todo.status === section.status)}
            />
          ))}
        </div>
      </main>
    </AppShell>
  )
}

export default DashboardPage
