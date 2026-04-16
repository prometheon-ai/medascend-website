import { motion } from 'framer-motion'
import { Clapperboard, Trophy, Stethoscope, Sparkles, BookOpen, Brain } from 'lucide-react'
import FadeInView from './animations/FadeInView'

const upcoming = [
  { icon: Clapperboard, title: 'Reel Mode', desc: 'TikTok-style 60-sec concept reels. Swipe through entire subjects.' },
  { icon: Sparkles, title: 'Animations Engine', desc: 'Cinematic Kurzgesagt-style medical animations for every concept.' },
  { icon: Trophy, title: 'MedAscend Arena', desc: 'Live competitive quizzes with prizes. College battles. All-India challenges.' },
  { icon: Stethoscope, title: 'Clinical Posting Companion', desc: 'History proformas, case logger, cross-subject integration for postings.' },
  { icon: BookOpen, title: 'Knowledge Forge', desc: 'Upload any material — AI creates notes, flashcards, podcasts, quizzes from it.' },
  { icon: Brain, title: 'Exam Intelligence System', desc: '10 years of PYQ analysis. Topic weightage. Personalized strategy.' },
]

export default function RoadmapTeaser() {
  return (
    <section className="py-24 lg:py-32 bg-dark">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              COMING SOON
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight">
              We're just{' '}
              <span className="text-gradient">getting started.</span>
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.map((item, i) => (
            <FadeInView key={i} delay={i * 0.1} className="flex">
              <motion.div
                className="glow-card p-7 rounded-2xl bg-dark-surface/50 border border-teal/10 flex flex-col w-full"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                    <item.icon size={22} className="text-teal" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-cream mb-2">{item.title}</h3>
                <p className="text-sm text-sky/50 font-[family-name:var(--font-family-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
