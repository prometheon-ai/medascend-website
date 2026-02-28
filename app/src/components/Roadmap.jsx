export default function Roadmap({ theme }) {
  const d = theme === 'dark'
  const items = [
    {
      badge: 'Coming Soon',
      badgeColor: 'bg-gold/15 text-gold',
      title: 'Reel Mode',
      desc: 'Study through bite-sized video reels — condensed concepts, visual mnemonics, rapid revision in scrollable format. Learning that fits your attention, not fights it.',
    },
    {
      badge: 'In Development',
      badgeColor: 'bg-terracotta/15 text-terracotta',
      title: 'Clinical Posting Companion',
      desc: 'Your postings become active learning sessions. History-taking templates, case documentation, bedside examination checklists. Clinical and academic learning, finally connected.',
    },
  ]

  return (
    <section id="roadmap" className={`py-24 lg:py-32 ${d ? 'bg-dark' : 'bg-cream'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>COMING SOON</span>
          <h2 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] ${d ? 'text-cream' : 'text-dark'}`}>
            The Next <span className="text-gradient">Evolution</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
              ${d ? 'bg-dark-surface/50 border border-teal/8' : 'bg-white border border-teal/6 shadow-sm'}`}>
              <div className={`h-52 overflow-hidden relative ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}>
                <img src="/stitch/future_roadmap_graphic/screen.png" alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-7">
                <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-3 ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <h3 className={`text-xl font-bold mb-2 ${d ? 'text-cream' : 'text-dark'}`}>{item.title}</h3>
                <p className={`text-sm font-[family-name:var(--font-family-secondary)] leading-relaxed ${d ? 'text-sky/60' : 'text-teal-deep/50'}`}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
