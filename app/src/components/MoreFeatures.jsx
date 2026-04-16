import { Layers, Library, CalendarCheck, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeInView from './animations/FadeInView'

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
  const [selectedImg, setSelectedImg] = useState(null)

  return (
    <>
      <section id="more-features" className="py-24 lg:py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <FadeInView key={i} delay={i * 0.15} className="flex">
                <motion.div
                  className="glow-card group rounded-2xl overflow-hidden transition-all duration-300 bg-dark-surface/50 border border-teal/10 flex flex-col h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className="h-56 overflow-hidden cursor-pointer bg-dark-card"
                    onClick={() => setSelectedImg(c.img)}
                  >
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                        <c.icon size={20} className="text-teal" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-cream">{c.title}</h3>
                    </div>
                    <p className="text-sm font-[family-name:var(--font-family-secondary)] leading-relaxed text-sky/60">{c.desc}</p>
                  </div>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button
                className="absolute -top-12 right-0 sm:-right-12 p-2 text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                onClick={(e) => { e.stopPropagation(); setSelectedImg(null) }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
