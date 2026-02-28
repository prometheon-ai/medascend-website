import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Features from './components/Features'
import StudyHub from './components/StudyHub'
import PracticeZone from './components/PracticeZone'
import AIZone from './components/AIZone'
import MoreFeatures from './components/MoreFeatures'
import PainPoints from './components/PainPoints'
import Roadmap from './components/Roadmap'
import Founder from './components/Founder'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('medascend-theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('medascend-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark text-cream' : 'bg-cream text-dark'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero theme={theme} />
      <Problem theme={theme} />
      <Features theme={theme} />
      <StudyHub theme={theme} />
      <PracticeZone theme={theme} />
      <AIZone theme={theme} />
      <MoreFeatures theme={theme} />
      <PainPoints theme={theme} />
      <Roadmap theme={theme} />
      <Founder theme={theme} />
      <CTA theme={theme} />
      <Footer theme={theme} />
    </div>
  )
}
