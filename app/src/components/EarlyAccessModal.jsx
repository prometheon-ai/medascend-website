import { useState } from 'react'
import { X, Send, CheckCircle, Loader2 } from 'lucide-react'
import Logo from './Logo'

export default function EarlyAccessModal({ isOpen, onClose, theme }) {
  const d = theme === 'dark'
  const [form, setForm] = useState({ name: '', college: '', email: '', phone: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Something went wrong. Please try again.')

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  const handleClose = () => {
    if (status === 'success') {
      setForm({ name: '', college: '', email: '', phone: '' })
      setStatus('idle')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl border
          ${d ? 'bg-dark-card border-teal/15' : 'bg-cream border-teal/10'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer bg-transparent border-none
            ${d ? 'text-sky/50 hover:text-cream hover:bg-teal/10' : 'text-teal-deep/40 hover:text-dark hover:bg-teal/8'}`}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-teal/15 flex items-center justify-center">
                <CheckCircle size={32} className="text-teal" />
              </div>
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${d ? 'text-cream' : 'text-dark'}`}>
              You're on the list!
            </h3>
            <p className={`text-base mb-6 font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/60' : 'text-teal-deep/60'}`}>
              We'll notify you as soon as MedAscend launches. Get ready to ascend.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-teal text-cream font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Logo size={36} />
              <div>
                <h3 className={`text-lg font-bold ${d ? 'text-cream' : 'text-dark'}`}>Get Early Access</h3>
                <p className={`text-xs ${d ? 'text-sky/50' : 'text-teal-deep/50'}`}>Be the first to know when we launch</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${d ? 'text-sky/70' : 'text-teal-deep/70'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. / Your Name"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
                    ${d
                      ? 'bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40'
                      : 'bg-white border-teal/12 text-dark placeholder:text-teal-deep/30 focus:border-teal/30'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${d ? 'text-sky/70' : 'text-teal-deep/70'}`}>
                  College / Organization *
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  value={form.college}
                  onChange={handleChange}
                  placeholder="e.g. Seth GS Medical College"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
                    ${d
                      ? 'bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40'
                      : 'bg-white border-teal/12 text-dark placeholder:text-teal-deep/30 focus:border-teal/30'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${d ? 'text-sky/70' : 'text-teal-deep/70'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
                    ${d
                      ? 'bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40'
                      : 'bg-white border-teal/12 text-dark placeholder:text-teal-deep/30 focus:border-teal/30'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${d ? 'text-sky/70' : 'text-teal-deep/70'}`}>
                  Phone <span className={`font-normal ${d ? 'text-sky/30' : 'text-teal-deep/30'}`}>(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
                    ${d
                      ? 'bg-dark-surface border-teal/15 text-cream placeholder:text-sky/30 focus:border-teal/40'
                      : 'bg-white border-teal/12 text-dark placeholder:text-teal-deep/30 focus:border-teal/30'
                    }`}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-terracotta font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-1 flex items-center justify-center gap-2 w-full py-3 bg-teal text-cream font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'loading' ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={18} /> Notify Me at Launch</>
                )}
              </button>
            </form>

            <p className={`mt-4 text-[11px] text-center font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/30' : 'text-teal-deep/30'}`}>
              We'll never spam you. Only launch updates.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
