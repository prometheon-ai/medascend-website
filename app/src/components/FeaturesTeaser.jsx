import { Link } from 'react-router-dom'
import { BookMarked, Target, Bot, HeartPulse, Users } from 'lucide-react'
import FadeInView from './animations/FadeInView'

const highlights = [
  { icon: BookMarked, label: 'LEARN', color: 'text-teal', accent: 'bg-teal/15', title: 'Study Hub', desc: 'The curriculum, organised subject by subject and chapter by chapter, with focused modes to learn, revise, and test each topic.' },
  { icon: Target, label: 'PRACTISE', color: 'text-gold', accent: 'bg-gold/15', title: 'Practice Zone', desc: 'Daily questions, question banks, full-length mock tests with all-India ranking, and a custom quiz builder.' },
  { icon: Bot, label: 'AI ZONE', color: 'text-terracotta', accent: 'bg-terracotta/15', title: '19 Subject-Specialist Tutors', desc: 'Nineteen tutors, each kept within one subject, so answers are accurate and trustworthy — not generic guessing.' },
  { icon: HeartPulse, label: 'CLINICAL', color: 'text-gold-light', accent: 'bg-gold/10', title: 'Clinical Posting Companion', desc: 'History proformas, examination checklists, case-presentation frameworks, and a personal case logger.' },
  { icon: Users, label: 'COMMUNITY', color: 'text-sky', accent: 'bg-sky/20', title: 'Community Q&A Hub', desc: 'Ask any doubt and get answers from peers, seniors, residents, and verified doctors.' },
]

export default function FeaturesTeaser() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInView>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight mb-3">
            Every feature exists because a medical student needed it.
          </h2>
          <p className="text-base text-sky font-family-secondary mb-12 max-w-2xl">
            Each one is built against a real problem someone taking the same exams has faced.
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {highlights.map((f, i) => (
            <FadeInView key={f.title} delay={i * 0.07}>
              <div className="h-full p-6 rounded-2xl bg-dark-surface/50 border border-teal/10 hover:border-teal/25 hover:bg-dark-surface/80 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.accent}`}>
                  <f.icon size={18} className={f.color} />
                </div>
                <span className={`text-[10px] font-bold tracking-[3px] uppercase mb-2 block ${f.color}`}>{f.label}</span>
                <h3 className="text-base font-bold text-cream mb-2">{f.title}</h3>
                <p className="text-sm text-sky font-family-secondary leading-relaxed">{f.desc}</p>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.4}>
          <div className="text-center">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-teal/30 text-cream/85 font-bold text-sm rounded-xl hover:border-teal/60 hover:text-cream transition-all duration-200 no-underline"
            >
              View all features →
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
