import { motion } from 'framer-motion'
import Logo from './Logo'

export default function CinematicHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Teal orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-125 h-125 rounded-full blur-[160px] bg-teal/12 top-[10%] right-[-10%]" />
        <div className="absolute w-100 h-100 rounded-full blur-[120px] bg-gold/6 bottom-[20%] left-[-5%]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl w-full">
        <div className="flex justify-center mb-5">
          <Logo size={60} />
        </div>
        <span className="text-[clamp(52px,10vw,96px)] font-extrabold tracking-tight leading-none text-gradient inline-block">
          MedAscend
        </span>
        <p className="text-[clamp(12px,1.8vw,18px)] font-semibold tracking-[8px] uppercase text-teal-light mt-4 mb-3">
          THE MEDICAL EDUCATION REVOLUTION
        </p>
        <p className="text-lg text-cream/80 font-medium mt-2">
          Built by a Medical Student. <span className="text-gradient">For Medical Students.</span>
        </p>

        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-px h-10 bg-linear-to-b from-teal-light to-transparent animate-scroll-line" />
          <span className="text-[10px] tracking-[3px] uppercase text-stone/50">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  )
}
