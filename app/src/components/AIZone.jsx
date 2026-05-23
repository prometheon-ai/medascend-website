import { motion } from 'framer-motion'
import { MessageCircle, Users, Camera, FileText, FileQuestion, Layers, Lightbulb, UserRound, Headphones, ShieldCheck, CheckCircle } from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const aiTools = [
  { icon: MessageCircle, label: 'AI Chat Tutor' },
  { icon: Users, label: '19 Subject Bots' },
  { icon: Camera, label: 'Snap & Ask' },
  { icon: FileText, label: 'Content Summarizer' },
  { icon: FileQuestion, label: 'MCQ Generator' },
  { icon: Layers, label: 'Flashcard Generator' },
  { icon: Lightbulb, label: 'Mnemonic Creator' },
  { icon: UserRound, label: 'Patient Simulator' },
  { icon: Headphones, label: 'Audio Overview' },
]

export default function AIZone() {
  return (
    <section id="ai-zone" className="py-24 lg:py-32 bg-dark-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeInView>
              <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">AI ZONE</span>
            </FadeInView>
            <AnimatedText
              text="Context That Generic AI Cannot Touch"
              mode="word"
              stagger={0.06}
              className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
              as="h2"
            />
            <FadeInView delay={0.3}>
              <p className="font-[family-name:var(--font-family-secondary)] text-base mb-8 text-sky">
                ChatGPT hallucinates. It invents facts. MedAscend's AI is different — responses shaped by actual subject context, not probabilistic guessing.
              </p>
            </FadeInView>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {aiTools.map((t, i) => (
                <FadeInView key={i} delay={0.4 + i * 0.06} className="flex">
                  <motion.div
                    className="glow-card flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-default bg-dark-surface/50 border border-teal/10 flex-1"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                      <t.icon size={16} className="text-teal shrink-0" />
                    </motion.div>
                    <span className="text-[13px] font-semibold text-cream/80">{t.label}</span>
                  </motion.div>
                </FadeInView>
              ))}
            </div>

            <FadeInView delay={1}>
              <div className="flex flex-wrap gap-3">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-teal/10 text-teal-light"
                  whileHover={{ scale: 1.05 }}
                >
                  <ShieldCheck size={16} /> Bounded Expertise
                </motion.div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-teal/10 text-teal-light"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle size={16} /> Verified Responses
                </motion.div>
              </div>
            </FadeInView>
          </div>

          <FadeInView direction="right" delay={0.3}>
            <div className="flex justify-center">
              <motion.div
                className="phone-frame w-[260px] sm:w-[280px]"
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <img src="/stitch/ai_zone_graphic/screen.png" alt="AI Zone" className="w-full" loading="lazy" />
              </motion.div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
