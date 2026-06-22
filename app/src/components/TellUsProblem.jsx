import { useState } from 'react'
import FadeInView from './animations/FadeInView'
import { readApiErrorMessage } from '../lib/api'

const stages = [
  '1st year MBBS',
  '2nd year',
  '3rd year',
  'Final year',
  'Intern',
  'NEET-PG aspirant',
  'PG resident',
  'Other',
]

const examples = [
  '"I want a revision tracker that shows me everything I\'ve already revised."',
  '"Give me editable one-pagers I can tweak and make my own."',
  '"Tell me the prerequisites and a quick overview before I start a topic, so I know how vast it is."',
  '"Build me a realistic schedule from my exam date and how many hours I can study a day — and reset it if an exam comes up in between."',
  '"Let me upload my own handwritten notes and remind me to revise them at the right intervals."',
  '"Remind me when I haven\'t touched a topic or PDF in a long time."',
]

export default function TellUsProblem() {
  const [form, setForm] = useState({ name: '', stage: '', problem: '', impact: '', email: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('Unable to send your problem right now.')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/v1/tell-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await readApiErrorMessage(res, 'Unable to send your problem right now.'))
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Unable to send your problem right now.')
      setStatus('error')
    }
  }

  return (
    <section id="tell-us" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-2xl mx-auto px-6">
        <FadeInView>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight mb-6">
            Tell us what's slowing you down.
          </h2>
          <p className="text-base text-sky/60 font-family-secondary leading-relaxed mb-3">
            The biggest advantage we have is simple: this is built by a student who actually uses it. There are dozens of small, specific problems in a medical student's day that no platform bothers to fix — but that quietly add up and hurt your preparation.
          </p>
          <p className="text-base text-sky/60 font-family-secondary leading-relaxed mb-8">
            We want to hear yours. However small or specific. Tell us the problem, and we'll try to solve it.
          </p>

          <div className="mb-10 flex flex-col gap-3">
            {examples.map((ex, i) => (
              <p key={i} className="text-sm text-sky/40 font-family-secondary italic">{ex}</p>
            ))}
          </div>
        </FadeInView>

        {status === 'success' ? (
          <FadeInView>
            <div className="rounded-2xl border border-teal/20 bg-teal/5 px-8 py-10 text-center">
              <p className="text-xl font-bold text-cream mb-2">Got it. Thank you.</p>
              <p className="text-sm text-sky/50 font-family-secondary">We'll read every submission carefully.</p>
            </div>
          </FadeInView>
        ) : (
          <FadeInView delay={0.1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary"
              />
              <select
                value={form.stage}
                onChange={e => set('stage', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-sm focus:outline-none focus:border-teal/40 font-family-secondary appearance-none"
                style={{ color: form.stage ? 'var(--color-cream)' : 'color-mix(in srgb, var(--color-sky) 30%, transparent)' }}
              >
                <option value="" disabled>Your stage</option>
                {stages.map(s => <option key={s} value={s} style={{ color: 'var(--color-cream)', background: 'var(--color-dark)' }}>{s}</option>)}
              </select>
              <textarea
                placeholder="The problem you face"
                value={form.problem}
                onChange={e => set('problem', e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary resize-none"
              />
              <textarea
                placeholder="How it affects your studying or prep (optional)"
                value={form.impact}
                onChange={e => set('impact', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary resize-none"
              />
              <input
                type="email"
                placeholder="Email — so we can follow up (optional)"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary"
              />
              {status === 'error' && <p className="text-sm text-terracotta font-family-secondary">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Send it to us'}
              </button>
            </form>
          </FadeInView>
        )}
      </div>
    </section>
  )
}
