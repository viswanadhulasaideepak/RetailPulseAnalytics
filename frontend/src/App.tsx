import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import DashboardPage from './pages/dashboard/Dashboard'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
