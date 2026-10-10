import AuthForm, { type AuthCredentials } from '../components/AuthForm.tsx'

type SignUpPageProps = {
  errorMessage?: string | null
  isLoading?: boolean
  onSignIn: () => void
  onSignUp: (credentials: {
    name: string
    email: string
    password: string
  }) => void | Promise<void>
}

function SignUpPage({
  errorMessage,
  isLoading,
  onSignIn,
  onSignUp,
}: SignUpPageProps) {
  function handleSubmit(credentials: AuthCredentials) {
    onSignUp({
      name: credentials.name ?? '',
      email: credentials.email,
      password: credentials.password,
    })
  }

  return (
    <main className="auth-page">
      <AuthForm
        errorMessage={errorMessage}
        isLoading={isLoading}
        mode="sign-up"
        onSubmit={handleSubmit}
        onSwitchMode={onSignIn}
      />
    </main>
  )
}

export default SignUpPage
