import { motion } from 'framer-motion'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

export default function HypeCTA({ onEarlyAccess }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* BG orbs — bookends with hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[140px] bg-teal/10 -top-40 -right-40 animate-orb" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-terracotta/8 -bottom-32 -left-32 animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Education */}
        <motion.p
          className="text-[clamp(36px,7vw,80px)] font-extrabold text-cream leading-none mb-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Education
        </motion.p>

        {/* Redefined — slam in with spring */}
        <motion.p
          className="text-[clamp(36px,7vw,80px)] font-extrabold leading-none mb-8"
          initial={{ opacity: 0, scale: 1.15, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          <span className="text-gradient">Redefined.</span>
        </motion.p>

        {/* Gradient underline */}
        <motion.div
          className="h-[2px] mx-auto mb-10 bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: '50%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        {/* Stay Tuned — typewriter */}
        <AnimatedText
          text="Stay Tuned."
          mode="character"
          stagger={0.05}
          delay={1}
          className="text-2xl md:text-3xl font-bold text-gold-light mb-8"
          as="p"
        />

        {/* Subtext */}
        <FadeInView delay={1.4}>
          <p className="text-base text-sky/60 max-w-lg mx-auto mb-10 font-[family-name:var(--font-family-secondary)]">
            MedAscend is currently under development. Be among the first to experience the future of medical education.
          </p>
        </FadeInView>

        {/* CTA Button */}
        <FadeInView delay={1.6}>
          <button
            onClick={onEarlyAccess}
            className="pulse-ring inline-flex items-center gap-2.5 px-10 py-4 bg-teal text-cream font-bold text-base rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/30 transition-all duration-300 cursor-pointer border-none"
          >
            Notify Me at Launch
          </button>
        </FadeInView>

        {/* Tagline */}
        <FadeInView delay={1.8}>
          <p className="mt-10 text-sm text-sky/40 font-semibold tracking-wide">
            Study Smart. Practice Hard. Ascend Higher.
          </p>
        </FadeInView>
      </div>
    </section>
  )
}
