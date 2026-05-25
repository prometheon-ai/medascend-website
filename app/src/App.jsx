import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import HelpPage from './pages/HelpPage'
import JoinPage from './pages/JoinPage'
import SahAIPage from './pages/SahAIPage'
import ArenaPage from './pages/ArenaPage'
import ArenaAdminPage from './pages/ArenaAdminPage'
import ArenaWalletPage from './pages/ArenaWalletPage'
import LobbyPage from './pages/LobbyPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' })
  const location = useLocation()
  const navigate = useNavigate()
  const isSahAI = location.pathname.startsWith('/sahai')
  const isQuiz = location.pathname.includes('/quiz')
  const hideChrome = isSahAI || isQuiz

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const openAuth = (tab) => {
    const path = location.pathname
    if (path !== '/') sessionStorage.setItem('authRedirect', path)
    setAuthModal({ open: true, tab })
  }
  const openLogin = () => openAuth('login')
  const openRegister = () => openAuth('register')

  const closeAuth = () => setAuthModal(p => ({ ...p, open: false }))

  const handleAuthSuccess = () => {
    closeAuth()
    const redirect = sessionStorage.getItem('authRedirect')
    if (redirect) {
      sessionStorage.removeItem('authRedirect')
      navigate(redirect)
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark text-cream">
        <ScrollToTop />
        {!hideChrome && <Navbar onLogin={openLogin} onRegister={openRegister} />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage onAuth={openLogin} />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/sahai" element={<SahAIPage />} />
            <Route path="/arena" element={<ArenaPage onAuth={openLogin} />} />
            <Route path="/arena/admin" element={<ArenaAdminPage />} />
            <Route path="/arena/admin/:contestId" element={<ArenaAdminPage />} />
            <Route path="/arena/wallet" element={<ArenaWalletPage onAuth={openLogin} />} />
            <Route path="/arena/:contestId/lobby" element={<LobbyPage />} />
            <Route path="/arena/:contestId/quiz" element={<QuizPage />} />
            <Route path="/arena/:contestId/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!hideChrome && <Footer />}
        <AuthModal isOpen={authModal.open} onClose={closeAuth} onSuccess={handleAuthSuccess} defaultTab={authModal.tab} />
      </div>
    </AuthProvider>
  )
}
