import { Helmet } from 'react-helmet-async'
import ThePlatform from '../components/ThePlatform'
import WhyDifferent from '../components/WhyDifferent'

export default function ThePlatformPage() {
  return (
    <>
      <Helmet>
        <title>The Platform — MedAscend</title>
        <meta name="description" content="One place for everything a medical student needs. Your lessons, notes, question bank, mock tests, flashcards, doubts, and daily plan — in one app." />
      </Helmet>
      <div className="pt-17">
        <ThePlatform />
        <WhyDifferent />
      </div>
    </>
  )
}
