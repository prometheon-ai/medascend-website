import { Helmet } from 'react-helmet-async'
import PracticeZone from '../components/PracticeZone'

export default function PracticeZonePage({ theme }) {
  return (
    <>
      <Helmet>
        <title>Practice Zone — QBank, Mock Tests & Error System | MedAscend</title>
        <meta name="description" content="Daily 10Q, QBank, topic-wise quizzes, mini and grand mocks, PYQ mode, timed mode, custom quizzes, and a personal error elimination system. Precision training for NEET PG." />
        <link rel="canonical" href="https://medascend.in/features/practice-zone" />
        <meta property="og:title" content="Practice Zone — QBank, Mock Tests & Error System | MedAscend" />
        <meta property="og:description" content="Every practice scenario covered. Daily questions, QBank, mock tests, PYQ mode, and a personal error system that turns mistakes into mastery." />
        <meta property="og:url" content="https://medascend.in/features/practice-zone" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Practice Zone — NEET PG QBank & Mocks | MedAscend" />
        <meta name="twitter:description" content="Daily 10Q, QBank, mocks, PYQ mode, timed mode, and personal error elimination system." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MedAscend Practice Zone",
          "description": "Comprehensive practice tools including QBank, mock tests, and error system for NEET PG preparation.",
          "url": "https://medascend.in/features/practice-zone",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
              { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://medascend.in/features" },
              { "@type": "ListItem", "position": 3, "name": "Practice Zone", "item": "https://medascend.in/features/practice-zone" }
            ]
          }
        })}</script>
      </Helmet>
      <PracticeZone theme={theme} />
    </>
  )
}
