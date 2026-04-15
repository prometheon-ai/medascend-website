import { motion } from 'framer-motion'
import { Brain, Bot, GraduationCap } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const pillars = [
  { icon: Brain, title: 'Active Recall at Every Stage', desc: 'No passive consumption. Every interaction builds retention.', color: 'text-teal' },
  { icon: Bot, title: 'AI That Actually Knows Medicine', desc: '19 subject-specific bots with bounded, verified expertise.', color: 'text-gold' },
  { icon: GraduationCap, title: 'Built by Someone Taking the Same Exams', desc: 'Not a corporate product team. A medical student who gets it.', color: 'text-terracotta' },
]

export default function SolutionIntro() {
  return (
    <section className="relative py-32 lg:py-40 bg-dark-card overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Main statement */}
        <motion.h2
          className="text-[clamp(28px,5.5vw,60px)] font-extrabold leading-tight mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {['MedAscend', 'is', 'the', 'way', 'forward.'].map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block ${i === 0 ? 'text-gradient' : 'text-cream'}`}
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h2>

        {/* Gradient line */}
        <motion.div
          className="h-[2px] mx-auto mb-8 bg-gradient-to-r from-transparent via-teal to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: '60%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Supporting text */}
        <FadeInView delay={0.5}>
          <p className="text-lg md:text-xl text-sky/60 max-w-2xl mx-auto mb-16 font-[family-name:var(--font-family-secondary)] leading-relaxed">
            One platform. Complete comprehension. No more passive video fatigue. No more scattered resources.
            <br />
            <span className="text-cream/80 font-medium">Reduce learning time. Enhance focus. Maximize retention.</span>
          </p>
        </FadeInView>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <FadeInView key={i} delay={0.8 + i * 0.15}>
              <div className="glow-card p-7 rounded-2xl bg-dark-surface/60 backdrop-blur-xl border border-teal/10 transition-all duration-300 h-full hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${p.color === 'text-teal' ? 'bg-teal/15' : p.color === 'text-gold' ? 'bg-gold/15' : 'bg-terracotta/15'}`}>
                  <p.icon size={22} className={p.color} />
                </div>
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
