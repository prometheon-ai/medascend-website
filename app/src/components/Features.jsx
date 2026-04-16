import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Target, Cpu, Layers, Library, CalendarCheck, ArrowRight } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const features = [
  { icon: BookOpen, title: 'Study Hub', desc: 'Five integrated modes flowing from one source. Content that respects your time.', to: '/features/study-hub', color: 'text-teal', bg: 'bg-teal/15' },
  { icon: Target, title: 'Practice Zone', desc: 'Every practice scenario covered. Personalized daily questions, full mock tests, and custom quizzes.', to: '/features/practice-zone', color: 'text-gold', bg: 'bg-gold/15' },
  { icon: Cpu, title: 'AI Zone', desc: 'Context that generic AI cannot touch. 19 subject-specific chatbots with bounded expertise.', to: '/features/ai-zone', color: 'text-terracotta', bg: 'bg-terracotta/15' },
  { icon: Layers, title: 'Flashcard System', desc: 'SM2 spaced repetition. Chapter-wise decks. Daily review queues with streak tracking.', color: 'text-sky', bg: 'bg-sky/15' },
  { icon: Library, title: 'Library', desc: 'PDFs, YouTube, web articles, personal notes — unified, searchable, annotatable.', color: 'text-stone', bg: 'bg-stone/15' },
  { icon: CalendarCheck, title: 'Diary & Planner', desc: 'Log progress. Schedule revision blocks. From overwhelming syllabus to manageable daily missions.', color: 'text-gold', bg: 'bg-gold/15' },
]

export default function Features({ theme }) {
  return (
    <section id="features" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeInView>
            <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">
              THE MEDASCEND DIFFERENCE
            </span>
          </FadeInView>
          <AnimatedText
            text="Every feature exists because a medical student needed it."
            mode="word"
            stagger={0.04}
            className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
            as="h2"
          />
          <FadeInView delay={0.4}>
            <p className="font-[family-name:var(--font-family-secondary)] text-base text-sky/60">
              No speculation. No corporate product teams guessing. Just relentless iteration by someone taking the same exams you are.
            </p>
          </FadeInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeInView key={i} delay={i * 0.1} className="flex">
              <div className="glow-card group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-dark-surface/50 border border-teal/10 flex flex-col w-full">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bg}`}
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <f.icon size={22} className={f.color} />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-cream">{f.title}</h3>
                <p className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-family-secondary)] text-sky/60 flex-1">{f.desc}</p>
                {f.to && (
                  <Link to={f.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal group-hover:gap-2.5 transition-all duration-300 mt-auto">
                    Learn more <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
