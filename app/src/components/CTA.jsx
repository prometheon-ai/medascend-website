import { Bell } from 'lucide-react'
import Logo from './Logo'

export default function CTA({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="cta" className={`py-24 lg:py-32 ${d ? 'bg-dark' : 'bg-cream'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-24 text-center
          ${d ? 'bg-dark-surface border border-teal/12' : 'bg-gradient-to-br from-[#1a2e38] to-[#0f1a1f]'}`}>

          {/* BG orbs */}
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-teal/10 -top-40 -right-40" />
          <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-terracotta/8 -bottom-32 -left-32" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <Logo size={72} />
            </div>
            <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.1] text-cream mb-3">
              Your Ascent Starts Here.
            </h2>
            <p className="text-xl font-semibold text-gold-light mb-4">
              Study Smart. Practice Hard. Ascend Higher.
            </p>
            <p className="text-base text-sky/60 max-w-lg mx-auto mb-10 font-[family-name:var(--font-family-secondary)]">
              MedAscend is currently under development. Be among the first to experience the future of medical education.
            </p>
            <a href="#" className="inline-flex items-center gap-2.5 px-10 py-4 bg-teal text-cream font-bold text-base rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/30 transition-all duration-300">
              <Bell size={20} /> Notify Me at Launch
            </a>
            <p className="mt-8 text-xs text-sky/40 font-[family-name:var(--font-family-secondary)]">
              A product of <span className="font-semibold text-sky/60">Prometheon Applied Intelligence Pvt. Ltd.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
