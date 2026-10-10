import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.tsx'
import TodoColumn from '../components/TodoColumn.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { api } from '../services/api.ts'
import type { Todo, TodoStatus } from '../types/todo.ts'

type DashboardPageProps = {
  onCreateTodo?: () => void
  onSignOut?: () => void
  onToggleComplete?: (todoId: string) => void | Promise<void>
  todos?: Todo[]
  userName?: string
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
  todos: propTodos,
  userName: propUserName,
}: DashboardPageProps = {}) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const userName = propUserName ?? user?.name ?? 'User'

  const [fetchedTodos, setFetchedTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(propTodos === undefined)
  const [loadError, setLoadError] = useState<string | null>(null)

  const todos = propTodos !== undefined ? propTodos : fetchedTodos

  useEffect(() => {
    if (propTodos !== undefined) {
      return
    }

    let isMounted = true

    async function loadTodos() {
      try {
        setIsLoading(true)
        setLoadError(null)
        const userTodos = await api.getTodos()
        if (isMounted) {
          setFetchedTodos(userTodos)
        }
      } catch (err: unknown) {
        if (isMounted) {
          setLoadError(
            err instanceof Error && err.message
              ? err.message
              : 'Failed to load todos.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTodos()

    return () => {
      isMounted = false
    }
  }, [propTodos])

  async function handleToggleComplete(todoId: string) {
    if (onToggleComplete) {
      await onToggleComplete(todoId)
      return
    }

    try {
      const updatedTodo = await api.toggleTodo(todoId)
      setFetchedTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
      )
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to update todo status.'
      alert(message)
    }
  }

  function handleCreateTodo() {
    if (onCreateTodo) {
      onCreateTodo()
    } else {
      navigate('/create')
    }
  }

  function handleSignOut() {
    if (onSignOut) {
      onSignOut()
    } else {
      signOut()
      navigate('/signin')
    }
  }

  return (
    <AppShell
      activeView="dashboard"
      onCreateTodo={handleCreateTodo}
      onSignOut={handleSignOut}
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

        {loadError ? (
          <div className="auth-error-message" role="alert">
            {loadError}
          </div>
        ) : null}

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

        {isLoading ? (
          <p className="empty-state">Loading your tasks...</p>
        ) : (
          <div className="todo-board">
            {sections.map((section) => (
              <TodoColumn
                emptyMessage={section.emptyMessage}
                key={section.status}
                onToggleComplete={handleToggleComplete}
                status={section.status}
                title={section.title}
                todos={todos.filter((todo) => todo.status === section.status)}
              />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  )
}

export default DashboardPage
