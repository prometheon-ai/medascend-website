import { AlertTriangle, CheckCircle } from 'lucide-react'

const rows = [
  ['Videos wasting hours', 'Multi-mode text content — read, revise, practice at your pace'],
  ['Scattered question sources', 'Integrated QBank + Topic-wise + Custom quizzes'],
  ['Repeating the same mistakes', 'Error Logbook + Smart Retry — systematic weakness elimination'],
  ['Important questions lost', 'Bookmarked MCQs — personal high-yield collection'],
  ['Generic AI hallucinations', 'Subject-specific bots with bounded, contextual expertise'],
  ['Forgetting what you studied', 'Spaced repetition + Memory Forge — active retention'],
  ['Not knowing exam patterns', 'Real PYQ analysis — data-driven prioritization'],
  ['Subject-specific memorization', 'High Yield Tools — compilations and tricks per subject'],
  ['No feedback on weak areas', 'Post-quiz analytics + targeted Daily 10Q'],
  ['Scattered resources', 'Single ecosystem — study, practice, AI, flashcards, library'],
  ['Passive learning', 'Active recall at every stage — engagement, not consumption'],
  ['No organization', 'Diary + Task Planner — track, plan, execute'],
]

export default function PainPoints({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="painpoints" className={`py-24 lg:py-32 ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>
            EVERY PAIN POINT. ANSWERED.
          </span>
          <h2 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] ${d ? 'text-cream' : 'text-dark'}`}>
            Not feature creep. <span className="text-gradient">Comprehensive design.</span>
          </h2>
        </div>

        <div className={`rounded-2xl overflow-hidden border ${d ? 'border-teal/10' : 'border-teal/8'}`}>
          {/* Header */}
          <div className="grid grid-cols-2 bg-teal text-cream">
            <div className="px-6 py-4 flex items-center gap-2 text-sm font-bold">
              <AlertTriangle size={16} /> What Frustrates You
            </div>
            <div className="px-6 py-4 flex items-center gap-2 text-sm font-bold border-l border-white/10">
              <CheckCircle size={16} /> How MedAscend Solves It
            </div>
          </div>
          {/* Rows */}
          {rows.map((r, i) => (
            <div key={i} className={`grid grid-cols-2 transition-colors duration-200
              ${i % 2 === 0
                ? d ? 'bg-dark-surface/30' : 'bg-white'
                : d ? 'bg-dark-surface/50' : 'bg-cream/80'
              } ${d ? 'hover:bg-teal/5' : 'hover:bg-teal/3'}`}>
              <div className={`px-6 py-3.5 text-sm font-[family-name:var(--font-family-secondary)] ${d ? 'text-stone' : 'text-teal-deep/60'}`}>{r[0]}</div>
              <div className={`px-6 py-3.5 text-sm font-medium border-l ${d ? 'text-cream/80 border-teal/8' : 'text-dark/80 border-teal/6'}`}>{r[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
