import { Helmet } from 'react-helmet-async'
import StudyHub from '../components/StudyHub'

export default function StudyHubPage() {
  return (
    <>
      <Helmet>
        <title>Study Hub — 5 Integrated Study Modes for Medical Students | MedAscend</title>
        <meta name="description" content="Deep Learn, Revise, Memory Forge, Exam Pattern Intelligence, and Practice MCQs — five integrated study modes designed for actual retention, not passive consumption. Built for NEET PG aspirants." />
        <link rel="canonical" href="https://medascend.in/features/study-hub" />
        <meta property="og:title" content="Study Hub — 5 Integrated Study Modes | MedAscend" />
        <meta property="og:description" content="Content that respects your time. Deep Learn, Revise, Memory Forge, Exam Pattern Intelligence, and Practice MCQs." />
        <meta property="og:url" content="https://medascend.in/features/study-hub" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Study Hub — Active Recall Study Modes | MedAscend" />
        <meta name="twitter:description" content="Five integrated study modes: Deep Learn, Revise, Memory Forge, Exam Pattern Intelligence, Practice MCQs." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MedAscend Study Hub",
          "description": "Five integrated study modes for medical students preparing for NEET PG.",
          "url": "https://medascend.in/features/study-hub",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
              { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://medascend.in/features" },
              { "@type": "ListItem", "position": 3, "name": "Study Hub", "item": "https://medascend.in/features/study-hub" }
            ]
          }
        })}</script>
      </Helmet>
      <StudyHub />
    </>
  )
}
