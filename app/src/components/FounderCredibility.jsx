import { motion } from 'framer-motion'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

export default function FounderCredibility() {
  return (
    <section className="py-32 lg:py-40 bg-dark overflow-hidden">
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
          text="I'm Vedant, a 3rd year MBBS student at Seth GS Medical College & KEM Hospital. I started building MedAscend because I was tired of juggling multiple apps, watching lectures I forgot a week later, and not trusting the answers I found online. I'm building the platform I wished I had, from inside the same course you're in. Every feature here exists because I needed it."
          mode="word"
          stagger={0.03}
          className="text-[clamp(16px,2.2vw,24px)] text-cream/90 leading-relaxed font-medium mb-10"
          as="blockquote"
        />

        {/* Attribution */}
        <FadeInView delay={1.5}>
          <div>
            <p className="text-cream font-bold text-lg">Vedant Shinde</p>
            <p className="text-sky/75 text-sm font-family-secondary">
              Founder · 3rd Year MBBS, Seth GS Medical College & KEM Hospital
            </p>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
