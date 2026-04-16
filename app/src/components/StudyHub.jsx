import { motion } from 'framer-motion'
import { BookOpenText, Zap, Flame, TrendingUp, CheckSquare, Sparkles, Bone, Pill, Stethoscope, PlusCircle } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const modes = [
  { icon: BookOpenText, title: 'Deep Learn Mode', desc: 'Visual, structured, mnemonic-rich. No fluff.', color: 'bg-teal/15 text-teal' },
  { icon: Zap, title: 'Revise Mode', desc: 'Same information, compressed for speed. Zero information loss.', color: 'bg-gold/15 text-gold' },
  { icon: Flame, title: 'Memory Forge', desc: 'Active recall — fill blanks, expand mnemonics, spot errors.', color: 'bg-terracotta/15 text-terracotta' },
  { icon: TrendingUp, title: 'Exam Pattern Intelligence', desc: 'Real PYQ analysis showing what gets asked and where traps hide.', color: 'bg-sky/20 text-teal-light' },
  { icon: CheckSquare, title: 'Practice MCQs', desc: 'Questions born directly from your Deep Learn content.', color: 'bg-stone/15 text-stone' },
]

const hytCards = [
  { icon: Bone, title: 'Anatomy', desc: 'Origin-insertion tables, muscle compartments, neurovascular relations' },
  { icon: Pill, title: 'Pharmacology', desc: 'Drug classifications with memory hooks' },
  { icon: Stethoscope, title: 'Medicine', desc: 'Syndromes and diagnostic criteria at a glance' },
  { icon: PlusCircle, title: '+ 16 More', desc: 'Every subject gets its own specialized toolkit' },
]

export default function StudyHub() {
  return (
    <section id="study-hub" className="py-24 lg:py-32 bg-dark-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <FadeInView>
              <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">STUDY HUB</span>
            </FadeInView>
            <AnimatedText
              text="Content That Respects Your Time"
              mode="word"
              stagger={0.06}
              className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
              as="h2"
            />
            <FadeInView delay={0.3}>
              <p className="font-[family-name:var(--font-family-secondary)] text-base mb-8 text-sky/70">
                Five integrated modes flowing from one source: Deep Learn — our core content architecture designed for actual retention.
              </p>
            </FadeInView>
            <div className="space-y-3">
              {modes.map((m, i) => (
                <FadeInView key={i} delay={0.4 + i * 0.1} direction="left">
                  <motion.div
                    className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-dark-surface/60"
                    whileHover={{ x: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${m.color.split(' ')[0]}`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <m.icon size={20} className={m.color.split(' ')[1]} />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-[15px] mb-0.5 text-cream">{m.title}</h4>
                      <p className="text-sm font-[family-name:var(--font-family-secondary)] text-sky/60">{m.desc}</p>
                    </div>
                  </motion.div>
                </FadeInView>
              ))}
            </div>
          </div>
          <FadeInView direction="right" delay={0.3}>
            <div className="flex justify-center">
              <motion.div
                className="phone-frame w-[260px] sm:w-[280px]"
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <img src="/stitch/study_hub_modes_graphic/screen.png" alt="Study Hub Modes" className="w-full" loading="lazy" />
              </motion.div>
            </div>
          </FadeInView>
        </div>

        {/* High Yield Tools */}
        <FadeInView>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Sparkles size={20} className="text-gold" />
              </motion.div>
              <h3 className="text-2xl font-extrabold text-cream">High Yield Tools</h3>
            </div>
            <p className="font-[family-name:var(--font-family-secondary)] text-sm text-sky/60">
              Subject-specific compilations and tricks crafted for each of the 19 subjects.
            </p>
          </div>
        </FadeInView>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hytCards.map((c, i) => (
            <FadeInView key={i} delay={i * 0.12} className="flex">
              <motion.div
                className="glow-card p-6 rounded-2xl text-center transition-all duration-300 bg-dark-surface/50 border border-teal/10 flex flex-col h-full"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <c.icon size={28} className="text-gold mx-auto mb-3" />
                </motion.div>
                <h4 className="font-bold text-[15px] mb-1 text-cream">{c.title}</h4>
                <p className="text-xs font-[family-name:var(--font-family-secondary)] text-sky/50">{c.desc}</p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
