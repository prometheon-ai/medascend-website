import { Helmet } from 'react-helmet-async'
import useScrollToHash from '../hooks/useScrollToHash'
import CinematicHero from '../components/CinematicHero'
import SolutionIntro from '../components/SolutionIntro'
import Differentiators from '../components/Differentiators'
import FeaturesShowcase from '../components/FeaturesShowcase'
import FounderCredibility from '../components/FounderCredibility'
import HypeCTA from '../components/HypeCTA'

export default function HomePage({ theme, onEarlyAccess }) {
  useScrollToHash()
  return (
    <>
      <Helmet>
        <title>MedAscend — The Medical Education Revolution for NEET PG</title>
        <meta name="description" content="MedAscend is the all-in-one medical education platform built by a medical student. AI-powered study tools, active recall, spaced repetition, and precision practice for NEET PG aspirants." />
        <link rel="canonical" href="https://medascend.in/" />
        <meta property="og:title" content="MedAscend — Built by a Medical Student. For Medical Students." />
        <meta property="og:description" content="The ultimate active recall and AI-driven companion for NEET PG. Study smart. Practice hard. Ascend higher." />
        <meta property="og:url" content="https://medascend.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedAscend — The Medical Education Revolution" />
        <meta name="twitter:description" content="AI-powered study tools, active recall, spaced repetition for NEET PG aspirants." />
        <meta name="twitter:image" content="https://medascend.in/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "Prometheon Applied Intelligence Pvt. Ltd.",
              "url": "https://medascend.in",
              "logo": "https://medascend.in/favicon.svg"
            },
            {
              "@type": "WebSite",
              "name": "MedAscend",
              "url": "https://medascend.in",
              "description": "The all-in-one medical education platform with AI-powered study tools for NEET PG aspirants."
            },
            {
              "@type": "SoftwareApplication",
              "name": "MedAscend",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "description": "AI-powered medical education platform with active recall, spaced repetition, QBank, mock tests, and 19 subject-specific AI tutors for NEET PG preparation.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/PreOrder"
              },
              "creator": {
                "@type": "Organization",
                "name": "Prometheon Applied Intelligence Pvt. Ltd."
              }
            }
          ]
        })}</script>
      </Helmet>
      <CinematicHero />
      <SolutionIntro />
      <Differentiators />
      <FeaturesShowcase />
      <FounderCredibility />
      <HypeCTA onEarlyAccess={onEarlyAccess} />
    </>
  )
}
