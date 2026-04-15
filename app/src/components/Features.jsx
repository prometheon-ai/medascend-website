import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Target, Cpu, Layers, Library, CalendarCheck, ArrowRight } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const features = [
  { icon: BookOpen, title: 'Study Hub', desc: 'Five integrated modes flowing from one source. Content that respects your time.', to: '/features/study-hub', color: 'bg-teal', primary: true },
  { icon: Target, title: 'Practice Zone', desc: 'Every practice scenario covered. Personalized daily questions, full mock tests, and custom quizzes.', to: '/features/practice-zone', color: 'bg-gold' },
  { icon: Cpu, title: 'AI Zone', desc: 'Context that generic AI cannot touch. 19 subject-specific chatbots with bounded expertise.', to: '/features/ai-zone', color: 'bg-terracotta' },
  { icon: Layers, title: 'Flashcard System', desc: 'SM2 spaced repetition. Chapter-wise decks. Daily review queues with streak tracking.', color: 'bg-sky' },
  { icon: Library, title: 'Library', desc: 'PDFs, YouTube, web articles, personal notes — unified, searchable, annotatable.', color: 'bg-stone' },
  { icon: CalendarCheck, title: 'Diary & Planner', desc: 'Log progress. Schedule revision blocks. From overwhelming syllabus to manageable daily missions.', color: 'bg-gold' },
]

export default function Features({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="features" className={`py-24 lg:py-32 ${d ? 'bg-dark' : 'bg-cream'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeInView>
            <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>
              THE MEDASCEND DIFFERENCE
            </span>
          </FadeInView>
          <AnimatedText
            text="Every feature exists because a medical student needed it."
            mode="word"
            stagger={0.04}
            className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 ${d ? 'text-cream' : 'text-dark'}`}
            as="h2"
          />
          <FadeInView delay={0.4}>
            <p className={`font-[family-name:var(--font-family-secondary)] text-base ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>
              No speculation. No corporate product teams guessing. Just relentless iteration by someone taking the same exams you are.
            </p>
          </FadeInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeInView key={i} delay={i * 0.1}>
              <div className={`glow-card group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1
                ${f.primary
                  ? `${d ? 'bg-teal/15 border-2 border-teal/25' : 'bg-teal/8 border-2 border-teal/15'}`
                  : `${d ? 'bg-dark-surface/50 border border-teal/8' : 'bg-white border border-teal/6 shadow-sm'}`
                } hover:shadow-lg`}>
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${d ? `${f.color}/15` : `${f.color}/10`}`}
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <f.icon size={22} className={f.color === 'bg-teal' ? 'text-teal' : f.color === 'bg-gold' ? 'text-gold' : f.color === 'bg-terracotta' ? 'text-terracotta' : f.color === 'bg-sky' ? 'text-sky' : 'text-stone'} />
                </motion.div>
                <h3 className={`text-lg font-bold mb-2 ${d ? 'text-cream' : 'text-dark'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>{f.desc}</p>
                {f.to && (
                  <Link to={f.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal group-hover:gap-2.5 transition-all duration-300">
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
