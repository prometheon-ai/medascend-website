import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { X, Zap } from 'lucide-react'
import useScrollToHash from '../hooks/useScrollToHash'
import CinematicHero from '../components/CinematicHero'
import ArenaPoster from '../components/ArenaPoster'
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

function AppLaunchToast() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 7000)
    const hideTimer = setTimeout(() => setVisible(false), 8000)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  if (!visible) return null

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-1000 animate-popIn ${fading ? 'opacity-0 translate-y-2' : ''}`}>
      <div className="rounded-2xl border border-teal/20 bg-dark-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0 mt-0.5" />
            <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest">Coming Soon</span>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="bg-transparent border-none cursor-pointer text-sky/40 hover:text-sky transition-colors p-0 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        <p className="text-sm text-cream font-medium leading-relaxed mb-3">
          The app will be live on the <span className="text-teal font-bold">Play Store & App Store</span> on <span className="text-gold font-bold">18th June 2026</span>. Start registering now!
        </p>
      </div>
    </div>
  )
}

function ArenaBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="fixed top-17 left-0 right-0 z-40 flex items-center justify-center gap-3 px-4 py-2 bg-linear-to-r from-teal/10 via-teal/5 to-gold-light/10 border-b border-teal/15 backdrop-blur-md">
      <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-green-400 uppercase tracking-[2px] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live
      </span>
      <p className="text-sm font-medium text-cream/90 text-center">
        Registrations are now open for{' '}
        <span className="font-bold text-cream">MedAscend Arena — FMT and PSM Quiz</span>
      </p>
      <Link
        to="/arena"
        className="flex items-center gap-1 shrink-0 text-xs font-bold text-teal hover:text-cream transition-colors border border-teal/30 hover:border-teal/60 px-2.5 py-1 rounded-lg"
      >
        <Zap size={11} />
        Register
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-0.5 bg-transparent border-none cursor-pointer text-sky/40 hover:text-sky transition-colors ml-1"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function HomePage({ onAuth }) {
  useScrollToHash()
  const [showPoster, setShowPoster] = useState(() => !sessionStorage.getItem('posterSeen'))

  return (
    <>
      {showPoster && <ArenaPoster onClose={() => { sessionStorage.setItem('posterSeen', '1'); setShowPoster(false) }} />}
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

      <ArenaBanner />
      <AppLaunchToast />
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
