import { ArrowRight } from 'lucide-react'
import FadeInView from './animations/FadeInView'

const comparisons = [
  { old: '2hr+ video lectures', new: '10-min structured content' },
  { old: 'Minimal retention from passive watching', new: 'Active recall at every stage' },
  { old: '5+ scattered platforms', new: 'One unified ecosystem' },
  { old: 'Generic AI that hallucinates', new: '19 subject-specific bounded AI tutors' },
  { old: 'Repeating the same mistakes', new: 'Error Logbook + Smart Retry' },
  { old: 'No exam pattern knowledge', new: 'Real PYQ data-driven analysis' },
]

export default function Differentiators() {
  return (
    <section className="py-24 lg:py-32 bg-dark">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              EVERY PAIN POINT. ANSWERED.
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight">
              Not feature creep.{' '}
              <span className="text-gradient">Comprehensive design.</span>
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((c, i) => (
            <FadeInView key={i} delay={i * 0.1}>
              <div className="glow-card p-6 rounded-2xl bg-dark-surface/50 border border-teal/8 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-terracotta/70 line-through text-sm mb-2 font-[family-name:var(--font-family-secondary)]">
                      {c.old}
                    </p>
                    <div className="flex items-center gap-2">
                      <ArrowRight size={14} className="text-teal shrink-0" />
                      <p className="text-cream font-semibold text-sm">{c.new}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
