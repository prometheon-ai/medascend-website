import { Helmet } from 'react-helmet-async'
import Features from '../components/Features'
import StudyHub from '../components/StudyHub'
import PracticeZone from '../components/PracticeZone'
import AIZone from '../components/AIZone'

export default function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>MedAscend Features — Study Hub, Practice Zone, AI Tools & More</title>
        <meta name="description" content="Explore MedAscend's complete feature set: multi-mode study content, precision practice with QBank and mocks, AI-powered tools, flashcards with spaced repetition, library, and planner." />
        <link rel="canonical" href="https://medascend.in/features" />
        <meta property="og:title" content="MedAscend Features — Study Hub, Practice Zone, AI Tools & More" />
        <meta property="og:description" content="Every feature exists because a medical student needed it. Study Hub, Practice Zone, AI Zone, Flashcards, Library, and Planner." />
        <meta property="og:url" content="https://medascend.in/features" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedAscend Features — Complete Medical Study Platform" />
        <meta name="twitter:description" content="Study Hub, Practice Zone, AI Zone, Flashcards, Library, and Planner — all in one platform." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MedAscend Features",
          "description": "Complete feature overview of MedAscend medical education platform.",
          "url": "https://medascend.in/features",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
              { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://medascend.in/features" }
            ]
          }
        })}</script>
      </Helmet>
      <Features />
      <StudyHub />
      <PracticeZone />
      <AIZone />
    </>
  )
}
