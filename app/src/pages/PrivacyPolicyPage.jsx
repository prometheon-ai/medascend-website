import { Helmet } from 'react-helmet-async'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — MedAscend</title>
        <meta name="description" content="Privacy policy for MedAscend." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold text-cream leading-tight mb-6">Privacy Policy</h1>

          <div className="border border-teal/15 rounded-2xl p-6 bg-dark-surface/30">
            <p className="text-base md:text-lg text-sky/80 font-family-secondary leading-relaxed">
              Placeholder: Privacy policy content will be added here.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
