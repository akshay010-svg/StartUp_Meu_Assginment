import AuthForm, { type AuthCredentials } from '../components/AuthForm.tsx'

type SignInPageProps = {
  errorMessage?: string | null
  isLoading?: boolean
  onCreateAccount: () => void
  onSignIn: (credentials: { email: string; password: string }) => void | Promise<void>
}

function SignInPage({
  errorMessage,
  isLoading,
  onCreateAccount,
  onSignIn,
}: SignInPageProps) {
  function handleSubmit(credentials: AuthCredentials) {
    onSignIn({
      email: credentials.email,
      password: credentials.password,
    })
  }

  return (
    <main className="auth-page">
      <AuthForm
        errorMessage={errorMessage}
        isLoading={isLoading}
        mode="sign-in"
        onSubmit={handleSubmit}
        onSwitchMode={onCreateAccount}
      />
    </main>
  )
}

export default SignInPage
