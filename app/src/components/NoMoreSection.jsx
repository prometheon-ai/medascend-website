import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const problems = [
  'no more 2hr lectures',
  'no more scattered resources',
  'no more forgetting everything',
  'no more passive learning',
  'no more guessing exam patterns',
  'no more unverified AI answers',
  'no more repeating mistakes',
  'no more feeling behind',
]

export default function NoMoreSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30%' })
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (playing && !done) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [playing, done])

  useEffect(() => {
    if (isInView && !playing && !done) {
      setPlaying(true)
      setIndex(0)
    }
  }, [isInView, playing, done])

  useEffect(() => {
    if (!playing || done) return
    if (index >= problems.length) {
      const t = setTimeout(() => {
        setDone(true)
        setPlaying(false)
      }, 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setIndex(i => i + 1), 550)
    return () => clearTimeout(t)
  }, [playing, done, index])

  if (done) return null

  return (
    <section ref={ref} className="relative bg-[#0a1218] overflow-hidden" style={{ minHeight: '60vh' }}>
      <div className="flex items-center justify-center px-6" style={{ minHeight: '60vh' }}>
        <div className="h-[80px] md:h-[100px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {index < problems.length && (
              <motion.p
                key={index}
                className="text-[clamp(24px,5vw,52px)] font-extrabold text-terracotta/80 italic whitespace-nowrap"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60, filter: 'blur(4px)' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {problems[index]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
