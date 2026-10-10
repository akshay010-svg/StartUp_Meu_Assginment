import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import CreateTodoPage from './pages/CreateTodoPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import SignInPage from './pages/SignInPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest routes: only accessible when unauthenticated */}
          <Route element={<GuestRoute />}>
            <Route element={<SignInPage />} path="/signin" />
            <Route element={<SignUpPage />} path="/signup" />
          </Route>

          {/* Protected routes: require active authenticated session */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<CreateTodoPage />} path="/create" />
          </Route>

          {/* Canonical redirects and route aliases */}
          <Route element={<Navigate replace to="/dashboard" />} path="/" />
          <Route element={<Navigate replace to="/signin" />} path="/sign-in" />
          <Route element={<Navigate replace to="/signup" />} path="/sign-up" />
          <Route element={<Navigate replace to="/create" />} path="/create-todo" />
          <Route element={<Navigate replace to="/dashboard" />} path="*" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
