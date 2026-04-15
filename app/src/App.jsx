import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EarlyAccessModal from './components/EarlyAccessModal'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import StudyHubPage from './pages/StudyHubPage'
import PracticeZonePage from './pages/PracticeZonePage'
import AIZonePage from './pages/AIZonePage'
import RoadmapPage from './pages/RoadmapPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('medascend-theme') || 'dark'
    }
    return 'dark'
  })
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('medascend-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark text-cream' : 'bg-cream text-dark'}`}>
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} onEarlyAccess={openModal} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} onEarlyAccess={openModal} />} />
          <Route path="/features" element={<FeaturesPage theme={theme} />} />
          <Route path="/features/study-hub" element={<StudyHubPage theme={theme} />} />
          <Route path="/features/practice-zone" element={<PracticeZonePage theme={theme} />} />
          <Route path="/features/ai-zone" element={<AIZonePage theme={theme} />} />
          <Route path="/roadmap" element={<RoadmapPage theme={theme} />} />
          <Route path="/about" element={<AboutPage theme={theme} />} />
          <Route path="*" element={<NotFoundPage theme={theme} />} />
        </Routes>
      </main>
      <Footer theme={theme} />
      <EarlyAccessModal isOpen={modalOpen} onClose={closeModal} theme={theme} />
    </div>
  )
}
