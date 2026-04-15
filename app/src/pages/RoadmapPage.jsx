import { Helmet } from 'react-helmet-async'
import Roadmap from '../components/Roadmap'

export default function RoadmapPage({ theme }) {
  return (
    <>
      <Helmet>
        <title>MedAscend Roadmap — Reel Mode, Clinical Posting Companion & More</title>
        <meta name="description" content="Upcoming MedAscend features: Reel Mode for bite-sized video learning with visual mnemonics, and Clinical Posting Companion for bedside learning with history-taking templates and case documentation." />
        <link rel="canonical" href="https://medascend.in/roadmap" />
        <meta property="og:title" content="MedAscend Roadmap — Upcoming Features" />
        <meta property="og:description" content="Reel Mode for bite-sized video learning and Clinical Posting Companion for bedside learning. The next evolution of medical education." />
        <meta property="og:url" content="https://medascend.in/roadmap" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedAscend Roadmap — What's Coming Next" />
        <meta name="twitter:description" content="Reel Mode and Clinical Posting Companion — upcoming features for medical students." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MedAscend Roadmap",
          "description": "Upcoming features and development roadmap for MedAscend medical education platform.",
          "url": "https://medascend.in/roadmap",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
              { "@type": "ListItem", "position": 2, "name": "Roadmap", "item": "https://medascend.in/roadmap" }
            ]
          }
        })}</script>
      </Helmet>
      <Roadmap theme={theme} />
    </>
  )
}
