import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeInView from './animations/FadeInView'

const problems = [
  { text: 'Tired of', highlight: '2-hour lectures', rest: 'that could\'ve been 10 minutes?' },
  { text: 'Tired of', highlight: 'forgetting everything', rest: 'you just watched?' },
  { text: 'Tired of juggling', highlight: '5+ platforms', rest: 'for one exam?' },
  { text: 'Tired of', highlight: 'AI that hallucinates', rest: 'medical facts?' },
]

const stats = [
  { value: '2hrs+', label: 'Average Lecture' },
  { value: 'Minimal', label: 'Retention' },
  { value: '5+', label: 'Scattered Platforms' },
]

export default function ProblemReveal() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={sectionRef} className="relative bg-[#0a1218]" style={{ height: `${(problems.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 max-w-4xl w-full">
          {/* Problem statements */}
          {problems.map((p, i) => {
            const segmentSize = 1 / (problems.length + 1)
            const start = i * segmentSize
            const fadeIn = start
            const holdStart = start + segmentSize * 0.15
            const holdEnd = start + segmentSize * 0.85
            const fadeOut = start + segmentSize

            return (
              <ProblemLine
                key={i}
                problem={p}
                scrollProgress={scrollYProgress}
                range={[fadeIn, holdStart, holdEnd, fadeOut]}
              />
            )
          })}

          {/* Stats bar — shows at the end */}
          <StatsBar scrollProgress={scrollYProgress} problems={problems} />
        </div>
      </div>
    </section>
  )
}

function ProblemLine({ problem, scrollProgress, range }) {
  const opacity = useTransform(scrollProgress, range, [0, 1, 1, 0])
  const y = useTransform(scrollProgress, range, [30, 0, 0, -20])

  return (
    <motion.p
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y }}
    >
      <span className="text-[clamp(24px,5vw,52px)] font-extrabold text-cream leading-tight text-center max-w-4xl">
        {problem.text}{' '}
        <span className="text-gradient">{problem.highlight}</span>{' '}
        {problem.rest}
      </span>
    </motion.p>
  )
}

function StatsBar({ scrollProgress, problems }) {
  const segmentSize = 1 / (problems.length + 1)
  const statsStart = problems.length * segmentSize
  const opacity = useTransform(scrollProgress, [statsStart, statsStart + segmentSize * 0.3], [0, 1])
  const y = useTransform(scrollProgress, [statsStart, statsStart + segmentSize * 0.3], [40, 0])

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-10"
      style={{ opacity, y }}
    >
      <div className="flex flex-wrap justify-center gap-12 md:gap-20">
        {stats.map((s, i) => (
          <FadeInView key={i} delay={i * 0.15}>
            <div className="text-center">
              <span className="block text-[clamp(32px,5vw,48px)] font-extrabold text-gold-light">{s.value}</span>
              <span className="block text-sm text-sky/60 mt-1 font-[family-name:var(--font-family-secondary)]">{s.label}</span>
            </div>
          </FadeInView>
        ))}
      </div>
      <p className="text-lg text-sky/60 italic border-l-2 border-teal/30 pl-4 max-w-lg font-[family-name:var(--font-family-secondary)]">
        "I'm a 3rd year MBBS student at KEM Hospital. I've lived what you're living."
      </p>
    </motion.div>
  )
}
