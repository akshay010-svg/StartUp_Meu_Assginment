import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from './Button.tsx'
import { TextField } from './FormField.tsx'

type AuthMode = 'sign-in' | 'sign-up'

export type AuthCredentials = {
  name?: string
  email: string
  password: string
}

type AuthFormProps = {
  errorMessage?: string | null
  isLoading?: boolean
  mode: AuthMode
  onSubmit: (credentials: AuthCredentials) => void | Promise<void>
  onSwitchMode: () => void
}

function AuthForm({
  errorMessage,
  isLoading = false,
  mode,
  onSubmit,
  onSwitchMode,
}: AuthFormProps) {
  const isSignUp = mode === 'sign-up'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const canSubmit = email.trim().length > 0 && password.trim().length > 0
  const signUpReady = !isSignUp || name.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || !signUpReady || isLoading) {
      return
    }

    onSubmit({
      email: email.trim(),
      password,
      name: isSignUp ? name.trim() : undefined,
    })
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <p className="eyebrow">Todo workspace</p>
      <h1 id="auth-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
      <p className="auth-card__intro">
        {isSignUp
          ? 'Set up a simple workspace for tracking every task.'
          : 'Sign in to review upcoming, completed, and missed todos.'}
      </p>

      {errorMessage ? (
        <div className="auth-error-message" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <form className="stack" onSubmit={handleSubmit}>
        {isSignUp ? (
          <TextField
            autoComplete="name"
            id="name"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Aksha"
            required
            type="text"
            value={name}
          />
        ) : null}

        <TextField
          autoComplete="email"
          id="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />

        <TextField
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          id="password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          required
          type="password"
          value={password}
        />

        <Button
          disabled={!canSubmit || !signUpReady || isLoading}
          fullWidth
          type="submit"
        >
          {isLoading
            ? isSignUp
              ? 'Creating account...'
              : 'Signing in...'
            : isSignUp
              ? 'Sign up'
              : 'Sign in'}
        </Button>
      </form>

      <p className="auth-card__switch">
        {isSignUp ? 'Already have an account?' : 'New here?'}
        <button type="button" onClick={onSwitchMode}>
          {isSignUp ? 'Sign in' : 'Create account'}
        </button>
      </p>
    </section>
  )
}

export default AuthForm
