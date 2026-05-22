import { Link } from 'react-router-dom'
import FadeInView from './animations/FadeInView'

export default function WhereWeAre() {
  return (
    <section id="where-we-are" className="py-24 lg:py-32 bg-[#0a1218]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeInView>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-cream leading-tight mb-8">
            Where we are right now.
          </h2>
        </FadeInView>
        <FadeInView delay={0.15}>
          <p className="text-base md:text-lg text-sky/60 font-family-secondary leading-relaxed mb-5 max-w-2xl">
            We are being upfront about this. Right now, the quiz section — MedAscend Arena — is what is actually built and running in the app. Everything else described on this page is the vision we are building toward.
          </p>
          <p className="text-base md:text-lg text-sky/60 font-family-secondary leading-relaxed mb-10 max-w-2xl">
            We are actively looking for collaborators and contributors — developers, medical content creators, designers, and people who want to help fix medical education — to build the rest of this with us.
          </p>
          <Link
            to="/join"
            className="inline-flex px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 no-underline"
          >
            Help us build it
          </Link>
        </FadeInView>
      </div>
    </section>
  )
}
