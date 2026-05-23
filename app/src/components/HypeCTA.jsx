import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FadeInView from './animations/FadeInView'

export default function HypeCTA() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-dark py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-125 h-125 rounded-full blur-[160px] bg-teal/10 -top-40 -right-40 animate-orb" />
        <div className="absolute w-100 h-100 rounded-full blur-[120px] bg-gold/6 -bottom-32 -left-32 animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl w-full">
        <motion.p
          className="text-[clamp(28px,4vw,48px)] font-extrabold text-cream leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          MedAscend is in active development.<br />
          <span className="text-gradient">Be among the first to use it.</span>
        </motion.p>

        <FadeInView delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/help"
              className="px-10 py-4 bg-teal text-cream font-bold text-base rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/30 transition-all duration-200 no-underline"
            >
              Tell Us Your Problem
            </Link>
            <Link
              to="/join"
              className="px-10 py-4 border border-teal/30 text-cream/85 font-bold text-base rounded-2xl hover:border-teal/60 hover:text-cream transition-all duration-200 no-underline"
            >
              Join Us
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
