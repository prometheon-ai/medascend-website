import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import WhereWeAre from '../components/WhereWeAre'
import JoinUs from '../components/JoinUs'

export default function WhereWeArePage() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Where We Are — MedAscend</title>
        <meta name="description" content="We're being upfront. MedAscend Arena is live today. Everything else is the vision we're building — and we're looking for people to help build it." />
      </Helmet>
      <div className="pt-17">
        <WhereWeAre onJoinUs={() => document.getElementById('join-us')?.scrollIntoView({ behavior: 'smooth' })} />
        <JoinUs />
      </div>
    </>
  )
}
