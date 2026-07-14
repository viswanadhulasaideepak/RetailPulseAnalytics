import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants/routes'

type RegisterFormValues = {
  company_name: string
  industry: string
  company_email: string
  company_address: string
  company_phone: string
  owner_name: string
  owner_email: string
  password: string
  confirm_password: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, loading } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>()

  const password = watch('password')

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values)
      navigate(ROUTES.dashboard)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">RetailPulse</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Start your company workspace</h1>
          <p className="mt-2 text-sm text-slate-500">Register your company and create the first admin account.</p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('company_name', { required: 'Company name is required' })} />
            {errors.company_name && <p className="mt-1 text-sm text-rose-500">{errors.company_name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Industry</label>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('industry', { required: 'Industry is required' })} />
            {errors.industry && <p className="mt-1 text-sm text-rose-500">{errors.industry.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company Email</label>
            <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('company_email', { required: 'Company email is required' })} />
            {errors.company_email && <p className="mt-1 text-sm text-rose-500">{errors.company_email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company Phone</label>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('company_phone', { required: 'Phone is required' })} />
            {errors.company_phone && <p className="mt-1 text-sm text-rose-500">{errors.company_phone.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Company Address</label>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('company_address', { required: 'Address is required' })} />
            {errors.company_address && <p className="mt-1 text-sm text-rose-500">{errors.company_address.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Owner Name</label>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('owner_name', { required: 'Owner name is required' })} />
            {errors.owner_name && <p className="mt-1 text-sm text-rose-500">{errors.owner_name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Owner Email</label>
            <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('owner_email', { required: 'Owner email is required' })} />
            {errors.owner_email && <p className="mt-1 text-sm text-rose-500">{errors.owner_email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
            {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" {...register('confirm_password', { required: 'Confirm your password', validate: value => value === password || 'Passwords do not match' })} />
            {errors.confirm_password && <p className="mt-1 text-sm text-rose-500">{errors.confirm_password.message}</p>}
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
            <button type="submit" className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700" disabled={loading}>
              {loading ? 'Creating workspace...' : 'Create company'}
            </button>
            <p className="text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to={ROUTES.login}>Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
