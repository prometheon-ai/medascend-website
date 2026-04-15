import { motion } from 'framer-motion'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[160px] bg-teal/10 top-[10%] right-[-10%] animate-orb" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-terracotta/6 bottom-[20%] left-[-5%] animate-orb" style={{ animationDelay: '3s' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-gold/5 top-[50%] left-[40%] animate-orb" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(rgba(66,111,128,0.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Wordmark */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[clamp(56px,10vw,96px)] font-extrabold tracking-tight leading-none text-gradient">
            MedAscend
          </span>
        </motion.div>

        {/* Tagline — letter stagger */}
        <AnimatedText
          text="THE MEDICAL EDUCATION REVOLUTION"
          mode="word"
          stagger={0.1}
          delay={0.5}
          className="text-[clamp(11px,1.5vw,16px)] font-semibold tracking-[8px] uppercase text-teal-light mb-8"
          as="p"
        />

        {/* Subtitle */}
        <FadeInView delay={1.2}>
          <p className="text-[clamp(18px,2.5vw,28px)] font-bold text-cream/90 leading-snug">
            Built by a Medical Student.{' '}
            <span className="text-gradient">For NEET PG Aspirants.</span>
          </p>
        </FadeInView>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-teal-light to-transparent animate-scroll-line" />
        <span className="text-[10px] tracking-[3px] uppercase text-stone/50">Scroll to explore</span>
      </div>
    </section>
  )
}
