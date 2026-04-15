import { Helmet } from 'react-helmet-async'
import AIZone from '../components/AIZone'

export default function AIZonePage({ theme }) {
  return (
    <>
      <Helmet>
        <title>AI Zone — 19 Subject-Specific Medical AI Tutors | MedAscend</title>
        <meta name="description" content="Context-aware AI chat tutors for 19 medical subjects, Snap & Ask, Content Summarizer, MCQ Generator, Flashcard Generator, Mnemonic Creator, Patient Simulator, and Audio Overview. Bounded expertise, verified responses." />
        <link rel="canonical" href="https://medascend.in/features/ai-zone" />
        <meta property="og:title" content="AI Zone — 19 Subject-Specific Medical AI Tutors | MedAscend" />
        <meta property="og:description" content="Context that generic AI cannot touch. 19 subject-specific chatbots with bounded expertise and verified responses." />
        <meta property="og:url" content="https://medascend.in/features/ai-zone" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Zone — Medical AI Tutors | MedAscend" />
        <meta name="twitter:description" content="19 subject-specific AI chatbots, Snap & Ask, MCQ Generator, Patient Simulator, and more." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MedAscend AI Zone",
          "description": "AI-powered medical study tools including 19 subject-specific tutors with bounded expertise.",
          "url": "https://medascend.in/features/ai-zone",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
              { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://medascend.in/features" },
              { "@type": "ListItem", "position": 3, "name": "AI Zone", "item": "https://medascend.in/features/ai-zone" }
            ]
          }
        })}</script>
      </Helmet>
      <AIZone theme={theme} />
    </>
  )
}
