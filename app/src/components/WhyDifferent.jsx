import FadeInView from './animations/FadeInView'

const points = [
  {
    n: '1',
    title: 'Built by a medical student, for medical students.',
    body: 'Designed from inside the course, against problems the founder has personally faced — not by a tech team consulting doctors from a distance.',
  },
  {
    n: '2',
    title: 'Everything in one place.',
    body: 'The whole journey in one app — learning, revision, practice, clinical and practical prep, exam strategy, doubts, and community — instead of many apps.',
  },
  {
    n: '3',
    title: 'AI that understands medicine.',
    body: 'Kept within real subject boundaries and grounded in actual material, so answers are accurate and safe to study from.',
  },
  {
    n: '4',
    title: 'Built for the whole journey.',
    body: 'With you from first-year MBBS through residency — university exams, practicals, clinical postings, and continuous learning, alongside entrance prep.',
  },
]

export default function WhyDifferent() {
  return (
    <section className="py-24 lg:py-32 bg-[#0a1218]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeInView>
          <span className="text-[11px] font-semibold tracking-[5px] uppercase text-teal-light mb-4 block">
            WHY IT'S DIFFERENT
          </span>
        </FadeInView>
        <div className="flex flex-col gap-10 mt-8">
          {points.map((p, i) => (
            <FadeInView key={p.n} delay={0.1 + i * 0.08}>
              <div className="flex gap-6">
                <span className="text-[clamp(32px,5vw,48px)] font-extrabold text-teal/20 leading-none select-none shrink-0 w-10">
                  {p.n}
                </span>
                <div>
                  <p className="text-lg md:text-xl font-bold text-cream mb-2">{p.title}</p>
                  <p className="text-base text-sky/60 font-family-secondary leading-relaxed">{p.body}</p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
