import { Layers, Library, CalendarCheck, X } from 'lucide-react'
import { useState } from 'react'

const cards = [
  {
    img: '/stitch/memory_forge_graphic/screen.png',
    icon: Layers,
    title: 'Flashcard System',
    desc: 'Spaced repetition via SM2 algorithm. Chapter-wise decks. Daily review queues with streak tracking. Retention that compounds.',
  },
  {
    img: '/stitch/library_command_center_graphic/screen.png',
    icon: Library,
    title: 'Library',
    desc: 'PDFs, YouTube lectures, web articles, personal notes — unified, searchable, annotatable. One destination. Zero fragmentation.',
  },
  {
    img: '/stitch/planner_diary_graphic/screen.png',
    icon: CalendarCheck,
    title: 'Diary & Task Planner',
    desc: 'Log your daily progress, schedule revision blocks, set chapter deadlines. Stay organized. Stay accountable. Stay on track.',
  },
]

export default function MoreFeatures({ theme }) {
  const d = theme === 'dark'
  const [selectedImg, setSelectedImg] = useState(null)

  return (
    <>
      <section id="more-features" className={`py-24 lg:py-32 ${d ? 'bg-dark' : 'bg-cream'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <div key={i} className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                ${d ? 'bg-dark-surface/50 border border-teal/8' : 'bg-white border border-teal/6 shadow-sm'}`}>
                <div 
                  className={`h-56 overflow-hidden cursor-pointer ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}
                  onClick={() => setSelectedImg(c.img)}
                >
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <c.icon size={20} className="text-teal" />
                    <h3 className={`text-lg font-bold ${d ? 'text-cream' : 'text-dark'}`}>{c.title}</h3>
                  </div>
                  <p className={`text-sm font-[family-name:var(--font-family-secondary)] leading-relaxed ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center animate-fade-up">
            <button 
              className="absolute -top-12 right-0 sm:-right-12 p-2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImg(null)
              }}
              aria-label="Close image"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImg} 
              alt="Full preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
