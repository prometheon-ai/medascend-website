import FadeInView from './animations/FadeInView'

const tiles = [
  { label: 'MBBS Students', sub: 'every year, every university exam' },
  { label: 'NEET-PG Aspirants', sub: null },
  { label: 'FMGE Candidates', sub: null },
  { label: 'INI-CET Aspirants', sub: null },
  { label: 'USMLE Aspirants', sub: 'preparing from India' },
  { label: 'PG Residents', sub: 'MD, MS, Diploma' },
  { label: 'Allied Health', sub: 'BDS, AYUSH, Nursing, Pharmacy, Physiotherapy' },
]

export default function BuiltFor() {
  return (
    <section id="built-for" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInView>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight mb-12">
            Wherever you are on the path.
          </h2>
        </FadeInView>
        <FadeInView delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiles.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-teal/10 bg-teal/5 px-6 py-5 hover:border-teal/25 hover:bg-teal/8 transition-all duration-200"
              >
                <p className="font-bold text-cream text-base">{t.label}</p>
                {t.sub && (
                  <p className="text-sm text-sky font-family-secondary mt-1">{t.sub}</p>
                )}
              </div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
