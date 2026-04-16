import { useEffect, useState } from 'react'
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
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <div className="min-h-screen bg-dark text-cream">
      <ScrollToTop />
      <Navbar onEarlyAccess={openModal} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onEarlyAccess={openModal} />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/study-hub" element={<StudyHubPage />} />
          <Route path="/features/practice-zone" element={<PracticeZonePage />} />
          <Route path="/features/ai-zone" element={<AIZonePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <EarlyAccessModal isOpen={modalOpen} onClose={closeModal} />
    </div>
  )
}
