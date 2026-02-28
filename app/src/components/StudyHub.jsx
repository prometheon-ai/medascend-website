import { BookOpenText, Zap, Flame, TrendingUp, CheckSquare, Sparkles, Bone, Pill, Stethoscope, PlusCircle } from 'lucide-react'

const modes = [
  { icon: BookOpenText, title: 'Deep Learn Mode', desc: 'Visual, structured, mnemonic-rich. No fluff.', color: 'bg-teal/15 text-teal' },
  { icon: Zap, title: 'Revise Mode', desc: 'Same information, compressed for speed. Zero information loss.', color: 'bg-gold/15 text-gold' },
  { icon: Flame, title: 'Memory Forge', desc: 'Active recall — fill blanks, expand mnemonics, spot errors.', color: 'bg-terracotta/15 text-terracotta' },
  { icon: TrendingUp, title: 'Exam Pattern Intelligence', desc: 'Real PYQ analysis showing what gets asked and where traps hide.', color: 'bg-sky/20 text-teal-light' },
  { icon: CheckSquare, title: 'Practice MCQs', desc: 'Questions born directly from your Deep Learn content.', color: 'bg-stone/15 text-stone' },
]

const hytCards = [
  { icon: Bone, title: 'Anatomy', desc: 'Origin-insertion tables, muscle compartments, neurovascular relations' },
  { icon: Pill, title: 'Pharmacology', desc: 'Drug classifications with memory hooks' },
  { icon: Stethoscope, title: 'Medicine', desc: 'Syndromes and diagnostic criteria at a glance' },
  { icon: PlusCircle, title: '+ 16 More', desc: 'Every subject gets its own specialized toolkit' },
]

export default function StudyHub({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="study-hub" className={`py-24 lg:py-32 ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>STUDY HUB</span>
            <h2 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 ${d ? 'text-cream' : 'text-dark'}`}>
              Content That Respects <span className="text-gradient">Your Time</span>
            </h2>
            <p className={`font-[family-name:var(--font-family-secondary)] text-base mb-8 ${d ? 'text-sky/70' : 'text-teal-deep/60'}`}>
              Five integrated modes flowing from one source: Deep Learn — our core content architecture designed for actual retention.
            </p>
            <div className="space-y-3">
              {modes.map((m, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-x-[-4px]
                  ${d ? 'hover:bg-dark-surface/60' : 'hover:bg-white/80'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${m.color.split(' ')[0]}`}>
                    <m.icon size={20} className={m.color.split(' ')[1]} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-[15px] mb-0.5 ${d ? 'text-cream' : 'text-dark'}`}>{m.title}</h4>
                    <p className={`text-sm font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="phone-frame w-[260px] sm:w-[280px]">
              <img src="/stitch/study_hub_modes_graphic/screen.png" alt="Study Hub Modes" className="w-full" loading="lazy" />
            </div>
          </div>
        </div>

        {/* High Yield Tools */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-gold" />
            <h3 className={`text-2xl font-extrabold ${d ? 'text-cream' : 'text-dark'}`}>High Yield Tools</h3>
          </div>
          <p className={`font-[family-name:var(--font-family-secondary)] text-sm ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>
            Subject-specific compilations and tricks crafted for each of the 19 subjects.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hytCards.map((c, i) => (
            <div key={i} className={`p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
              ${d ? 'bg-dark-surface/50 border border-teal/8 hover:border-teal/15' : 'bg-white border border-teal/6 hover:border-teal/12 shadow-sm'}`}>
              <c.icon size={28} className="text-gold mx-auto mb-3" />
              <h4 className={`font-bold text-[15px] mb-1 ${d ? 'text-cream' : 'text-dark'}`}>{c.title}</h4>
              <p className={`text-xs font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/50' : 'text-teal-deep/40'}`}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
