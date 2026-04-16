import { motion } from 'framer-motion'
import FadeInView from './animations/FadeInView'

const comparisons = [
  { problem: 'Resources scattered across 5+ platforms', solution: 'One unified ecosystem — study, practice, AI, all in one' },
  { problem: 'Passive 2hr video lectures', solution: '60-sec Reels + cinematic Animations Engine' },
  { problem: 'Generic AI that hallucinates medical facts', solution: '19 subject-specific AI bots with bounded expertise' },
  { problem: 'No idea what\'s high-yield for the exam', solution: 'NEET PG Exam Intelligence — PYQ-driven topic mapping' },
  { problem: 'Forgetting everything after revision', solution: 'Spaced repetition + Memory Forge active recall' },
  { problem: 'Can\'t study from your own material', solution: 'Knowledge Forge — upload anything, AI creates study tools' },
]

export default function Differentiators() {
  return (
    <section className="py-24 lg:py-32 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              EVERY PAIN POINT. ANSWERED.
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight">
              No platform provides everything.{' '}
              <span className="text-gradient">We do.</span>
            </h2>
          </div>
        </FadeInView>

        <FadeInView delay={0.2}>
          <div className="rounded-2xl border border-teal/10 overflow-hidden">
            <div className="grid grid-cols-2 bg-teal/10">
              <div className="px-6 md:px-8 py-5 text-sm md:text-base font-bold text-terracotta uppercase tracking-wider">
                What Frustrates You
              </div>
              <div className="px-6 md:px-8 py-5 text-sm md:text-base font-bold text-teal-light uppercase tracking-wider border-l border-teal/10">
                How MedAscend Solves It
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
                <div className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base text-cream/50 font-[family-name:var(--font-family-secondary)]">
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
