const audienceTags = ['MBBS', 'NEET-PG', 'FMGE', 'INI-CET', 'USMLE', 'MD', 'MS', 'Diploma', 'BDS', 'AYUSH', 'Nursing', 'Pharmacy', 'Physiotherapy']

export default function CinematicHero({ onAuth }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-125 h-125 rounded-full blur-[160px] bg-teal/12 top-[10%] right-[-10%]" />
        <div className="absolute w-100 h-100 rounded-full blur-[120px] bg-gold/6 bottom-[20%] left-[-5%]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl w-full py-24">

        {/* Wordmark */}
        <h1 className="text-[clamp(48px,10vw,96px)] font-extrabold tracking-tight leading-none text-gradient mb-3">
          MedAscend
        </h1>

        {/* Tagline */}
        <p className="text-[11px] font-semibold tracking-[3px] uppercase text-teal-light mb-6">
          The Medical Education Revolution · Built by a Medical Student. For Medical Students.
        </p>

        {/* Primary description */}
        <p className="text-base md:text-xl font-semibold text-cream/85 mb-3 max-w-xl mx-auto leading-snug">
          An AI-native medical education platform that brings the entire medical journey into one app, for Indian medical students.
        </p>

        {/* Supporting line */}
        <p className="text-sm text-cream/45 font-family-secondary mb-10 max-w-lg mx-auto leading-relaxed">
          One platform for everything you need to learn, revise, practise, and prepare — from the first day of MBBS to PG entrance and beyond.
        </p>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-3 mb-10 flex-wrap">
          <button
            onClick={onAuth}
            className="px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none"
          >
            Login / Register
          </button>
          <a
            href="#the-problem"
            className="px-8 py-3 border border-cream/15 text-cream/60 font-semibold text-sm rounded-xl hover:border-cream/35 hover:text-cream transition-all duration-200 no-underline"
          >
            See what we're building
          </a>
        </div>

        {/* Audience pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {audienceTags.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-sky/15 text-sky/35 bg-sky/5"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
