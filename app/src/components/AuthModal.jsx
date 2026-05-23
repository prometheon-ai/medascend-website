import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import Logo from './Logo'

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', college: '', batch: '', email: '', phone: '', password: '' })

  if (!isOpen) return null

  const handleClose = () => {
    setStatus('idle')
    setErrorMsg('')
    setShowPassword(false)
    onClose()
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Invalid credentials. Please try again.')
      }
      handleClose()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Registration failed. Please try again.')
      }
      handleClose()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl border bg-dark-card border-teal/15"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer bg-transparent border-none text-sky/75 hover:text-cream hover:bg-teal/10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Logo + tabs */}
        <div className="flex items-center gap-3 mb-6">
          <Logo size={36} />
          <div>
            <h3 className="text-lg font-bold text-cream">MedAscend</h3>
            <p className="text-xs text-sky/75">Your medical education platform</p>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-dark-surface mb-6">
          <button
            onClick={() => { setTab('login'); setStatus('idle'); setErrorMsg('') }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-none ${tab === 'login' ? 'bg-teal text-cream' : 'bg-transparent text-sky/80 hover:text-cream'}`}
          >
            Already have an account
          </button>
          <button
            onClick={() => { setTab('register'); setStatus('idle'); setErrorMsg('') }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-none ${tab === 'register' ? 'bg-teal text-cream' : 'bg-transparent text-sky/80 hover:text-cream'}`}
          >
            New here
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sky/85 hover:text-sky/80 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {status === 'error' && <p className="text-sm text-terracotta font-medium">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 flex items-center justify-center gap-2 w-full py-3 bg-teal text-cream font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Logging in...</> : 'Login'}
            </button>
            <p className="text-center text-xs text-sky/85 font-family-secondary">
              Don't have an account?{' '}
              <button type="button" onClick={() => setTab('register')} className="text-teal underline bg-transparent border-none cursor-pointer text-xs">
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Full Name</label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">College / Institution</label>
              <input
                type="text"
                required
                value={registerForm.college}
                onChange={(e) => setRegisterForm(p => ({ ...p, college: e.target.value }))}
                placeholder="e.g. Seth GS Medical College"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Batch</label>
              <select
                required
                value={registerForm.batch}
                onChange={(e) => setRegisterForm(p => ({ ...p, batch: e.target.value }))}
                className={`${inputClass} appearance-none`}
              >
                <option value="" disabled>Select your batch</option>
                {Array.from({ length: 7 }, (_, i) => 2019 + i).map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Email</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Phone</label>
              <input
                type="tel"
                required
                value={registerForm.phone}
                onChange={(e) => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sky/85">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sky/85 hover:text-sky/80 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {status === 'error' && <p className="text-sm text-terracotta font-medium">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 flex items-center justify-center gap-2 w-full py-3 bg-teal text-cream font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
            <p className="text-center text-xs text-sky/85 font-family-secondary">
              Already have an account?{' '}
              <button type="button" onClick={() => setTab('login')} className="text-teal underline bg-transparent border-none cursor-pointer text-xs">
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
