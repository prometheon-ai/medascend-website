import { Helmet } from 'react-helmet-async'
import TheProblem from '../components/TheProblem'
import Differentiators from '../components/Differentiators'

export default function TheProblemPage() {
  return (
    <>
      <Helmet>
        <title>The Problem — MedAscend</title>
        <meta name="description" content="Indian medical education spans 5+ years, 19 subjects, and tens of thousands of clinical concepts. The course is not difficult. It is just vast." />
      </Helmet>
      <div className="pt-17">
        <TheProblem />
        <Differentiators />
      </div>
    </>
  )
}
