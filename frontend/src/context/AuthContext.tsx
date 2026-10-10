import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, clearToken, getToken } from '../services/api.ts'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signUp: (credentials: { name: string; email: string; password: string }) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    const existingToken = getToken()
    if (!existingToken) {
      return
    }

    let isMounted = true

    async function restoreSession() {
      try {
        const { user: profile } = await api.getMe()
        if (isMounted) {
          setUser(profile)
        }
      } catch {
        if (isMounted) {
          clearToken()
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  async function signIn(credentials: { email: string; password: string }) {
    const response = await api.signIn(credentials)
    setUser(response.user)
  }

  async function signUp(credentials: { name: string; email: string; password: string }) {
    const response = await api.signUp(credentials)
    setUser(response.user)
  }

  function signOut() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
