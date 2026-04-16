import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const problems = [
  { text: '500-page textbooks. Zero structured notes.', duration: 1400 },
  { text: 'Resources scattered across 5+ platforms.', duration: 1300 },
  { text: 'Handwritten notes that take longer than the lecture.', duration: 1200 },
  { text: 'Revised Pharmacology 3 times. Forgot it in 3 weeks.', duration: 1000 },
  { text: '19 subjects. No idea what\'s high-yield.', duration: 800 },
  { text: 'Studying 14 hours. Still feeling behind.', duration: 600 },
]

// ── Sound FX via Web Audio API ──
function createNoise(ctx, duration, volume) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  source.connect(gain).connect(ctx.destination)
  return source
}

function playWhoosh(ctx, intensity = 0.3) {
  // Low rumble
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(120 + intensity * 300, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1500 + intensity * 1000, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25)
  gain.gain.setValueAtTime(0.06 + intensity * 0.06, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
  osc.connect(filter).connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.3)
  // Noise layer
  const noise = createNoise(ctx, 0.15, 0.04 * intensity)
  noise.start()
}

function playBassImpact(ctx) {
  const t = ctx.currentTime
  // Deep sub bass
  const sub = ctx.createOscillator()
  const subGain = ctx.createGain()
  sub.type = 'sine'
  sub.frequency.setValueAtTime(55, t)
  sub.frequency.exponentialRampToValueAtTime(15, t + 1.2)
  subGain.gain.setValueAtTime(0.35, t)
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
  sub.connect(subGain).connect(ctx.destination)
  sub.start(t)
  sub.stop(t + 1.3)
  // Mid punch
  const mid = ctx.createOscillator()
  const midGain = ctx.createGain()
  mid.type = 'triangle'
  mid.frequency.setValueAtTime(180, t)
  mid.frequency.exponentialRampToValueAtTime(35, t + 0.5)
  midGain.gain.setValueAtTime(0.18, t)
  midGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
  mid.connect(midGain).connect(ctx.destination)
  mid.start(t)
  mid.stop(t + 0.7)
  // High shimmer
  const high = ctx.createOscillator()
  const highGain = ctx.createGain()
  const highFilter = ctx.createBiquadFilter()
  high.type = 'sine'
  high.frequency.setValueAtTime(800, t)
  high.frequency.exponentialRampToValueAtTime(200, t + 0.8)
  highFilter.type = 'bandpass'
  highFilter.frequency.setValueAtTime(600, t)
  highFilter.Q.setValueAtTime(2, t)
  highGain.gain.setValueAtTime(0.06, t)
  highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)
  high.connect(highFilter).connect(highGain).connect(ctx.destination)
  high.start(t)
  high.stop(t + 0.9)
  // Impact noise burst
  const noise = createNoise(ctx, 0.25, 0.18)
  noise.start(t)
  // Delayed reverb tail
  const tail = ctx.createOscillator()
  const tailGain = ctx.createGain()
  tail.type = 'sine'
  tail.frequency.setValueAtTime(40, t + 0.1)
  tail.frequency.exponentialRampToValueAtTime(20, t + 1.5)
  tailGain.gain.setValueAtTime(0.08, t + 0.1)
  tailGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
  tail.connect(tailGain).connect(ctx.destination)
  tail.start(t + 0.1)
  tail.stop(t + 1.6)
}

export default function CinematicHero() {
  const [phase, setPhase] = useState('waiting')
  const [problemIndex, setProblemIndex] = useState(0)
  const [shake, setShake] = useState(false)
  const [audioCtx, setAudioCtx] = useState(null)

  const startSequence = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    setAudioCtx(ctx)
    setPhase('pain')
    setProblemIndex(0)
  }, [])

  useEffect(() => {
    const t = setTimeout(startSequence, 500)
    return () => clearTimeout(t)
  }, [startSequence])

  // Phase 1: Pain — problems swapping
  useEffect(() => {
    if (phase !== 'pain' || !audioCtx) return
    if (problemIndex >= problems.length) {
      setPhase('break')
      return
    }
    const intensity = 0.2 + (problemIndex / problems.length) * 0.8
    playWhoosh(audioCtx, intensity)
    setShake(true)
    setTimeout(() => setShake(false), 120)

    const timer = setTimeout(() => setProblemIndex(i => i + 1), problems[problemIndex].duration)
    return () => clearTimeout(timer)
  }, [phase, problemIndex, audioCtx])

  // Phase 2: Break (1.5s silence)
  useEffect(() => {
    if (phase !== 'break') return
    const timer = setTimeout(() => {
      if (audioCtx) playBassImpact(audioCtx)
      setShake(true)
      setTimeout(() => setShake(false), 200)
      setPhase('reveal')
    }, 1500)
    return () => clearTimeout(timer)
  }, [phase, audioCtx])

  // Phase 3: Reveal → done
  useEffect(() => {
    if (phase !== 'reveal') return
    const timer = setTimeout(() => setPhase('done'), 2500)
    return () => clearTimeout(timer)
  }, [phase])

  const redIntensity = phase === 'pain' ? problemIndex / problems.length : 0

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-dark ${shake ? 'animate-shake' : ''}`}>
      {/* BG noise during pain */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: redIntensity * 0.15,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Red vignette during pain */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: redIntensity * 0.4,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(186,91,71,0.3) 100%)',
        }}
      />

      {/* Red progress bar */}
      {(phase === 'pain' || phase === 'break') && (
        <div
          className="absolute top-0 left-0 h-1 bg-terracotta transition-all duration-300"
          style={{ width: `${(problemIndex / problems.length) * 100}%` }}
        />
      )}

      {/* Teal orbs for reveal */}
      {(phase === 'reveal' || phase === 'done') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[160px] bg-teal/12 top-[10%] right-[-10%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-gold/6 bottom-[20%] left-[-5%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      )}

      <div className="relative z-10 text-center px-6 max-w-4xl w-full">
        {/* PAIN PHASE */}
        <AnimatePresence mode="wait">
          {phase === 'pain' && problemIndex < problems.length && (
            <motion.p
              key={`p-${problemIndex}`}
              className="text-[clamp(22px,4.5vw,44px)] font-extrabold leading-tight"
              initial={{ opacity: 0, y: 25, scale: 0.95, filter: 'blur(6px)' }}
              animate={{
                opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                color: `rgb(${220 - problemIndex * 8}, ${130 - problemIndex * 15}, ${100 - problemIndex * 8})`,
              }}
              exit={{ opacity: 0, y: -25, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {problems[problemIndex].text}
            </motion.p>
          )}
        </AnimatePresence>

        {/* BREAK PHASE — blinking cursor */}
        {phase === 'break' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="w-[2px] h-8 bg-cream/30 animate-pulse" />
          </motion.div>
        )}

        {/* REVEAL + DONE */}
        <AnimatePresence>
          {(phase === 'reveal' || phase === 'done') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, filter: 'blur(24px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 14 }}
            >
              <div className="flex justify-center mb-5">
                <Logo size={60} />
              </div>
              <span className="text-[clamp(52px,10vw,96px)] font-extrabold tracking-tight leading-none text-gradient inline-block">
                MedAscend
              </span>
              <motion.p
                className="text-[clamp(12px,1.8vw,18px)] font-semibold tracking-[8px] uppercase text-teal-light mt-4 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                THE MEDICAL EDUCATION REVOLUTION
              </motion.p>
              <motion.p
                className="text-lg text-cream/80 font-medium mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Built by a Medical Student. <span className="text-gradient">For NEET PG Aspirants.</span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        {phase === 'done' && (
          <motion.div
            className="mt-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-px h-10 bg-gradient-to-b from-teal-light to-transparent animate-scroll-line" />
            <span className="text-[10px] tracking-[3px] uppercase text-stone/50">Scroll to explore</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}
