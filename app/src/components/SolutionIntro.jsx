import { motion } from 'framer-motion'
import { Brain, Bot, GraduationCap, Zap, GitBranch, Clapperboard, BarChart3 } from 'lucide-react'
import FadeInView from './animations/FadeInView'

const solutions = [
  { text: 'AI notes from any textbook in seconds', icon: Zap },
  { text: 'Visual flowcharts that draw themselves', icon: GitBranch },
  { text: '60-sec Reels that teach Pathology while you eat', icon: Clapperboard },
  { text: 'Spaced repetition that knows what you\'ll forget', icon: Brain },
  { text: '19 subjects. Every high-yield topic mapped.', icon: BarChart3 },
]

const pillars = [
  { icon: Brain, title: 'Active Recall at Every Stage', desc: 'No passive consumption. Every interaction builds retention.', color: 'text-teal' },
  { icon: Bot, title: 'AI That Actually Knows Medicine', desc: '19 subject-specific bots with bounded, verified expertise.', color: 'text-gold' },
  { icon: GraduationCap, title: 'Built by Someone Taking the Same Exams', desc: 'Not a corporate product team. A medical student who gets it.', color: 'text-terracotta' },
]

export default function SolutionIntro() {
  return (
    <section className="relative py-32 lg:py-40 bg-dark-card overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* MedAscend heading */}
        <FadeInView>
          <span className="text-[clamp(40px,7vw,72px)] font-extrabold tracking-tight leading-none text-gradient inline-block mb-4">
            MedAscend
          </span>
          <p className="text-base md:text-lg text-sky/60 max-w-2xl mx-auto mb-12 font-[family-name:var(--font-family-secondary)] leading-relaxed">
            One platform. Complete comprehension.
            <br />
            <span className="text-cream/80 font-semibold">Reduce learning time. Enhance focus. Maximize retention.</span>
          </p>
        </FadeInView>

        {/* Five solution points */}
        <div className="flex flex-col items-center gap-3 mb-16">
          {solutions.map((s, i) => (
            <FadeInView key={i} delay={0.1 + i * 0.12} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div
                className="glow-card inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-teal/15 bg-dark-surface/50 backdrop-blur-sm"
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <s.icon size={18} className="text-teal shrink-0" />
                <span className="text-sm md:text-base font-medium text-cream/90">{s.text}</span>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        {/* Gradient line */}
        <motion.div
          className="h-[2px] mx-auto mb-14 bg-gradient-to-r from-transparent via-teal to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: '60%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <FadeInView key={i} delay={i * 0.15}>
              <div className="glow-card p-7 rounded-2xl bg-dark-surface/60 backdrop-blur-xl border border-teal/10 transition-all duration-300 h-full hover:-translate-y-1">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${p.color === 'text-teal' ? 'bg-teal/15' : p.color === 'text-gold' ? 'bg-gold/15' : 'bg-terracotta/15'}`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <p.icon size={22} className={p.color} />
                </motion.div>
                <h3 className="text-lg font-bold text-cream mb-2">{p.title}</h3>
                <p className="text-sm text-sky/50 font-[family-name:var(--font-family-secondary)] leading-relaxed">{p.desc}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
