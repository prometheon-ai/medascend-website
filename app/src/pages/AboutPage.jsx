import { Helmet } from 'react-helmet-async'
import Founder from '../components/Founder'
import Problem from '../components/Problem'

export default function AboutPage({ theme }) {
  return (
    <>
      <Helmet>
        <title>About MedAscend — Built by a Medical Student, for Medical Students</title>
        <meta name="description" content="MedAscend was created by Vedant Shinde, a 3rd year MBBS student at Seth GS Medical College & KEM Hospital. Built from the frustration of passive learning and scattered resources." />
        <link rel="canonical" href="https://medascend.in/about" />
        <meta property="og:title" content="About MedAscend — Built by a Medical Student" />
        <meta property="og:description" content="Created by Vedant Shinde at KEM Hospital. The story behind MedAscend and Prometheon Applied Intelligence." />
        <meta property="og:url" content="https://medascend.in/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MedAscend" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About MedAscend — The Founder's Story" />
        <meta name="twitter:description" content="Created by a 3rd year MBBS student at KEM Hospital who was tired of passive learning platforms." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "name": "Vedant Shinde",
              "jobTitle": "Founder",
              "affiliation": {
                "@type": "EducationalOrganization",
                "name": "Seth GS Medical College & KEM Hospital"
              }
            },
            {
              "@type": "Organization",
              "name": "Prometheon Applied Intelligence Pvt. Ltd.",
              "url": "https://medascend.in",
              "founder": {
                "@type": "Person",
                "name": "Vedant Shinde"
              }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medascend.in/" },
                { "@type": "ListItem", "position": 2, "name": "About", "item": "https://medascend.in/about" }
              ]
            }
          ]
        })}</script>
      </Helmet>
      <Founder theme={theme} />
      <Problem theme={theme} />
    </>
  )
}
