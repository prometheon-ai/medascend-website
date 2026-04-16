import { motion } from 'framer-motion'
import { CalendarClock, Database, ListFilter, Gauge, Award, History, Timer, SlidersHorizontal, NotebookPen, Repeat2, Bookmark, AlertCircle } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const practiceItems = [
  { icon: CalendarClock, label: 'Daily 10Q' },
  { icon: Database, label: 'QBank' },
  { icon: ListFilter, label: 'Topic-Wise Quiz' },
  { icon: Gauge, label: 'Mini Mock' },
  { icon: Award, label: 'Grand Mock' },
  { icon: History, label: 'PYQ Mode' },
  { icon: Timer, label: 'Timed Mode' },
  { icon: SlidersHorizontal, label: 'Custom Quiz' },
]

const errorFeatures = [
  { icon: NotebookPen, title: 'Error Logbook', desc: 'Every wrong answer automatically captured.' },
  { icon: Repeat2, title: 'Smart Retry Mode', desc: 'Questions return strategically until mastered 3 times.' },
  { icon: Bookmark, title: 'Bookmarked MCQs', desc: 'Build your personal high-yield collection.' },
]

export default function PracticeZone() {
  return (
    <section id="practice" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <FadeInView direction="left" className="order-2 lg:order-1 flex justify-center">
            <motion.div
              className="phone-frame w-[260px] sm:w-[280px]"
              whileHover={{ y: -8, rotateY: -5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <img src="/stitch/practice_zone_graphic/screen.png" alt="Practice Zone" className="w-full" loading="lazy" />
            </motion.div>
          </FadeInView>
          <div className="order-1 lg:order-2">
            <FadeInView>
              <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">PRACTICE ZONE</span>
            </FadeInView>
            <AnimatedText
              text="Precision Training"
              mode="word"
              stagger={0.1}
              className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
              as="h2"
            />
            <FadeInView delay={0.3}>
              <p className="font-[family-name:var(--font-family-secondary)] text-base mb-8 text-sky/70">
                Every practice scenario, covered. From daily micro-challenges to full-length NEET-PG simulations.
              </p>
            </FadeInView>
            <div className="grid grid-cols-2 gap-3">
              {practiceItems.map((item, i) => (
                <FadeInView key={i} delay={0.4 + i * 0.08} direction="right" className="flex">
                  <motion.div
                    className="glow-card flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-dark-surface/50 border border-teal/10 flex-1"
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <item.icon size={18} className="text-teal shrink-0" />
                    <span className="text-sm font-semibold text-cream/90">{item.label}</span>
                  </motion.div>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>

        {/* Error System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeInView>
              <div className="flex items-center gap-2 mb-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <AlertCircle size={20} className="text-terracotta" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-cream">Your Personal Error System</h3>
              </div>
              <p className="font-[family-name:var(--font-family-secondary)] text-sm mb-6 text-sky/60">
                Every mistake becomes your roadmap. Systematic weakness elimination.
              </p>
            </FadeInView>
            <div className="space-y-4">
              {errorFeatures.map((f, i) => (
                <FadeInView key={i} delay={i * 0.15} direction="left" className="flex">
                  <motion.div
                    className="glow-card flex items-start gap-4 p-5 rounded-xl transition-all duration-300 bg-dark-surface/50 border border-teal/10 flex-1"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-terracotta/15"
                      whileHover={{ rotate: [0, -15, 15, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <f.icon size={20} className="text-terracotta" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-[15px] mb-0.5 text-cream">{f.title}</h4>
                      <p className="text-sm font-[family-name:var(--font-family-secondary)] text-sky/60">{f.desc}</p>
                    </div>
                  </motion.div>
                </FadeInView>
              ))}
            </div>
          </div>
          <FadeInView direction="right" delay={0.2}>
            <div className="flex justify-center">
              <motion.div
                className="phone-frame w-[260px] sm:w-[280px]"
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <img src="/stitch/error_system_graphic/screen.png" alt="Error System" className="w-full" loading="lazy" />
              </motion.div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
