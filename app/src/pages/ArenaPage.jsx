import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Zap, Trophy, Clock, Users, AlertCircle, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE, readApiErrorMessage, getArenaQuizDetail } from '../lib/api'
import QuizRegistrationModal from '../components/QuizRegistrationModal'

const DIFFICULTY_COLORS = {
  easy: 'text-teal bg-teal/10 border-teal/20',
  medium: 'text-gold bg-gold/10 border-gold/20',
  hard: 'text-terracotta bg-terracotta/10 border-terracotta/20',
}

function normalizeArenaPayload(payload) {
  const activeStatuses = new Set(['live', 'lobby', 'published', 'results_published'])

  if (Array.isArray(payload)) {
    const ended = payload.filter(c => !activeStatuses.has(c.status))
    return {
      live_events: payload.filter(c => c.status === 'live'),
      upcoming_events: payload.filter(c => c.status === 'lobby' || c.status === 'published'),
      recent_results: payload.filter(c => c.status === 'results_published'),
      ended_events: ended,
    }
  }

  if (!payload || typeof payload !== 'object') {
    return { live_events: [], upcoming_events: [], recent_results: [], ended_events: [] }
  }

  if (payload.live_events || payload.upcoming_events || payload.recent_results) {
    return {
      ...payload,
      ended_events: payload.ended_events || [],
    }
  }

  const quizzes = Array.isArray(payload.quizzes) ? payload.quizzes : []
  const ended = quizzes.filter(c => !activeStatuses.has(c.status))
  return {
    live_events: quizzes.filter(c => c.status === 'live'),
    upcoming_events: quizzes.filter(c => c.status === 'lobby' || c.status === 'published'),
    recent_results: quizzes.filter(c => c.status === 'results_published'),
    ended_events: ended,
  }
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-IN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
}

// Returns { label, secsLeft } — secsLeft is the raw seconds remaining (or null)
function useCountdown(targetDate) {
  const [secsLeft, setSecsLeft] = useState(null)
  useEffect(() => {
    if (!targetDate) { setSecsLeft(null); return }
    const tick = () => {
      const diff = new Date(targetDate) - Date.now()
      setSecsLeft(Math.max(0, Math.floor(diff / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return secsLeft
}

function fmtCountdown(secs, prefix = '') {
  if (secs === null) return ''
  if (secs <= 0) return ''
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const time = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`
  return prefix ? `${prefix} ${time}` : time
}

function useRegistrationCountdown(closesAt) {
  const secs = useCountdown(closesAt)
  if (secs === null) return ''
  if (secs <= 0) return 'closed'
  return fmtCountdown(secs, 'Closes in')
}

const LOBBY_WINDOW_SECS = 2 * 60 // show Enter Lobby button when starts_at - now <= 2 min

function ContestCard({ contest: initialContest, token, onAuth, onRegistered, onWalletChanged }) {
  const [contest, setContest] = useState(initialContest)
  useEffect(() => { setContest(initialContest) }, [initialContest.id])
  const [showModal, setShowModal] = useState(false)
  const [participated, setParticipated] = useState(null) // null = unknown

  // For live+registered contests, fetch detail once to check participated
  useEffect(() => {
    if (contest.status !== 'live' || !contest.is_registered || !token) return
    getArenaQuizDetail(token, contest.id)
      .then(d => setParticipated(d?.my_registration?.participated ?? false))
      .catch(() => {})
  }, [contest.id, contest.status, contest.is_registered, token])

  const regCountdown = useRegistrationCountdown(
    contest.registration_closes_at ?? null
  )

  // Seconds until quiz starts — drives lobby window logic
  const secsToStart = useCountdown(
    contest.is_registered && (contest.status === 'published' || contest.status === 'lobby')
      ? contest.starts_at
      : null
  )
  // lobby window open when <= 2 min to start
  const lobbyWindowOpen = secsToStart !== null && secsToStart <= LOBBY_WINDOW_SECS
  const lobbyCountdownLabel = !lobbyWindowOpen && secsToStart !== null && secsToStart > 0 && secsToStart <= 86400
    ? fmtCountdown(secsToStart - LOBBY_WINDOW_SECS, 'Lobby opens in')
    : ''

  const openModal = () => {
    if (!token) { onAuth(); return }
    setShowModal(true)
  }

  const handleRegistered = (id) => {
    setContest(c => ({ ...c, is_registered: true }))
    onRegistered(id)
  }

  const difficultyClass = DIFFICULTY_COLORS[contest.difficulty] || 'text-sky bg-sky/10 border-sky/20'
  const entryLabel = !contest.entry_fee ? 'Free' : `₹${(contest.entry_fee / 100).toLocaleString('en-IN')}`
  const prizeLabel = contest.prize_pool_estimate > 0
    ? `₹${(contest.prize_pool_estimate / 100).toLocaleString('en-IN')} prize pool`
    : null
  const RegisterBtn = ({ label = 'Register' }) => (
    <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 bg-teal text-cream text-sm font-semibold rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none">
      {label}
    </button>
  )

  const ActionButton = () => {
    // Compute registration cutoff:
    // 1. Use registration_closes_at if present
    // 2. For paid contests: T-15min cutoff from starts_at
    // 3. For free contests: open until starts_at
    // 4. Fall back to is_registration_open flag
    const now = Date.now()
    let canRegister
    if (contest.registration_closes_at) {
      canRegister = new Date(contest.registration_closes_at) > now
    } else if (contest.starts_at) {
      const cutoff = new Date(contest.starts_at).getTime() - 15 * 60 * 1000
      canRegister = now < cutoff
    } else {
      canRegister = contest.is_registration_open !== false
    }
    const isRegistered = contest.is_registered
    const { status } = contest

    if (status === 'published' || status === 'lobby' || status === 'registration_open') {
      if (isRegistered) {
        if (!lobbyWindowOpen) return (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-green-400">Registered ✓</span>
            {lobbyCountdownLabel && (
              <span className="text-[11px] text-sky/70 font-medium">{lobbyCountdownLabel}</span>
            )}
          </div>
        )
        return (
          <Link
            to={`/arena/${contest.id}/lobby`}
            state={{ registeredCount: contest.registered_count }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal/15 border border-teal/30 text-teal-light text-sm font-semibold rounded-xl hover:bg-teal/25 transition-all no-underline"
          >
            Enter Lobby →
          </Link>
        )
      }
      if (!canRegister) return <span className="text-xs text-sky/60 font-semibold">Registration closed</span>
      if (!token) return <button onClick={onAuth} className="flex items-center gap-2 px-4 py-2 bg-teal text-cream text-sm font-semibold rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none">Register</button>
      return <RegisterBtn />
    }

    if (status === 'live') {
      if (isRegistered) {
        if (participated === true) return <span className="text-sm font-bold text-white/80">Attempted</span>
        return (
          <Link to={`/arena/${contest.id}/lobby`} state={{ registeredCount: contest.registered_count }} className="flex items-center gap-1.5 px-4 py-2 bg-teal text-cream text-sm font-bold rounded-xl hover:bg-teal/90 transition-all no-underline">
            <Zap size={14} /> Join Now
          </Link>
        )
      }
      if (!token) return <button onClick={onAuth} className="flex items-center gap-1.5 px-4 py-2 bg-teal text-cream text-sm font-bold rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none"><Zap size={14} /> Join Now</button>
      return <span className="text-xs font-bold text-terracotta/80">Missed</span>
    }

    if (status === 'results_published') return (
      <div className="flex flex-col items-end gap-1">
        {isRegistered && <span className="text-[11px] font-bold italic text-green-400">Finished</span>}
        <Link to={`/arena/${contest.id}/results`} className="px-4 py-2 border border-teal/30 text-teal-light text-sm font-semibold rounded-xl hover:bg-teal/10 transition-all no-underline">
          View Results
        </Link>
      </div>
    )

    if (status === 'ended') return (
      <div className="flex flex-col items-end gap-1">
        {isRegistered && <span className="text-[11px] font-bold italic text-green-400">Finished</span>}
        <Link to={`/arena/${contest.id}/results`} className="px-4 py-2 border border-sky/30 text-sky/80 text-sm font-semibold rounded-xl hover:bg-sky/10 hover:text-sky transition-all no-underline">
          View Results
        </Link>
      </div>
    )

    return <span className="text-xs text-sky/60 font-semibold">Ended</span>
  }

  return (
    <div className="rounded-2xl border border-teal/10 bg-dark-card p-6 flex flex-col gap-4 hover:border-teal/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {contest.status === 'live' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/15 text-green-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                LIVE
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${difficultyClass}`}>
              {contest.difficulty?.charAt(0).toUpperCase() + contest.difficulty?.slice(1)}
            </span>
          </div>
          <h3 className="text-base font-bold text-cream leading-snug">{contest.title}</h3>
        </div>
        <div className="shrink-0">
          <ActionButton />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-sky/80">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-sky/60" />
          <span>{formatDate(contest.starts_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-cream/80">{contest.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-sky/60" />
          <span>{contest.registered_count ?? 0} registered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${!contest.entry_fee ? 'text-teal' : 'text-gold'}`}>
            {entryLabel}
          </span>
        </div>
      </div>

      {prizeLabel && (
        <div className="flex items-center gap-2 text-xs font-semibold text-gold">
          <Trophy size={13} />
          {prizeLabel}
        </div>
      )}

      {regCountdown && regCountdown !== 'closed' && (
        <div className="text-xs text-sky/65 font-medium">{regCountdown}</div>
      )}

      {showModal && (
        <QuizRegistrationModal
          contest={contest}
          token={token}
          onAuth={onAuth}
          onClose={() => setShowModal(false)}
          onRegistered={handleRegistered}
          onWalletChanged={onWalletChanged}
        />
      )}
    </div>
  )
}

function ContestSection({ title, contests, token, onAuth, onRegistered, onWalletChanged }) {
  if (!contests || contests.length === 0) return null
  return (
    <div className="mb-10">
      <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${title === 'Live Now' ? 'text-green-400' : 'text-sky/60'}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contests.map(c => (
          <ContestCard
            key={c.id}
            contest={c}
            token={token}
            onAuth={onAuth}
            onRegistered={onRegistered}
            onWalletChanged={onWalletChanged}
          />
        ))}
      </div>
    </div>
  )
}

export default function ArenaPage({ onAuth }) {
  const navigate = useNavigate()
  const { user, token, loading: authLoading } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)
  const [registered, setRegistered] = useState({})
  const activeToken = token || localStorage.getItem('access_token')

  useEffect(() => {
    if (authLoading) return
    setNeedsAuth(false)
    setError('')
    if (!activeToken) {
      setLoading(false)
      setData(null)
      return
    }

    const headers = {}
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`
    fetch(`${API_BASE}/arena/`, { headers })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          setNeedsAuth(true)
          return null
        }
        if (!res.ok) throw new Error(await readApiErrorMessage(res, 'Failed to load contests'))
        return res.json()
      })
      .then(d => { if (d) setData(normalizeArenaPayload(d)) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [activeToken, authLoading])

  const handleRegistered = (id) => setRegistered(p => ({ ...p, [id]: true }))

  const withRegistered = (contests) =>
    contests?.map(c => registered[c.id] ? { ...c, is_registered: true } : c) ?? []

  const allLive = withRegistered(data?.live_events)
  const upcomingEvents = withRegistered(data?.upcoming_events)
  const recentResults = withRegistered(data?.recent_results)
  const endedEvents = withRegistered(data?.ended_events)
  const finishedContests = [...recentResults, ...endedEvents].reduce((items, contest) => {
    if (items.some(item => item.id === contest.id)) return items
    return [...items, contest]
  }, [])

  // Backend merges lobby+live into live_events — split them back
  const liveEvents = allLive.filter(c => c.status === 'live')
  const liveLobbyEvents = allLive.filter(c => c.status === 'lobby')
  const lobbyEvents = [...liveLobbyEvents, ...upcomingEvents.filter(c => c.status === 'lobby')]
  const publishedOpen = upcomingEvents.filter(c => c.status === 'published' && c.is_registration_open !== false)
  const publishedSoon = upcomingEvents.filter(c => c.status === 'published' && c.is_registration_open === false)
  const hasLive = liveEvents.length > 0
  const isEmpty = allLive.length === 0 && upcomingEvents.length === 0 && finishedContests.length === 0

  return (
    <>
      <Helmet>
        <title>Arena — MedAscend</title>
        <meta name="description" content="Compete in timed MCQ contests. Test your medical knowledge against peers in real-time." />
      </Helmet>
      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-6xl mx-auto px-6 py-12">

          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-cream tracking-tight">MedAscend Arena</h1>
                {hasLive && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/15 text-green-400 text-xs font-bold border border-green-400/20">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                    LIVE
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => navigate('/arena/wallet')}
                className="inline-flex items-center gap-2 rounded-xl border border-teal/20 bg-dark-card px-4 py-2 text-sm font-semibold text-cream transition-colors hover:border-teal/40 hover:bg-teal/10"
              >
                <Wallet size={16} className="text-teal" />
                Wallet
              </button>
            </div>
            <p className="text-sky/70 text-sm font-family-secondary">
              Compete in timed MCQ contests. Test your medical knowledge against peers in real-time.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-sky/50">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Loading contests...</span>
            </div>
          )}

          {(needsAuth) && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <Trophy size={40} className="text-teal/40" />
              <div>
                <p className="text-lg font-bold text-cream mb-2">Login to access the Arena</p>
                <p className="text-sm text-sky/60">Register or log in to view contests and compete.</p>
              </div>
              <button
                onClick={onAuth}
                className="px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none"
              >
                Login / Register
              </button>
            </div>
          )}

          {error && !needsAuth && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-terracotta/20 bg-terracotta/5 text-terracotta text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && !error && !needsAuth && !activeToken && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <Trophy size={40} className="text-teal/40" />
              <div>
                <p className="text-lg font-bold text-cream mb-2">Login to access the Arena</p>
                <p className="text-sm text-sky/60">Register or log in to view contests and compete.</p>
              </div>
              <button
                onClick={onAuth}
                className="px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none"
              >
                Login / Register
              </button>
            </div>
          )}

          {!loading && !error && data && activeToken && (
            <>
              {isEmpty ? (
                <div className="text-center py-24 text-sky/40">
                  <Trophy size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm">No contests right now. Check back soon.</p>
                </div>
              ) : (
                <>
                  <ContestSection
                    title="Live Now"
                    contests={liveEvents}
                    token={activeToken}
                    onAuth={onAuth}
                    onRegistered={handleRegistered}
                  />
                  <ContestSection
                    title="Register Now"
                    contests={[...lobbyEvents, ...publishedOpen]}
                    token={activeToken}
                    onAuth={onAuth}
                    onRegistered={handleRegistered}
                  />
                  <ContestSection
                    title="Coming Soon"
                    contests={publishedSoon}
                    token={activeToken}
                    onAuth={onAuth}
                    onRegistered={handleRegistered}
                  />
                  <ContestSection
                    title="Recent Results"
                    contests={finishedContests}
                    token={activeToken}
                    onAuth={onAuth}
                    onRegistered={handleRegistered}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
