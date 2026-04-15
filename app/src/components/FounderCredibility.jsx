import { motion } from 'framer-motion'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

export default function FounderCredibility() {
  return (
    <section className="py-32 lg:py-40 bg-[#0a1218] overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center relative">
        {/* Decorative quote mark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-teal/10 text-[200px] font-serif leading-none pointer-events-none select-none">
          "
        </div>

        {/* Gradient line */}
        <motion.div
          className="h-[2px] mx-auto mb-12 bg-gradient-to-r from-teal via-gold to-terracotta"
          initial={{ width: 0 }}
          whileInView={{ width: '40%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Quote — word by word */}
        <AnimatedText
          text="I built MedAscend because I was tired of platforms that treated me like a passive consumer. Tired of watching videos at 2x speed and retaining nothing. Tired of asking ChatGPT questions and cross-checking every answer because I couldn't trust it."
          mode="word"
          stagger={0.03}
          className="text-[clamp(16px,2.2vw,24px)] text-cream/90 leading-relaxed font-medium mb-10"
          as="blockquote"
        />

        {/* Attribution */}
        <FadeInView delay={1.5}>
          <div>
            <p className="text-cream font-bold text-lg">Vedant Shinde</p>
            <p className="text-sky/50 text-sm font-[family-name:var(--font-family-secondary)]">
              3rd Year MBBS, Seth GS Medical College & KEM Hospital
            </p>
            <p className="text-sky/30 text-xs mt-3 font-[family-name:var(--font-family-secondary)]">
              A product of Prometheon Applied Intelligence Pvt. Ltd.
            </p>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
