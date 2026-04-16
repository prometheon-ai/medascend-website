import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Target, Brain, Clapperboard, Shield, Layers, CalendarCheck, FileText, Play, ArrowRight } from 'lucide-react'
import FadeInView from './animations/FadeInView'

const features = [
  { icon: Target, title: 'Practice Zone', desc: 'QBank, mocks, daily 10Q & arena', color: 'text-gold', bg: 'bg-gold/15' },
  { icon: Brain, title: 'AI Tools Suite', desc: 'Mindmaps, flashcards, audio, explain back', color: 'text-terracotta', bg: 'bg-terracotta/15' },
  { icon: Clapperboard, title: 'Reel Mode', desc: '60-sec visual concept reels', color: 'text-sky', bg: 'bg-sky/15' },
  { icon: Play, title: 'Animations Engine', desc: 'Cinematic visual explanations', color: 'text-gold-light', bg: 'bg-gold/15' },
  { icon: Shield, title: 'Exam Intelligence', desc: 'PYQ analysis, high-yield mapping', color: 'text-gold', bg: 'bg-gold/15' },
  { icon: FileText, title: 'Knowledge Forge', desc: 'Study from any material you upload', color: 'text-teal', bg: 'bg-teal/15' },
  { icon: Layers, title: 'Subject Pearls', desc: 'Subject-specific tips & tricks', color: 'text-stone', bg: 'bg-stone/15' },
  { icon: CalendarCheck, title: 'Diary & Planner', desc: 'Track, plan, execute daily', color: 'text-terracotta', bg: 'bg-terracotta/15' },
]

export default function FeaturesShowcase() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-dark-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeInView>
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
              THE PLATFORM
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight">
              Everything you need.{' '}
              <span className="text-gradient">Nothing you don't.</span>
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Phone mockup with parallax */}
          <FadeInView direction="left">
            <div className="relative flex justify-center">
              <motion.div style={{ y: phoneY }}>
                <img
                  src="/stitch/medascend_home_dashboard/screen.png"
                  alt="MedAscend Dashboard"
                  className="w-[220px] sm:w-[260px] rounded-3xl shadow-2xl shadow-teal/10"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </FadeInView>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <FadeInView key={i} direction="right" delay={i * 0.08}>
                <div className="glow-card p-5 rounded-2xl bg-dark-surface/50 border border-teal/8 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${f.bg}`}>
                    <f.icon size={18} className={f.color} />
                  </div>
                  <h3 className="text-sm font-bold text-cream mb-1">{f.title}</h3>
                  <p className="text-xs text-sky/50 font-[family-name:var(--font-family-secondary)]">{f.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>

        {/* Explore link */}
        <FadeInView delay={0.6}>
          <div className="text-center mt-12">
            <Link to="/features" className="inline-flex items-center gap-2 text-teal font-semibold hover:gap-3 transition-all duration-300">
              Explore all features <ArrowRight size={16} />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
