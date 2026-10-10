import type { ReactNode } from 'react'
import Button from './Button.tsx'

type AppShellProps = {
  activeView: 'dashboard' | 'create'
  children: ReactNode
  onCreateTodo?: () => void
  onDashboard?: () => void
  onSignOut: () => void
  userName: string
}

function AppShell({
  activeView,
  children,
  onCreateTodo,
  onDashboard,
  onSignOut,
  userName,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <a className="brand" href="#dashboard" onClick={onDashboard}>
            TodoFlow
          </a>
          <p className="topbar__meta">Signed in as {userName}</p>
        </div>

        <nav className="topbar__actions" aria-label="Primary">
          {activeView === 'create' ? (
            <Button onClick={onDashboard} variant="secondary">
              Dashboard
            </Button>
          ) : (
            <Button onClick={onCreateTodo}>New todo</Button>
          )}
          <Button onClick={onSignOut} variant="ghost">
            Sign out
          </Button>
        </nav>
      </header>

      {children}
    </div>
  )
}

export default AppShell
