import { createContext, useContext, useMemo, useState } from 'react'

import api from '../api/axios'

type User = {
  id: number
  name: string
  email: string
  role: string
  company_id?: number
  status?: string
}

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: Record<string, string>) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('access_token', data.access_token)
      const me = await api.get('/auth/me')
      setUser(me.data)
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: Record<string, string>) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('access_token', data.access_token)
      const me = await api.get('/auth/me')
      setUser(me.data)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
