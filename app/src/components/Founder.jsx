import { Quote, User } from 'lucide-react'

export default function Founder({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="founder" className={`py-24 lg:py-32 ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className={`relative p-10 md:p-14 rounded-3xl
          ${d ? 'bg-dark-surface/60 border border-teal/12' : 'bg-white border border-teal/8 shadow-md'}`}>

          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${d ? 'bg-teal/10' : 'bg-teal/8'}`}>
            <Quote size={22} className="text-teal" />
          </div>

          <blockquote className={`text-lg md:text-xl font-medium leading-relaxed italic mb-8
            ${d ? 'text-cream/90' : 'text-dark/85'}`}>
            I built MedAscend because I was tired of platforms that treated me like a passive consumer.
            Tired of watching videos at 2x speed and retaining nothing.
            Tired of asking ChatGPT questions and cross-checking every answer because I couldn't trust it.
          </blockquote>

          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
              ${d ? 'bg-teal/15' : 'bg-teal/10'}`}>
              <User size={22} className="text-teal" />
            </div>
            <div>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>Vedant Shinde</span>
              <span className={`block text-xs font-[family-name:var(--font-family-secondary)] ${d ? 'text-stone' : 'text-stone'}`}>
                3rd Year MBBS, Seth GS Medical College & KEM Hospital
              </span>
            </div>
          </div>

          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[80px] opacity-10"
            style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-gold))' }} />
        </div>
      </div>
    </section>
  )
}
