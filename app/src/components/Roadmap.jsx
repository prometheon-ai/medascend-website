export default function Roadmap() {
  const items = [
    {
      title: 'Reel Mode',
      desc: 'Study through bite-sized video reels — condensed concepts, visual mnemonics, rapid revision in scrollable format. Learning that fits your attention, not fights it.',
    },
    {
      title: 'Clinical Posting Companion',
      desc: 'Your postings become active learning sessions. History-taking templates, case documentation, bedside examination checklists. Clinical and academic learning, finally connected.',
    },
  ]

  return (
    <section id="roadmap" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold tracking-[5px] uppercase mb-4 block text-teal-light">WHAT'S NEXT</span>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] text-cream">
            The Next <span className="text-gradient">Evolution</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-dark-surface/50 border border-teal/10">
              <div className="h-52 overflow-hidden relative bg-dark-card">
                <img src="/stitch/future_roadmap_graphic/screen.png" alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold mb-2 text-cream">{item.title}</h3>
                <p className="text-sm font-[family-name:var(--font-family-secondary)] leading-relaxed text-sky/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
