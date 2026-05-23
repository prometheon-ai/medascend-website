import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import FadeInView from '../components/animations/FadeInView'
import { useAuth } from '../context/AuthContext'

const stages = ['1st year MBBS', '2nd year', '3rd year', 'Final year', 'Intern', 'NEET-PG aspirant', 'PG resident', 'Other']

const examples = [
  '"I want a revision tracker that shows me everything I\'ve already revised."',
  '"Give me editable one-pagers I can tweak and make my own."',
  '"Tell me the prerequisites and a quick overview before I start a topic, so I know how vast it is."',
  '"Build me a realistic schedule from my exam date and how many hours I can study a day — and reset it if an exam comes up in between."',
  '"Let me upload my own handwritten notes and remind me to revise them at the right intervals."',
  '"Remind me when I haven\'t touched a topic or PDF in a long time."',
]

const inputCls = 'w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary transition-colors duration-200'

export default function HelpPage() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ name: '', stage: '', problem: '', impact: '', email: '' })
  const [status, setStatus] = useState('idle')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.full_name || f.name,
        email: user.email || f.email,
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      await fetch('/api/tell-us', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Helmet>
        <title>Tell Us Your Problem — MedAscend</title>
        <meta name="description" content="Tell us what's slowing you down. However small or specific — we want to hear it." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <FadeInView>
            <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold text-cream leading-tight mb-6">
              Tell us what's slowing you down.
            </h1>
            <p className="text-base md:text-lg text-sky/80 font-family-secondary leading-relaxed mb-4">
              The biggest advantage we have is simple: this is built by a student who actually uses it. There are dozens of small, specific problems in a medical student's day that no platform bothers to fix — but that quietly add up and hurt your preparation.
            </p>
            <p className="text-base md:text-lg text-sky/80 font-family-secondary leading-relaxed mb-10">
              We want to hear yours. However small or specific. Tell us the problem, and we'll try to solve it.
            </p>
          </FadeInView>

          <FadeInView delay={0.15}>
            <div className="mb-10 space-y-2">
              {examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-dark-surface/50 border-l-2 border-teal/40">
                  <p className="text-sm text-sky/75 font-family-secondary italic leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>
          </FadeInView>

          {status === 'success' ? (
            <FadeInView>
              <div className="rounded-2xl border border-teal/20 bg-teal/5 px-8 py-12 text-center">
                <p className="text-2xl font-bold text-cream mb-3">Got it. Thank you.</p>
                <p className="text-sm text-sky font-family-secondary">We read every submission carefully.</p>
              </div>
            </FadeInView>
          ) : (
            <FadeInView delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-5 border border-teal/15 rounded-2xl p-6 bg-dark-surface/30">
                <input type="text" placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
                <select
                  value={form.stage}
                  onChange={e => set('stage', e.target.value)}
                  required
                  className={inputCls + ' appearance-none'}
                  style={{ color: form.stage ? 'var(--color-cream, #f5f0e8)' : 'rgba(147,197,253,0.3)' }}
                >
                  <option value="" disabled>Your stage</option>
                  {stages.map(s => <option key={s} value={s} style={{ color: '#f5f0e8', background: '#0d1b24' }}>{s}</option>)}
                </select>
                <textarea placeholder="The problem you face" value={form.problem} onChange={e => set('problem', e.target.value)} required rows={5} className={inputCls + ' resize-none'} />
                <textarea placeholder="How it affects your studying or prep (optional)" value={form.impact} onChange={e => set('impact', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
                <input type="email" placeholder="Email — so we can follow up (optional)" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
                {status === 'error' && <p className="text-sm text-terracotta font-family-secondary">Something went wrong. Try again.</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending…' : 'Send it to us'}
                </button>
              </form>
            </FadeInView>
          )}
        </div>
      </div>
    </>
  )
}
