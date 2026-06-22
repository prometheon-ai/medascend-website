import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const inputCls = 'w-full px-4 py-3 rounded-xl bg-dark-surface border border-teal/15 text-cream text-sm placeholder:text-sky/30 focus:outline-none focus:border-teal/40 font-family-secondary transition-colors duration-200'

export default function SupportPage() {
  const [supportText, setSupportText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Support — MedAscend</title>
        <meta name="description" content="Contact MedAscend support." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold text-cream leading-tight mb-4">Support</h1>
          <p className="text-base md:text-lg text-sky/80 font-family-secondary leading-relaxed mb-8">
            Share your issue or question below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 border border-teal/15 rounded-2xl p-6 bg-dark-surface/30">
            <input
              type="text"
              value={supportText}
              onChange={(e) => setSupportText(e.target.value)}
              placeholder="Type your message"
              required
              className={inputCls}
            />

            <button
              type="submit"
              className="w-full py-4 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none"
            >
              Submit
            </button>

            {submitted && (
              <p className="text-sm text-teal-light font-family-secondary">Submitted successfully.</p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
