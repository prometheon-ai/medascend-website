import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import FadeInView from './animations/FadeInView'

const stats = [
  { value: 19, suffix: '', label: 'Subjects Covered' },
  { value: 20, suffix: '+', label: 'Modules' },
  { value: 10, suffix: '+', label: 'AI Tools' },
  { value: 15, suffix: '+', label: 'Practice Modes' },
  { value: 5, suffix: '', label: 'Study Modes' },
]

function Counter({ target, suffix, duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return (
    <span ref={ref} className="text-[clamp(36px,6vw,64px)] font-extrabold text-gradient tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <section className="py-20 lg:py-28 bg-[#0a1218]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              BY THE NUMBERS
            </span>
            <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold text-cream">
              Built to cover everything.
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {stats.map((s, i) => (
            <FadeInView key={i} delay={i * 0.1} className="flex">
              <div className="text-center w-full py-6 md:py-8 rounded-2xl border border-teal/10 bg-dark-surface/30">
                <Counter target={s.value} suffix={s.suffix} />
                <p className="text-xs md:text-sm text-sky/50 mt-2 font-[family-name:var(--font-family-secondary)]">{s.label}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
