import { useEffect, useState } from 'react'
import './App.css'
import CreateTodoPage from './pages/CreateTodoPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import SignInPage from './pages/SignInPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import { api, clearToken, getToken } from './services/api.ts'
import type { Todo, TodoDraft } from './types/todo.ts'

type AppView = 'sign-in' | 'sign-up' | 'dashboard' | 'create-todo'

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

function App() {
  const [view, setView] = useState<AppView>('sign-in')
  const [userName, setUserName] = useState('User')
  const [todos, setTodos] = useState<Todo[]>([])
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)

  // Verify existing session on initial mount
  useEffect(() => {
    const existingToken = getToken()
    if (!existingToken) {
      return
    }

    let isMounted = true

    async function restoreSession() {
      try {
        const { user } = await api.getMe()
        if (!isMounted) return

        setUserName(user.name || 'User')
        const userTodos = await api.getTodos()
        if (!isMounted) return

        setTodos(userTodos)
        setView('dashboard')
      } catch {
        if (!isMounted) return
        clearToken()
        setView('sign-in')
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSignIn(credentials: {
    email: string
    password: string
  }) {
    setIsLoadingAuth(true)
    setAuthError(null)

    try {
      const response = await api.signIn(credentials)
      setUserName(response.user.name || 'User')

      const userTodos = await api.getTodos()
      setTodos(userTodos)
      setView('dashboard')
    } catch (err: unknown) {
      setAuthError(
        getErrorMessage(err, 'Unable to sign in. Please check your credentials.'),
      )
    } finally {
      setIsLoadingAuth(false)
    }
  }

  async function handleSignUp(credentials: {
    name: string
    email: string
    password: string
  }) {
    setIsLoadingAuth(true)
    setAuthError(null)

    try {
      const response = await api.signUp(credentials)
      setUserName(response.user.name || 'User')
      setTodos([])
      setView('dashboard')
    } catch (err: unknown) {
      setAuthError(
        getErrorMessage(err, 'Unable to create account. Please try again.'),
      )
    } finally {
      setIsLoadingAuth(false)
    }
  }

  function handleSignOut() {
    clearToken()
    setUserName('User')
    setTodos([])
    setAuthError(null)
    setView('sign-in')
  }

  async function handleCreateTodo(todoDraft: TodoDraft) {
    try {
      const newTodo = await api.createTodo(todoDraft)
      setTodos((currentTodos) => [newTodo, ...currentTodos])
      setView('dashboard')
    } catch (err: unknown) {
      alert(
        getErrorMessage(
          err,
          'Failed to create todo. Please check your inputs.',
        ),
      )
    }
  }

  async function handleToggleComplete(todoId: string) {
    try {
      const updatedTodo = await api.toggleTodo(todoId)
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
      )
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Failed to update todo status.'))
    }
  }

  function handleSwitchToSignUp() {
    setAuthError(null)
    setView('sign-up')
  }

  function handleSwitchToSignIn() {
    setAuthError(null)
    setView('sign-in')
  }

  if (view === 'sign-up') {
    return (
      <SignUpPage
        errorMessage={authError}
        isLoading={isLoadingAuth}
        onSignIn={handleSwitchToSignIn}
        onSignUp={handleSignUp}
      />
    )
  }

  if (view === 'create-todo') {
    return (
      <CreateTodoPage
        onCancel={() => setView('dashboard')}
        onCreateTodo={handleCreateTodo}
        onSignOut={handleSignOut}
        userName={userName}
      />
    )
  }

  if (view === 'dashboard') {
    return (
      <DashboardPage
        onCreateTodo={() => setView('create-todo')}
        onSignOut={handleSignOut}
        onToggleComplete={handleToggleComplete}
        todos={todos}
        userName={userName}
      />
    )
  }

  return (
    <SignInPage
      errorMessage={authError}
      isLoading={isLoadingAuth}
      onCreateAccount={handleSwitchToSignUp}
      onSignIn={handleSignIn}
    />
  )
}

export default App
