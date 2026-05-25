import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Zap, Trophy, Clock, Users, AlertCircle, Wallet, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE, readApiErrorMessage } from '../lib/api'

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
  })
}

function ContestCard({ contest: initialContest, token, onAuth, onRegistered, onWalletChanged }) {
  const [contest, setContest] = useState(initialContest)
  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState('')

  const handleRegister = async () => {
    if (!token) { onAuth(); return }
    setRegistering(true)
    setRegError('')
    try {
      const res = await fetch(`${API_BASE}/arena/quizzes/${contest.id}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'wallet' }),
      })
      if (res.status === 409) {
        setContest(c => ({ ...c, is_registered: true }))
        onRegistered(contest.id)
        return
      }
      if (res.status === 401) {
        onAuth()
        return
      }
      if (!res.ok) {
        throw new Error(await readApiErrorMessage(res, 'Registration failed'))
      }
      setContest(c => ({ ...c, is_registered: true }))
      onRegistered(contest.id)
      onWalletChanged?.()
    } catch (err) {
      setRegError(err.message)
    } finally {
      setRegistering(false)
    }
  }

  const difficultyClass = DIFFICULTY_COLORS[contest.difficulty] || 'text-sky bg-sky/10 border-sky/20'
  const entryLabel = !contest.entry_fee ? 'Free' : `₹${(contest.entry_fee / 100).toLocaleString('en-IN')}`
  const prizeLabel = contest.prize_pool_estimate > 0
    ? `₹${(contest.prize_pool_estimate / 100).toLocaleString('en-IN')} prize pool`
    : null

  const ActionButton = () => {
    if (contest.status === 'published') {
      return <span className="text-xs text-sky/50 font-medium">Registration opens soon</span>
    }

    if (contest.status === 'live') {
      return (
        <Link
          to={`/arena/${contest.id}/lobby`}
          state={{ registeredCount: contest.registered_count }}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal text-cream text-sm font-bold rounded-xl hover:bg-teal/90 transition-all no-underline"
        >
          <Zap size={14} />
          Join Now
        </Link>
      )
    }

    if (contest.status === 'lobby') {
      if (!token) {
        return (
          <button
            onClick={onAuth}
            className="px-4 py-2 bg-teal text-cream text-sm font-semibold rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none"
          >
            Register
          </button>
        )
      }
      if (contest.is_registered) {
        return (
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-semibold text-green-400">Registered ✓</span>
            <Link
              to={`/arena/${contest.id}/lobby`}
              state={{ registeredCount: contest.registered_count }}
              className="text-xs font-bold text-cream/60 hover:text-cream border border-cream/15 hover:border-cream/30 px-3 py-1.5 rounded-lg transition-all no-underline"
            >
              Go to Lobby →
            </Link>
          </div>
        )
      }
      return (
        <button
          onClick={handleRegister}
          disabled={registering}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-cream text-sm font-semibold rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none disabled:opacity-60"
        >
          {registering && <Loader2 size={14} className="animate-spin" />}
          Register
        </button>
      )
    }

    if (contest.status === 'results_published') {
      return (
        <Link
          to={`/arena/${contest.id}/results`}
          className="px-4 py-2 border border-teal/30 text-teal-light text-sm font-semibold rounded-xl hover:bg-teal/10 transition-all no-underline"
        >
          View Results
        </Link>
      )
    }

    return <span className="text-xs text-sky/40 font-medium">Ended</span>
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

      <div className="grid grid-cols-2 gap-3 text-xs text-sky/60">
        <div className="flex items-center gap-1.5">
          <Clock size={13} />
          <span>{formatDate(contest.starts_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sky/80">{contest.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} />
          <span>{contest.registered_count ?? 0} registered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold ${!contest.entry_fee ? 'text-teal' : 'text-gold'}`}>
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

      {regError && <p className="text-xs text-terracotta">{regError}</p>}
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
  const publishedEvents = upcomingEvents.filter(c => c.status === 'published')
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
                    contests={lobbyEvents}
                    token={activeToken}
                    onAuth={onAuth}
                    onRegistered={handleRegistered}
                  />
                  <ContestSection
                    title="Coming Soon"
                    contests={publishedEvents}
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
