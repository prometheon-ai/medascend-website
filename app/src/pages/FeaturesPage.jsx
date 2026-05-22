import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import FadeInView from '../components/animations/FadeInView'
import Features from '../components/Features'
import PracticeZone from '../components/PracticeZone'
import AIZone from '../components/AIZone'

export default function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features — MedAscend</title>
        <meta name="description" content="Every feature is designed against a real problem someone taking the same exams has faced. The full MedAscend platform." />
        <link rel="canonical" href="https://medascend.in/features" />
      </Helmet>

      <Features />
      <PracticeZone />
      <AIZone />

      {/* Closing */}
      <section className="py-24 bg-[#0a1218]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInView>
            <p className="text-[clamp(24px,3.5vw,42px)] font-extrabold text-cream mb-10">
              This is the platform that should have existed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/join"
                className="px-8 py-3.5 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 no-underline"
              >
                Join Us
              </Link>
              <Link
                to="/help"
                className="px-8 py-3.5 border border-teal/30 text-cream/70 font-bold text-sm rounded-xl hover:border-teal/60 hover:text-cream transition-all duration-200 no-underline"
              >
                Tell Us Your Problem
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  )
}
