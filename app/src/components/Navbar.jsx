import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import faviconImg from '../assets/favicon.png'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#the-problem', label: 'The Problem' },
  { to: '/#the-platform', label: 'The Platform' },
  { to: '/features', label: 'Features' },
  { to: '/#where-we-are', label: 'Where We Are' },
  { to: '/#built-for', label: 'For Students' },
]

export default function Navbar({ onLogin, onRegister }) {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (to) => {
    if (to.includes('#')) return false
    return location.pathname === to
  }

  const handleAnchorClick = (e, to) => {
    if (!to.includes('#')) return
    const [path, hash] = to.split('#')
    if (location.pathname !== '/' && path === '/') {
      return // let Link handle navigation, scroll will happen via useScrollToHash
    }
    e.preventDefault()
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b
        ${scrolled ? 'shadow-lg' : ''}
        bg-dark/85 border-teal/10`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-17">

          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 no-underline shrink-0">
            <img src={faviconImg} alt="MedAscend" className="w-8.5 h-8.5 rounded-lg object-contain" />
            <div className="flex flex-col justify-center">
              <span className="text-base font-extrabold tracking-tight leading-none mb-0.5">
                <span className="text-cream">Med</span><span className="text-gold-light">Ascend</span>
              </span>
              <span className="text-[9px] uppercase tracking-[1.2px] font-semibold leading-none text-teal-light">
                Prometheon Applied Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleAnchorClick(e, l.to)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive(l.to)
                    ? 'text-cream bg-teal/15'
                    : 'text-sky hover:text-cream hover:bg-teal/10'
                  }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/arena"
              className={`relative ml-1 flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200
                ${isActive('/arena')
                  ? 'text-cream bg-green-400/20'
                  : 'text-green-400 hover:text-cream hover:bg-green-400/15'
                }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              Arena
            </Link>
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[13px] font-semibold text-cream px-3 py-2">
                  {user.full_name?.split(' ')[0] || user.email}
                </span>
                <button
                  onClick={logout}
                  title="Logout"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2.5 bg-teal/15 text-teal-light rounded-xl hover:bg-teal/25 transition-all duration-200 cursor-pointer border-none"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:inline-flex text-[13px] font-semibold px-5 py-2.5 bg-teal text-cream rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none"
              >
                Login / Register
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-current cursor-pointer bg-transparent border-none"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 pt-17 transition-all duration-300 backdrop-blur-xl
        ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        bg-dark/95`}>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={(e) => handleAnchorClick(e, l.to)}
              className="text-xl font-semibold px-6 py-3 rounded-xl text-cream hover:bg-teal/10 transition-all"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/arena"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 text-xl font-bold px-6 py-3 rounded-xl text-green-400 hover:bg-green-400/10 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Arena
          </Link>
          {user ? (
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className="text-base font-semibold text-cream">
                {user.full_name?.split(' ')[0] || user.email}
              </span>
              <button
                onClick={() => { setMobileOpen(false); logout() }}
                className="flex items-center gap-2 text-base font-semibold px-8 py-3 bg-teal/15 text-teal-light rounded-xl cursor-pointer border-none"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); onLogin() }}
              className="mt-4 text-base font-semibold px-8 py-3 bg-teal text-cream rounded-xl cursor-pointer border-none"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </>
  )
}
