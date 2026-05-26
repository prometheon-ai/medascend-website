import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Mail, Phone, GraduationCap, Building2, ChevronDown } from 'lucide-react'
import faviconImg from '../assets/favicon.png'
import { useAuth } from '../context/AuthContext'

function Avatar({ user, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt="" className={`${dim} rounded-full object-cover border border-teal/20 shrink-0`} referrerPolicy="no-referrer" />
  }
  return (
    <span className={`${dim} rounded-full bg-teal/20 border border-teal/30 text-teal-light font-bold flex items-center justify-center shrink-0`}>
      {initials}
    </span>
  )
}

function UserCard({ user, onClose, onLogout }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const enrollYear = user.batch_year ?? (user.year_of_study ? new Date().getFullYear() - user.year_of_study + 1 : null)
  const gradYear = enrollYear ? enrollYear + 5 : null
  const batch = enrollYear && gradYear ? `${enrollYear} – ${gradYear}` : null

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : user.email?.[0]?.toUpperCase() || '?'

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-teal/15 bg-dark-card shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-teal/10">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover border-2 border-teal/25 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-teal/20 border-2 border-teal/30 text-teal font-bold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-cream truncate">{user.full_name || '—'}</p>
          {user.role === 'admin' && (
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Admin</span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-3 space-y-2.5">
        {user.college && (
          <div className="flex items-start gap-2.5">
            <Building2 size={13} className="text-sky/40 mt-0.5 shrink-0" />
            <p className="text-xs text-sky/70 leading-relaxed">{user.college}</p>
          </div>
        )}
        {batch && (
          <div className="flex items-center gap-2.5">
            <GraduationCap size={13} className="text-sky/40 shrink-0" />
            <p className="text-xs text-sky/70">Batch {batch}</p>
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-2.5">
            <Mail size={13} className="text-sky/40 shrink-0" />
            <p className="text-xs text-sky/70 truncate">{user.email}</p>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-sky/40 shrink-0" />
            <p className="text-xs text-sky/70">{user.phone}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-1 flex gap-2 border-t border-teal/10 mt-1">
        <Link
          to="/arena/profile"
          onClick={onClose}
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl border border-teal/20 text-teal hover:bg-teal/8 transition-colors no-underline"
        >
          View Profile
        </Link>
        <button
          onClick={onLogout}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border border-terracotta/20 text-terracotta/80 hover:bg-terracotta/8 transition-colors cursor-pointer bg-transparent"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    </div>
  )
}

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
  const isAdmin = user?.role === 'admin'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setCardOpen(false)
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
        <div className="max-w-350 mx-auto px-4 flex items-center justify-between h-17">

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
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={(e) => handleAnchorClick(e, l.to)}
                className={`text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
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
              className={`relative ml-1 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
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
                {isAdmin && (
                  <Link to="/arena/admin" className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold no-underline hover:border-gold/40 hover:bg-gold/15">
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setCardOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-teal/8 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <Avatar user={user} size="sm" />
                    <span className="text-[13px] font-semibold text-cream">{user.full_name?.split(' ')[0] || user.email}</span>
                    <ChevronDown size={13} className={`text-sky/40 transition-transform ${cardOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {cardOpen && (
                    <UserCard
                      user={user}
                      onClose={() => setCardOpen(false)}
                      onLogout={() => { setCardOpen(false); logout() }}
                    />
                  )}
                </div>
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
              {isAdmin ? (
                <div className="flex flex-col items-center gap-2">
                  <Link to="/arena/profile" className="flex items-center gap-2 no-underline hover:text-teal-light transition-colors group">
                    <Avatar user={user} size="lg" />
                    <span className="text-base font-semibold text-cream group-hover:text-teal-light">{user.full_name?.split(' ')[0] || user.email}</span>
                  </Link>
                  <Link to="/arena/admin" className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold no-underline hover:border-gold/40 hover:bg-gold/15">
                    Admin
                  </Link>
                </div>
              ) : (
                <Link to="/arena/profile" className="flex items-center gap-2 no-underline hover:text-teal-light transition-colors group">
                  <Avatar user={user} size="lg" />
                  <span className="text-base font-semibold text-cream group-hover:text-teal-light">{user.full_name?.split(' ')[0] || user.email}</span>
                </Link>
              )}
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
