import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, {user?.name || 'User'}</h1>
            <p className="mt-2 text-slate-500">Your company workspace is ready for analytics and reporting.</p>
          </div>
          <button onClick={logout} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100">
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{user?.role || 'Company Admin'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{user?.email || 'n/a'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Company</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{user?.company_id || 'Pending'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
