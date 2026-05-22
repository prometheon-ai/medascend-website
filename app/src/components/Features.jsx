import { motion } from 'framer-motion'
import {
  Target, Brain, Clapperboard, Play, BarChart3, Layers,
  Trophy, RefreshCw, Sparkles, Upload, Bot, HeartPulse,
  Microscope, BookMarked, Newspaper, GraduationCap, Users,
  Zap, PenLine
} from 'lucide-react'
import AnimatedText from './animations/AnimatedText'
import FadeInView from './animations/FadeInView'

const categories = [
  {
    label: 'LEARN',
    color: 'text-teal',
    accent: 'bg-teal/15',
    features: [
      { icon: BookMarked, title: 'Study Hub', desc: 'The curriculum, organised subject by subject and chapter by chapter, with focused modes to learn, revise, and test each topic.' },
      { icon: Clapperboard, title: 'Reel Mode', desc: 'Swipe through a subject. Each 60-second reel covers one concept with a hook, a visual, and a memory anchor.' },
      { icon: Play, title: 'Animations Engine', desc: 'Cinematic animations that show invisible mechanisms and processes, instead of describing them.' },
      { icon: Layers, title: 'Mindmaps & Flashcards Library', desc: 'Ready-made mindmaps and decks for every chapter across all 19 subjects. Browse, preview, and start revising.' },
      { icon: Sparkles, title: 'Subject Pearls', desc: 'Quick-reference cards for each subject: drug comparisons, staging systems, milestone charts, vaccine schedules, drug-of-choice lists.' },
      { icon: Newspaper, title: 'Recent Guidelines', desc: 'Updated guidelines decoded for the exam: what changed, why it matters, and the questions that test it.' },
      { icon: GraduationCap, title: 'Uni & Internal Content', desc: 'Focused content for your university and internal exams — condensed high-yield material, must-know questions, and frameworks for whatever your college tests next.' },
      { icon: Microscope, title: 'Practical Content Hub', desc: 'Every spotter, instrument, slide, stain, and viva question, organised and searchable.' },
      { icon: PenLine, title: 'Notes & PDF Reader', desc: 'Open any textbook, annotate it, and keep all your notes for a topic together.' },
    ],
  },
  {
    label: 'PRACTISE',
    color: 'text-gold',
    accent: 'bg-gold/15',
    features: [
      { icon: Target, title: 'Practice Zone', desc: 'Daily questions, subject and topic question banks, full-length mock tests with all-India ranking, previous-year questions, and a custom quiz builder. Analytics after every quiz show where you\'re weak and what to fix.' },
      { icon: Trophy, title: 'MedAscend Arena', desc: 'Live quiz battles with real prize pools. Compete against thousands in real time and earn a national rank.', live: true },
      { icon: RefreshCw, title: 'Your Personal Error System', desc: 'Every wrong answer is captured and returned to you until you\'ve mastered it. Systematic weakness elimination.' },
    ],
  },
  {
    label: 'AI ZONE',
    color: 'text-terracotta',
    accent: 'bg-terracotta/15',
    features: [
      { icon: Bot, title: '19 Subject-Specialist Tutors', desc: 'Nineteen tutors, each kept within one subject, so answers are accurate and trustworthy — not generic guessing across all of medicine.' },
      { icon: Brain, title: 'Snap & Ask', desc: 'Photograph a question, diagram, or slide and get a precise, subject-grounded answer.' },
      { icon: Upload, title: 'Knowledge Forge & My Notes', desc: 'Upload your own material, or write and keep your own notes, and study from them: chat, summary, mindmap, flashcards, audio, quiz. Everything is read in medical context and connected to your subjects — not treated as plain text.' },
      { icon: Zap, title: 'AI Tools Suite', desc: 'Mindmap, flashcard, audio, mnemonic, question, and summary generators. Paste any topic, get study material in seconds.' },
      { icon: BarChart3, title: 'Explain Back To Me', desc: 'Explain a concept in your own words; the AI grades your understanding, finds the gaps, and tells you exactly what to revise.' },
      { icon: HeartPulse, title: 'Patient Simulator & OSCE', desc: 'Play the doctor: history, examination, investigations, diagnosis, treatment — scored against real protocols, with timed OSCE-style stations.' },
      { icon: Sparkles, title: 'Clinical Case Simulator', desc: 'AI patient cases with progressive hints and reasoning feedback. Training in how to think through a case.' },
    ],
  },
  {
    label: 'CLINICAL & PRACTICAL',
    color: 'text-gold-light',
    accent: 'bg-gold/10',
    features: [
      { icon: HeartPulse, title: 'Clinical Posting Companion', desc: 'Disease-wise history proformas, bedside examination checklists, case-presentation frameworks, and a personal case logger that builds your clinical portfolio. Every case also connects to the pathology, microbiology, pharmacology, and physiology behind it, so theory and practice stay linked. Every posting becomes a structured learning event.' },
    ],
  },
  {
    label: 'COMMUNITY',
    color: 'text-sky',
    accent: 'bg-sky/20',
    features: [
      { icon: Users, title: 'Community Q&A Hub', desc: 'Ask any doubt and get answers from peers, seniors, residents, and verified doctors. Tagged, upvotable, searchable — every answer becomes a resource for the next student.' },
      { icon: GraduationCap, title: 'Teacher Hub', desc: 'Learn directly from verified medical educators: notes, pearls, and breakdowns, organised by subject and chapter.' },
      { icon: Zap, title: 'Influencer Hub', desc: 'Real journeys and honest strategies from people one step ahead of you.' },
    ],
  },
]

export default function Features() {
  return (
    <section id="features" className="pt-32 pb-24 lg:pb-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <AnimatedText
            text="Every feature exists because a medical student needed it."
            mode="word"
            stagger={0.04}
            className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
            as="h2"
          />
          <FadeInView delay={0.4}>
            <p className="font-family-secondary text-base text-sky/60">
              Each one is built against a real problem someone taking the same exams has faced.
            </p>
          </FadeInView>
        </div>

        <div className="space-y-20">
          {categories.map((cat, ci) => (
            <div key={ci}>
              <FadeInView>
                <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-6 block ${cat.color}`}>
                  {cat.label}
                </span>
              </FadeInView>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cat.features.map((f, fi) => (
                  <FadeInView key={fi} delay={fi * 0.08} className="flex">
                    <motion.div
                      className="glow-card p-7 rounded-2xl bg-dark-surface/50 border border-teal/10 flex flex-col w-full"
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${cat.accent}`}
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                      >
                        <f.icon size={22} className={cat.color} />
                      </motion.div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-cream">{f.title}</h3>
                        {f.live && <span className="text-[10px] font-bold tracking-[2px] uppercase px-2 py-0.5 rounded-full bg-teal/20 text-teal-light">LIVE</span>}
                      </div>
                      <p className="text-sm leading-relaxed font-family-secondary text-sky/60 flex-1">{f.desc}</p>
                    </motion.div>
                  </FadeInView>
                ))}
              </div>
            </div>
          ))}
        </div>

        <FadeInView delay={0.2}>
          <p className="mt-16 text-center text-base text-sky/50 font-family-secondary max-w-2xl mx-auto">
            Everything you learn is held together by a built-in Spaced Repetition System, so concepts come back at the right time and you remember them long after.
          </p>
        </FadeInView>
      </div>
    </section>
  )
}
