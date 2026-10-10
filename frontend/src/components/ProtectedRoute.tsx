import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

type ProtectedRouteProps = {
  children?: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="auth-page" style={{ justifyContent: 'center' }}>
        <p className="eyebrow">Loading workspace...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/signin" />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
