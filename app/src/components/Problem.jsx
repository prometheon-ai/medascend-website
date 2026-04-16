import { Clock, Brain, Shuffle } from 'lucide-react'

export default function Problem() {
  const stats = [
    { icon: Clock, number: '2hrs+', label: 'Average video lecture length', color: 'text-teal' },
    { icon: Brain, number: 'Minimal', label: 'Retention from passive watching', color: 'text-gold' },
    { icon: Shuffle, number: 'Scattered', label: 'Resources across 5+ platforms', color: 'text-terracotta' },
  ]
  return (
    <section id="problem" className="py-24 lg:py-32 bg-dark-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">
              THE REALITY NO ONE TALKS ABOUT
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-6 text-cream">
              Existing platforms gave you content. <br/>
              What you needed was <span className="text-gradient">comprehension.</span>
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-family-secondary)] text-base leading-relaxed text-sky/70">
              <p>I'm a 3rd year MBBS student at Seth GS Medical College and KEM Hospital. I've lived what you're living.</p>
              <p>The endless scroll through video lectures that could've been ten minutes but stretch to two hours. The "comprehensive notes" that are just transcripts.</p>
              <p>They gave you hours of footage. What you needed was hours of your life back.</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-5 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-dark-surface/60 border border-teal/10 hover:border-teal/20">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-teal/10">
                  <s.icon size={24} className={s.color} />
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-cream">{s.number}</span>
                  <span className="text-sm text-stone">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
