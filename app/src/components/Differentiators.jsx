import { motion } from 'framer-motion'
import FadeInView from './animations/FadeInView'

const comparisons = [
  { problem: 'Resources scattered across multiple platforms', solution: 'One platform — learn, revise, practise, and ask in one place' },
  { problem: 'Long video lectures you don\'t retain', solution: 'Short reels and clear animations built for memory' },
  { problem: 'Generic AI that invents medical facts', solution: '19 subject-specialist tutors kept within their subject' },
  { problem: 'No idea what\'s high-yield for the exam', solution: 'Exam Intelligence — a decade of papers, decoded' },
  { problem: 'Forgetting weeks after revision', solution: 'Spaced repetition that brings concepts back at the right time' },
  { problem: 'Can\'t study from your own notes and books', solution: 'Knowledge Forge & My Notes — upload or write your own, understood in medical context' },
]

export default function Differentiators() {
  return (
    <section id="the-platform" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              EVERY PAIN POINT. ANSWERED.
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight">
              No platform covers all of it.{' '}
              <span className="text-gradient">MedAscend does.</span>
            </h2>
          </div>
        </FadeInView>

        <FadeInView delay={0.2}>
          <div className="rounded-2xl border border-teal/10 overflow-hidden">
            <div className="grid grid-cols-2 bg-teal/10">
              <div className="px-6 md:px-8 py-5 text-sm md:text-base font-bold text-terracotta uppercase tracking-wider">
                What slows you down
              </div>
              <div className="px-6 md:px-8 py-5 text-sm md:text-base font-bold text-teal-light uppercase tracking-wider border-l border-teal/10">
                What MedAscend does
              </div>
            </div>

            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                className={`grid grid-cols-2 ${i !== comparisons.length - 1 ? 'border-b border-teal/8' : ''} hover:bg-teal/5 transition-colors duration-200`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                <div className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base text-cream/85 font-[family-name:var(--font-family-secondary)]">
                  {c.problem}
                </div>
                <div className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base text-cream font-semibold border-l border-teal/8">
                  {c.solution}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
