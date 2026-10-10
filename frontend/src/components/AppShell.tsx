import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button.tsx'
import { useAuth } from '../context/AuthContext.tsx'

type AppShellProps = {
  activeView: 'dashboard' | 'create'
  children: ReactNode
  onCreateTodo?: () => void
  onDashboard?: () => void
  onSignOut?: () => void
  userName?: string
}

function AppShell({
  activeView,
  children,
  onCreateTodo,
  onDashboard,
  onSignOut,
  userName: propUserName,
}: AppShellProps) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const userName = propUserName ?? user?.name ?? 'User'

  function handleDashboard() {
    if (onDashboard) {
      onDashboard()
    } else {
      navigate('/dashboard')
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
    <div className="app-shell">
      <header className="topbar">
        <div>
          <Link className="brand" to="/dashboard">
            TodoFlow
          </Link>
          <p className="topbar__meta">Signed in as {userName}</p>
        </div>

        <nav className="topbar__actions" aria-label="Primary">
          {activeView === 'create' ? (
            <Button onClick={handleDashboard} variant="secondary">
              Dashboard
            </Button>
          ) : (
            <Button onClick={handleCreateTodo}>New todo</Button>
          )}
          <Button onClick={handleSignOut} variant="ghost">
            Sign out
          </Button>
        </nav>
      </header>

      {children}
    </div>
  )
}

export default AppShell
