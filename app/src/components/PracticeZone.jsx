import { CalendarClock, Database, ListFilter, Gauge, Award, History, Timer, SlidersHorizontal, NotebookPen, Repeat2, Bookmark, AlertCircle } from 'lucide-react'

const practiceItems = [
  { icon: CalendarClock, label: 'Daily 10Q' },
  { icon: Database, label: 'QBank' },
  { icon: ListFilter, label: 'Topic-Wise Quiz' },
  { icon: Gauge, label: 'Mini Mock' },
  { icon: Award, label: 'Grand Mock' },
  { icon: History, label: 'PYQ Mode' },
  { icon: Timer, label: 'Timed Mode' },
  { icon: SlidersHorizontal, label: 'Custom Quiz' },
]

const errorFeatures = [
  { icon: NotebookPen, title: 'Error Logbook', desc: 'Every wrong answer automatically captured.' },
  { icon: Repeat2, title: 'Smart Retry Mode', desc: 'Questions return strategically until mastered 3 times.' },
  { icon: Bookmark, title: 'Bookmarked MCQs', desc: 'Build your personal high-yield collection.' },
]

export default function PracticeZone({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="practice" className={`py-24 lg:py-32 ${d ? 'bg-dark' : 'bg-cream'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main layout - reversed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="phone-frame w-[260px] sm:w-[280px]">
              <img src="/stitch/practice_zone_graphic/screen.png" alt="Practice Zone" className="w-full" loading="lazy" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>PRACTICE ZONE</span>
            <h2 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 ${d ? 'text-cream' : 'text-dark'}`}>
              Precision <span className="text-gradient">Training</span>
            </h2>
            <p className={`font-[family-name:var(--font-family-secondary)] text-base mb-8 ${d ? 'text-sky/70' : 'text-teal-deep/60'}`}>
              Every practice scenario, covered. From daily micro-challenges to full-length NEET-PG simulations.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {practiceItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${d ? 'bg-dark-surface/50 border border-teal/8 hover:border-teal/15' : 'bg-white border border-teal/6 hover:border-teal/12 shadow-sm'}`}>
                  <item.icon size={18} className="text-teal shrink-0" />
                  <span className={`text-sm font-semibold ${d ? 'text-cream/90' : 'text-dark'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-terracotta" />
              <h3 className={`text-2xl font-extrabold ${d ? 'text-cream' : 'text-dark'}`}>Your Personal Error System</h3>
            </div>
            <p className={`font-[family-name:var(--font-family-secondary)] text-sm mb-6 ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>
              Every mistake becomes your roadmap. Systematic weakness elimination.
            </p>
            <div className="space-y-4">
              {errorFeatures.map((f, i) => (
                <div key={i} className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5
                  ${d ? 'bg-dark-surface/50 border border-teal/8' : 'bg-white border border-teal/6 shadow-sm'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${d ? 'bg-terracotta/15' : 'bg-terracotta/10'}`}>
                    <f.icon size={20} className="text-terracotta" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-[15px] mb-0.5 ${d ? 'text-cream' : 'text-dark'}`}>{f.title}</h4>
                    <p className={`text-sm font-[family-name:var(--font-family-secondary)] ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="phone-frame w-[260px] sm:w-[280px]">
              <img src="/stitch/error_system_graphic/screen.png" alt="Error System" className="w-full" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
