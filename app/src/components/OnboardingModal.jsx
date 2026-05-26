import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40"

export default function OnboardingModal() {
  const { user, needsOnboarding, completeOnboarding } = useAuth()
  const [form, setForm] = useState({
    name: user?.full_name || '',
    college: user?.college || '',
    batch: user?.year_of_study ? String(2018 + user.year_of_study) : '',
    phone: user?.phone || '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  if (!needsOnboarding) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await completeOnboarding(form)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl border bg-dark-card border-teal/15">
        <div className="flex items-center gap-3 mb-2">
          <Logo size={36} />
          <div>
            <h3 className="text-lg font-bold text-cream">One last step</h3>
            <p className="text-xs text-sky/60">Tell us a bit about yourself</p>
          </div>
        </div>
        <p className="text-xs text-sky/50 mb-6 font-family-secondary">
          This helps us personalise your experience. Takes 10 seconds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-sky/85">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-sky/85">College / Institution</label>
            <input
              type="text"
              required
              value={form.college}
              onChange={set('college')}
              placeholder="e.g. Seth GS Medical College"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-sky/85">Batch</label>
            <select
              required
              value={form.batch}
              onChange={set('batch')}
              className={`${inputClass} appearance-none`}
            >
              <option value="" disabled>Select your batch</option>
              {Array.from({ length: 7 }, (_, i) => 2019 + i).map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-sky/85">Phone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-terracotta font-medium">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-1 flex items-center justify-center gap-2 w-full py-3 bg-teal text-cream font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
