import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QrCode, Mail, Lock, User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input, Button, Card } from '../../components/ui'
import { PasswordStrength } from '../../components/shared'
import { useApp } from '../../context/AppContext'
import { useStore } from '../../hooks/useStore'

// ─── LOGIN ───
export function LoginPage() {
  const navigate = useNavigate()
  const { login, addToast } = useApp()
  const store = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => {
      const org = store.authenticateOrganizer(email, password)
      if (org) {
        login({ name: org.name, email: org.email, role: 'organizer', id: org.id })
        addToast('Welcome back!', 'success')
        navigate('/admin')
      } else {
        setError('Invalid email or password. Try admin@university.edu.ph / admin123')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 gradient-mesh">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
            <QrCode size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your events</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email Address" icon={Mail} type="email" placeholder="admin@university.edu.ph" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <Input label="Password" icon={Lock} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          <Button className="w-full !py-3" loading={loading}>Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register-organizer" className="text-brand-600 font-semibold hover:underline">Register as Organizer</Link>
        </p>

        <div className="mt-4 p-3 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-[11px] text-slate-400 text-center">
            Demo: <span className="font-mono text-slate-500">admin@university.edu.ph</span> / <span className="font-mono text-slate-500">admin123</span>
          </p>
        </div>
      </Card>
    </div>
  )
}

// ─── REGISTER ORGANIZER ───
export function RegisterOrganizerPage() {
  const navigate = useNavigate()
  const store = useStore()
  const { addToast } = useApp()
  const [form, setForm] = useState({ name: '', email: '', institution: '', password: '', confirmPw: '', privacy: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.privacy) return
    if (form.password !== form.confirmPw) return
    setLoading(true)
    setTimeout(() => {
      const result = store.registerOrganizer({ name: form.name, email: form.email, password: form.password, institution: form.institution })
      if (result) {
        addToast('Account created! Please verify your email.', 'success')
        setSubmitted(true)
      } else {
        addToast('An account with this email already exists.', 'error')
      }
      setLoading(false)
    }, 1000)
  }

  if (submitted) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Email Sent</h2>
        <p className="text-sm text-slate-400 mb-6">Please check your email to verify your account before logging in.</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </Card>
    </div>
  )

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 gradient-mesh">
      <Card className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800">Create Organizer Account</h2>
          <p className="text-sm text-slate-400 mt-1">Set up your event management account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" icon={User} placeholder="Dr. Maria Santos" value={form.name} onChange={e => update('name', e.target.value)} required />
          <Input label="Email Address" icon={Mail} type="email" placeholder="maria@university.edu.ph" value={form.email} onChange={e => update('email', e.target.value)} required />
          <Input label="Institution / Department" icon={Building2} placeholder="College of Computing" value={form.institution} onChange={e => update('institution', e.target.value)} />
          <div>
            <Input label="Password" icon={Lock} type="password" placeholder="Create a strong password" value={form.password} onChange={e => update('password', e.target.value)} required />
            <PasswordStrength password={form.password} />
          </div>
          <Input label="Confirm Password" icon={Lock} type="password" placeholder="Re-enter password" value={form.confirmPw} onChange={e => update('confirmPw', e.target.value)} error={form.confirmPw && form.password !== form.confirmPw ? 'Passwords do not match' : ''} required />
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.privacy} onChange={e => update('privacy', e.target.checked)} className="rounded border-surface-300 text-brand-600 mt-0.5" />
            <span className="text-xs text-slate-400 leading-relaxed">I agree to the Privacy Policy and consent to data processing for event management purposes.</span>
          </label>
          <Button className="w-full !py-3" loading={loading} disabled={!form.privacy || !form.name || !form.email || !form.password || form.password !== form.confirmPw}>Create Account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  )
}
