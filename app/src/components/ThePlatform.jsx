import FadeInView from './animations/FadeInView'

export default function ThePlatform() {
  return (
    <section className="py-24 lg:py-32 bg-[#0a1218]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeInView>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight mb-6">
            One place for everything a medical student needs.
          </h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="text-base md:text-lg text-sky font-family-secondary leading-relaxed mb-8 max-w-2xl">
            Your lessons, your notes and books, your question bank, your mock tests, your flashcards and revision, your doubts, your clinical and practical prep, your exam strategy, and your daily plan — in one app, instead of many.
          </p>
          <p className="text-lg md:text-xl font-bold text-cream">
            Not another app to add to the pile.{' '}
            <span className="text-gradient">The one that replaces it.</span>
          </p>
        </FadeInView>
      </div>
    </section>
  )
}
