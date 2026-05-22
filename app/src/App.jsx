import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import HelpPage from './pages/HelpPage'
import JoinPage from './pages/JoinPage'
import SahAIPage from './pages/SahAIPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' })
  const location = useLocation()
  const isSahAI = location.pathname.startsWith('/sahai')

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const openLogin = () => setAuthModal({ open: true, tab: 'login' })
  const openRegister = () => setAuthModal({ open: true, tab: 'register' })
  const closeAuth = () => setAuthModal(p => ({ ...p, open: false }))

  return (
    <div className="min-h-screen bg-dark text-cream">
      <ScrollToTop />
      {!isSahAI && <Navbar onLogin={openLogin} onRegister={openRegister} />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage onAuth={openLogin} />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/sahai" element={<SahAIPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isSahAI && <Footer />}
      <AuthModal isOpen={authModal.open} onClose={closeAuth} defaultTab={authModal.tab} />
    </div>
  )
}
