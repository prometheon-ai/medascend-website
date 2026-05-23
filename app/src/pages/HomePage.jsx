import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useScrollToHash from '../hooks/useScrollToHash'
import CinematicHero from '../components/CinematicHero'
import TheProblem from '../components/TheProblem'
import Differentiators from '../components/Differentiators'
import ThePlatform from '../components/ThePlatform'
import FeaturesTeaser from '../components/FeaturesTeaser'
import WhyDifferent from '../components/WhyDifferent'
import BuiltFor from '../components/BuiltFor'
import FounderCredibility from '../components/FounderCredibility'
import HypeCTA from '../components/HypeCTA'
import FadeInView from '../components/animations/FadeInView'

function GetInvolved() {
  return (
    <section id="where-we-are" className="py-24 lg:py-32 bg-[#0a1218]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Tell us */}
          <FadeInView>
            <div className="h-full flex flex-col">
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-teal mb-4 block">FOR STUDENTS</span>
              <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold text-cream leading-tight mb-4">
                Tell us what's slowing you down.
              </h2>
              <p className="text-base text-sky font-family-secondary leading-relaxed mb-4 flex-1">
                This is built by a student who actually uses it. There are dozens of small, specific problems in a medical student's day that no platform bothers to fix.
              </p>
              <p className="text-base text-sky font-family-secondary leading-relaxed mb-8">
                We want to hear yours. However small or specific. Tell us the problem, and we'll try to solve it.
              </p>
              <Link
                to="/help"
                className="inline-flex self-start px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 no-underline"
              >
                Tell Us Your Problem
              </Link>
            </div>
          </FadeInView>

          {/* Join us */}
          <FadeInView delay={0.15}>
            <div className="h-full flex flex-col lg:border-l lg:border-teal/10 lg:pl-16">
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4 block">FOR CONTRIBUTORS</span>
              <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold text-cream leading-tight mb-4">
                Help us build it.
              </h2>
              <p className="text-base text-sky font-family-secondary leading-relaxed mb-4 flex-1">
                MedAscend is a long, deliberate effort to streamline medical education in India. We are looking for developers, medical content creators, designers, doctors, educators, and investors.
              </p>
              <p className="text-base text-sky font-family-secondary leading-relaxed mb-8">
                If this matters to you, tell us about yourself.
              </p>
              <Link
                to="/join"
                className="inline-flex self-start px-8 py-3 border border-teal/30 text-cream font-bold text-sm rounded-xl hover:border-teal/60 hover:bg-teal/10 transition-all duration-200 no-underline"
              >
                Join Us
              </Link>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}

export default function HomePage({ onAuth }) {
  useScrollToHash()
  return (
    <>
      <Helmet>
        <title>MedAscend — AI-Native Medical Education Platform</title>
        <meta name="description" content="A flagship product of Prometheon Applied Intelligence — an AI-native medical education platform that brings the entire medical journey into one app, for Indian medical students." />
        <link rel="canonical" href="https://medascend.in/" />
        <meta property="og:title" content="MedAscend — Built by a Medical Student. For Medical Students." />
        <meta property="og:description" content="One platform for everything you need to learn, revise, practise, and prepare — from the first day of MBBS to PG entrance and beyond." />
        <meta property="og:url" content="https://medascend.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://medascend.in/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* 1. Hero */}
      <CinematicHero onAuth={onAuth} />
      {/* 2. The Problem */}
      <TheProblem />
      {/* 3. What MedAscend does about it */}
      <Differentiators />
      {/* 4. The Platform */}
      <ThePlatform />
      {/* 5. Features */}
      <FeaturesTeaser />
      {/* 6. Why it's different */}
      <WhyDifferent />
      {/* 7. Built for */}
      <BuiltFor />
      {/* 9. Get involved — split panel */}
      <GetInvolved />
      {/* 11. Founder */}
      <FounderCredibility />
      {/* 12. Closing */}
      <HypeCTA />
    </>
  )
}
