import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants/routes'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()

  const [authError, setAuthError] = useState<string | null>(null)

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null)

    try {
      await login(values.email, values.password)
      navigate(ROUTES.dashboard)
    } catch (error: any) {
      setAuthError(error.response?.data?.detail || 'Login failed. Please check your email and password.')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">RetailPulse</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-slate-500">Access dashboards, reports, and company insights.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Admin Email</label>
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-indigo-500"
              placeholder="admin@company.com"
              {...register('email', { required: 'Email is required' })}
            />
            <p className="text-xs text-slate-400">Use the admin/owner email for login.</p>
            {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>}
          </div>

          {authError && <p className="text-center text-sm text-rose-500">{authError}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to={ROUTES.register}>
            Create your company
          </Link>
        </p>
      </div>
    </div>
  )
}
