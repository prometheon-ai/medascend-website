import FadeInView from './animations/FadeInView'

export default function TheProblem() {
  return (
    <section id="the-problem" className="py-24 lg:py-32 bg-[#0a1218]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeInView>
          <p className="text-[clamp(32px,5vw,56px)] font-extrabold text-cream leading-tight mb-8">
            The course is not difficult.<br />
            <span className="text-gradient">It is just vast.</span>
          </p>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="text-base md:text-lg text-sky font-family-secondary leading-relaxed mb-5 max-w-2xl">
            Indian medical education spans 5+ years, 19 subjects, and tens of thousands of clinical concepts. The work is enormous, but not impossible. What makes it feel impossible is the system around it.
          </p>
          <p className="text-base md:text-lg text-sky font-family-secondary leading-relaxed max-w-2xl">
            A medical student today juggles multiple apps, books, notes, and groups just to get through one exam cycle — and spends more time figuring out what to study than actually studying.
          </p>
        </FadeInView>
      </div>
    </section>
  )
}
