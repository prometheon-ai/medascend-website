import { Helmet } from 'react-helmet-async'
import BuiltFor from '../components/BuiltFor'
import TellUsProblem from '../components/TellUsProblem'

export default function ForStudentsPage() {
  return (
    <>
      <Helmet>
        <title>For Students — MedAscend</title>
        <meta name="description" content="MedAscend is built for MBBS students, NEET-PG aspirants, FMGE candidates, PG residents, and allied health students. Tell us what's slowing you down." />
      </Helmet>
      <div className="pt-17">
        <BuiltFor />
        <TellUsProblem />
      </div>
    </>
  )
}
