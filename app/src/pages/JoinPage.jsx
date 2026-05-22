import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import FadeInView from '../components/animations/FadeInView'

const roles = ['Student', 'Professional', 'Doctor', 'Educator', 'Developer', 'Designer', 'Investor', 'Other']

const inputCls = 'w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary transition-colors duration-200'

export default function JoinPage() {
  const [form, setForm] = useState({ name: '', age: '', role: '', email: '', phone: '', description: '', cv: null })
  const [status, setStatus] = useState('idle')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v) })
      await fetch('/api/join-us', { method: 'POST', body: data })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Helmet>
        <title>Help Us Build It — MedAscend</title>
        <meta name="description" content="MedAscend is looking for developers, medical content creators, designers, doctors, educators, and investors. If this matters to you, tell us about yourself." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-[#0a1218]">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <FadeInView>
            <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold text-cream leading-tight mb-6">
              Help us build it.
            </h1>
            <p className="text-base md:text-lg text-sky/60 font-family-secondary leading-relaxed mb-12">
              MedAscend is a long, deliberate effort to streamline medical education in India. We are looking for people who want to be part of that — developers, medical content creators, designers, doctors, educators, and investors. If this matters to you, tell us about yourself.
            </p>
          </FadeInView>

          {status === 'success' ? (
            <FadeInView>
              <div className="rounded-2xl border border-teal/20 bg-teal/5 px-8 py-12 text-center">
                <p className="text-2xl font-bold text-cream mb-3">We'll be in touch.</p>
                <p className="text-sm text-sky/50 font-family-secondary">Thanks for reaching out.</p>
              </div>
            </FadeInView>
          ) : (
            <FadeInView delay={0.15}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
                <input type="number" placeholder="Age" value={form.age} onChange={e => set('age', e.target.value)} required className={inputCls} />
                <select
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  required
                  className={inputCls + ' appearance-none'}
                  style={{ color: form.role ? 'var(--color-cream, #f5f0e8)' : 'rgba(147,197,253,0.3)' }}
                >
                  <option value="" disabled>I am a</option>
                  {roles.map(r => <option key={r} value={r} style={{ color: '#f5f0e8', background: '#0d1b24' }}>{r}</option>)}
                </select>
                <input type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} required className={inputCls} />
                <textarea
                  placeholder="Describe yourself — who you are and how you'd like to contribute"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  required
                  rows={5}
                  className={inputCls + ' resize-none'}
                />
                <div>
                  <label className="block text-xs text-sky/40 font-family-secondary mb-2 uppercase tracking-wider">CV / Resume (optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => set('cv', e.target.files[0] || null)}
                    className="text-sm text-sky/50 font-family-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal/15 file:text-teal-light hover:file:bg-teal/25 cursor-pointer"
                  />
                </div>
                {status === 'error' && <p className="text-sm text-terracotta font-family-secondary">Something went wrong. Try again.</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending…' : 'Reach out'}
                </button>
              </form>
            </FadeInView>
          )}
        </div>
      </div>
    </>
  )
}
