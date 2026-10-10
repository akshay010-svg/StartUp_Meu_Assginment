import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm, { type AuthCredentials } from '../components/AuthForm.tsx'
import { useAuth } from '../context/AuthContext.tsx'

type SignInPageProps = {
  errorMessage?: string | null
  isLoading?: boolean
  onCreateAccount?: () => void
  onSignIn?: (credentials: { email: string; password: string }) => void | Promise<void>
}

function SignInPage({
  errorMessage: initialErrorMessage,
  isLoading: initialIsLoading,
  onCreateAccount,
  onSignIn,
}: SignInPageProps = {}) {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [internalError, setInternalError] = useState<string | null>(null)
  const [internalLoading, setInternalLoading] = useState(false)

  const errorMessage = initialErrorMessage ?? internalError
  const isLoading = initialIsLoading ?? internalLoading

  async function handleSubmit(credentials: AuthCredentials) {
    if (onSignIn) {
      await onSignIn({
        email: credentials.email,
        password: credentials.password,
      })
      return
    }

    setInternalLoading(true)
    setInternalError(null)

    try {
      await signIn({
        email: credentials.email,
        password: credentials.password,
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      setInternalError(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to sign in. Please check your credentials.',
      )
    } finally {
      setInternalLoading(false)
    }
  }

  function handleSwitchMode() {
    if (onCreateAccount) {
      onCreateAccount()
    } else {
      navigate('/signup')
    }
  }

  return (
    <main className="auth-page">
      <AuthForm
        errorMessage={errorMessage}
        isLoading={isLoading}
        mode="sign-in"
        onSubmit={handleSubmit}
        onSwitchMode={handleSwitchMode}
      />
    </main>
  )
}

export default SignInPage
