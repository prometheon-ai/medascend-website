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
      { icon: Clapperboard, title: 'Reel Mode', desc: '60-second visual concept reels you swipe through like TikTok. Each reel covers one atomic concept — a hook that grabs you, a visual explanation that makes it click, and a memory anchor that makes it stick. Built for how this generation actually learns. Swipe through an entire subject and genuinely retain it.' },
      { icon: Play, title: 'Animations Engine', desc: 'Cinematic medical animations that make complex mechanisms, pathways, and processes visually intuitive. No more imagining what your textbook is trying to describe — see it happen. Every animation comes with extractable key facts you can send straight to flashcards. Watch to understand, read to memorize, test to confirm.' },
      { icon: Brain, title: 'Clinical Posting Companion', desc: 'Disease-wise history taking proformas you can fill during actual postings — tappable checklists, fillable fields, exportable as PDF. A case logger that builds your clinical portfolio over time. Cross-subject integration that connects every disease across Medicine, Pathology, Pharmacology, and Microbiology in one view.' },
      { icon: Microscope, title: 'Practical Content Hub', desc: 'Every practical you\'ll ever face — Anatomy histology slides and specimens, Pathology gross specimens and special stains, Microbiology culture media, Surgery instruments with common viva questions, Forensic Medicine protocols and poison charts. Searchable, zoomable, always in your pocket.' },
      { icon: Layers, title: 'Subject Pearls', desc: 'Subject-specific quick-reference cards designed for rapid recall — Anatomy origin-insertion tables, Pharmacology drug comparison charts, Medicine DOC compilations, Surgery staging systems, Pediatrics milestone charts, Microbiology vaccine schedules. The curated reference material that saves hours of note-making.' },
      { icon: Newspaper, title: 'Recent Guidelines', desc: 'Updated medical guidelines with exam-focused summaries. What changed from the previous version, why it matters for NEET-PG, related MCQs that test the updates, and ready-made flashcards for every key change. Never get caught off guard by a guideline question.' },
      { icon: BookMarked, title: 'Mindmaps & Flashcards Library', desc: 'A pre-built library of professionally designed mindmaps and flashcard decks for every chapter across all 19 subjects. No creation effort — browse, preview, and start studying. Add entire decks to your spaced repetition queue with one tap.' },
      { icon: PenLine, title: 'Notes & PDF Reader', desc: 'A note-taking system built for medical students, not a generic app bolted on. Open any textbook PDF — Robbins, Harrison\'s, Gray\'s — and annotate directly with handwritten scribbles, typed notes, color-coded highlights, and voice memos pinned to specific pages. Notes auto-link to MedAscend\'s subject-chapter structure so everything you ever wrote on a topic surfaces together. AI generates summaries from your PDFs and turns your notes into flashcards and MCQs.' },
    ],
  },
  {
    label: 'PRACTICE',
    color: 'text-gold',
    accent: 'bg-gold/15',
    features: [
      { icon: Target, title: 'Practice Zone', desc: '15+ practice modes covering every scenario: Daily 10Q for consistency, QBank for depth, Grand Test Series for full NEET-PG simulation with national ranking, Rapid Fire for quick 5-minute sessions, Image-Based Questions for the increasingly visual exam pattern, One-Liner Mode for rapid fact recall, PYQ Mode, Timed Mode, and Custom Quiz Builder. Post-quiz analytics identify your exact weak spots and generate a recovery plan.' },
      { icon: Trophy, title: 'MedAscend Arena', desc: 'Live competitive quizzes with real prize money. Subject Showdowns, All-India Challenges, College Battles, City Championships, and daily Flash Quizzes. Compete against thousands of students in real-time, earn a national rank, track your Arena rating, and win actual prizes. Because studying alone only takes you so far — pressure and competition forge the sharpest minds.' },
      { icon: RefreshCw, title: 'Spaced Repetition System', desc: 'A built-in spaced repetition engine you never have to set up. Flashcards auto-generate from every reel you watch, every animation\'s key facts, every wrong answer in practice, and every study session. The SM-2 algorithm schedules each card at the exact moment you\'re about to forget it. Not a separate app — it\'s the backbone connecting everything you learn across MedAscend.' },
      { icon: Zap, title: 'Exam Crisis Content', desc: 'Exam in 3 days. Don\'t panic. A dedicated mode that surfaces ultra-high-yield revision material designed for the final 72 hours. Condensed one-pagers, must-know MCQs, most-repeated university questions, last-minute mnemonics, and panic-tested frameworks that focus on what actually shows up — not everything, just what scores. Available in 7-day, 3-day, and 24-hour modes with a passing score toolkit for when time is running out.' },
    ],
  },
  {
    label: 'AI',
    color: 'text-terracotta',
    accent: 'bg-terracotta/15',
    features: [
      { icon: Sparkles, title: 'AI Tools Suite', desc: 'A complete toolkit: Mindmap Generator, Flashcard Generator, Podcast Generator (two AI voices discussing your topic), Mnemonic Creator, MCQ Generator, Content Summarizer, and Explain Back To Me — where you explain a concept and AI scores your understanding, identifies gaps, and points you to what to review. Paste any topic and get complete study material in seconds.' },
      { icon: Upload, title: 'Knowledge Forge', desc: 'Upload anything — PDFs, lecture recordings, YouTube video links, handwritten notes, textbook photos, website URLs. AI processes your material into an interactive chat, concise summary, visual mindmap, flashcard deck, two-voice audio podcast, and practice quiz. Like NotebookLM, but built natively into your study ecosystem so everything connects.' },
      { icon: Bot, title: '19 Subject-Specific AI Tutors', desc: 'Not generic ChatGPT that hallucinates across all of medicine. 19 separate AI bots, each operating within the boundaries of one subject. The Pharmacology bot answers Pharmacology. It won\'t guess about Surgery. Bounded expertise means accurate, trustworthy responses you can study from without cross-checking every answer.' },
      { icon: HeartPulse, title: 'Patient Simulator & OSCE Mode', desc: 'Interactive clinical case simulations where you play the doctor. Take history by asking the AI patient questions, select systems to examine, order investigations, arrive at a diagnosis, and plan treatment — scored against standard protocols. OSCE stations run on 8-minute timers with real marking schemes. Build clinical confidence before you hit the ward.' },
      { icon: BarChart3, title: 'Exam Intelligence System', desc: '10 years of NEET-PG papers systematically analyzed. Subject-wise question distribution, high-yield topic rankings, year-over-year trend analysis, question pattern breakdowns, and common trap identification. Plus a personalized strategy built from your own practice data — predicted score range, rank estimate, and exactly which subjects to improve to reach your target rank. Your blueprint for cracking the exam.' },
    ],
  },
  {
    label: 'COMMUNITY',
    color: 'text-sky',
    accent: 'bg-sky/20',
    features: [
      { icon: GraduationCap, title: 'Teacher Hub', desc: 'Learn directly from India\'s top medical educators. A curated space where verified doctors, professors, and subject specialists publish their own notes, high-yield pearls, mnemonics, and concept breakdowns — organized by subject, chapter, and topic. Follow your favorite teachers, get notified when they drop new content, and build a personalized feed of the educators whose teaching style clicks for you. No more hunting across WhatsApp groups and YouTube.' },
      { icon: Users, title: 'Influencer Hub', desc: 'Real journeys. Real strategies. From people who\'ve been where you are. Toppers who cracked NEET-PG, seniors who survived third year, and aspirants one step ahead share what actually worked — study vlogs, daily routines, subject-wise preparation playbooks, and honest takes on what\'s worth your time. Not polished marketing content. Peer wisdom you can trust because they took the same exam you\'re preparing for.' },
    ],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeInView>
            <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">
              THE MEDASCEND DIFFERENCE
            </span>
          </FadeInView>
          <AnimatedText
            text="Every feature exists because a medical student needed it."
            mode="word"
            stagger={0.04}
            className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 text-cream"
            as="h2"
          />
          <FadeInView delay={0.4}>
            <p className="font-[family-name:var(--font-family-secondary)] text-base text-sky/60">
              No speculation. No corporate product teams guessing. Just relentless iteration by someone taking the same exams you are.
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
                      <h3 className="text-lg font-bold mb-2 text-cream">{f.title}</h3>
                      <p className="text-sm leading-relaxed font-[family-name:var(--font-family-secondary)] text-sky/60 flex-1">{f.desc}</p>
                    </motion.div>
                  </FadeInView>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
