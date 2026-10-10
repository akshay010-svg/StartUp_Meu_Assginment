import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

type GuestRouteProps = {
  children?: ReactNode
}

function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="auth-page" style={{ justifyContent: 'center' }}>
        <p className="eyebrow">Loading workspace...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  return children ? <>{children}</> : <Outlet />
}

export default GuestRoute
