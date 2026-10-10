import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm, { type AuthCredentials } from '../components/AuthForm.tsx'
import { useAuth } from '../context/AuthContext.tsx'

type SignUpPageProps = {
  errorMessage?: string | null
  isLoading?: boolean
  onSignIn?: () => void
  onSignUp?: (credentials: {
    name: string
    email: string
    password: string
  }) => void | Promise<void>
}

function SignUpPage({
  errorMessage: initialErrorMessage,
  isLoading: initialIsLoading,
  onSignIn,
  onSignUp,
}: SignUpPageProps = {}) {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [internalError, setInternalError] = useState<string | null>(null)
  const [internalLoading, setInternalLoading] = useState(false)

  const errorMessage = initialErrorMessage ?? internalError
  const isLoading = initialIsLoading ?? internalLoading

  async function handleSubmit(credentials: AuthCredentials) {
    if (onSignUp) {
      await onSignUp({
        name: credentials.name ?? '',
        email: credentials.email,
        password: credentials.password,
      })
      return
    }

    setInternalLoading(true)
    setInternalError(null)

    try {
      await signUp({
        name: credentials.name ?? '',
        email: credentials.email,
        password: credentials.password,
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      setInternalError(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to create account. Please try again.',
      )
    } finally {
      setInternalLoading(false)
    }
  }

  function handleSwitchMode() {
    if (onSignIn) {
      onSignIn()
    } else {
      navigate('/signin')
    }
  }

  return (
    <main className="auth-page">
      <AuthForm
        errorMessage={errorMessage}
        isLoading={isLoading}
        mode="sign-up"
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
      />
    </main>
  )
}

export default SignUpPage
