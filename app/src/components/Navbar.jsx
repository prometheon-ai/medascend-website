import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import faviconImg from '../assets/favicon.png'

export default function Navbar({ onEarlyAccess }) {
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

  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/features/study-hub', label: 'Study Hub' },
    { to: '/features/practice-zone', label: 'Practice' },
    { to: '/features/ai-zone', label: 'AI Zone' },
  ]

  const isActive = (to) => location.pathname === to

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b
        ${scrolled ? 'shadow-lg' : ''}
        bg-dark/85 border-teal/10`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img src={faviconImg} alt="Prometheon Logo" className="w-[34px] h-[34px] rounded-lg object-contain" />
            <div className="flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[1.2px] font-bold leading-none mb-1 text-teal-light">
                Prometheon Applied
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[1.2px] font-bold leading-none mb-1 text-teal-light">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive(l.to)
                    ? 'text-cream bg-teal/15'
                    : 'text-sky hover:text-cream hover:bg-teal/10'
                  }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={onEarlyAccess}
              className="hidden sm:inline-flex text-[13px] font-semibold px-5 py-2.5 bg-teal text-cream rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all duration-200 cursor-pointer border-none">
              Get Early Access
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-current cursor-pointer bg-transparent border-none"
              aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 pt-[68px] transition-all duration-300 backdrop-blur-xl
        ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        bg-dark/95`}>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-xl font-semibold px-6 py-3 rounded-xl transition-all
                ${isActive(l.to)
                  ? 'text-cream bg-teal/15'
                  : 'text-cream hover:bg-teal/10'
                }`}>
              {l.label}
            </Link>
          ))}
          <button onClick={() => { setMobileOpen(false); onEarlyAccess() }}
            className="mt-4 text-base font-semibold px-8 py-3 bg-teal text-cream rounded-xl cursor-pointer border-none">
            Get Early Access
          </button>
        </div>
      </div>
    </>
  )
}
