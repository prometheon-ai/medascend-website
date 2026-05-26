import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Users, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getArenaDashboard, getArenaQuizDetail } from '../lib/api'

function useCountdown(targetDate) {
  const [secondsLeft, setSecondsLeft] = useState(null)
  useEffect(() => {
    if (!targetDate) return
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(targetDate) - Date.now()) / 1000))
      setSecondsLeft(diff)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return secondsLeft
}

function formatCountdown(secs) {
  if (secs === null) return '—'
  if (secs <= 0) return 'Starting now'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const AVATAR_COLORS = [
  'bg-teal/30 text-teal border-teal/40',
  'bg-sky/25 text-sky border-sky/35',
  'bg-gold/25 text-gold border-gold/35',
  'bg-violet-500/25 text-violet-300 border-violet-500/35',
  'bg-emerald-500/25 text-emerald-300 border-emerald-500/35',
  'bg-rose-500/25 text-rose-300 border-rose-500/35',
  'bg-amber-500/25 text-amber-300 border-amber-500/35',
  'bg-cyan-500/25 text-cyan-300 border-cyan-500/35',
]

function ParticipantAvatar({ index, visible }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const label = String.fromCharCode(65 + (index % 26))
  return (
    <div
      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${color} ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
    >
      {label}
    </div>
  )
}

function ParticipantsGrid({ count, maxDisplay = 24 }) {
  const display = Math.min(count, maxDisplay)
  const hasMore = count > maxDisplay

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Array.from({ length: display }).map((_, i) => (
        <ParticipantAvatar key={i} index={i} visible={true} />
      ))}
      {hasMore && (
        <div className="w-10 h-10 rounded-full border-2 border-teal/20 bg-dark-surface flex items-center justify-center text-[10px] font-bold text-teal/60">
          +{count - maxDisplay}
        </div>
      )}
    </div>
  )
}

function AnimatedParticipants({ targetCount, maxDisplay = 24 }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (targetCount === 0) return
    setVisibleCount(0)
    const total = Math.min(targetCount, maxDisplay)
    let i = 0
    const tick = () => {
      i++
      setVisibleCount(i)
      if (i < total) {
        // Stagger: first few fast, then slow down
        const delay = i < 5 ? 80 : i < 10 ? 120 : i < 18 ? 180 : 300
        setTimeout(tick, delay)
      }
    }
    const startDelay = setTimeout(tick, 200)
    return () => clearTimeout(startDelay)
  }, [targetCount, maxDisplay])

  const display = Math.min(targetCount, maxDisplay)
  const hasMore = targetCount > maxDisplay

  return (
    <div className="flex flex-wrap justify-center gap-2 min-h-12">
      {Array.from({ length: display }).map((_, i) => (
        <ParticipantAvatar key={i} index={i} visible={i < visibleCount} />
      ))}
      {hasMore && visibleCount >= maxDisplay && (
        <div className="w-10 h-10 rounded-full border-2 border-teal/20 bg-dark-surface flex items-center justify-center text-[10px] font-bold text-teal/60">
          +{targetCount - maxDisplay}
        </div>
      )}
    </div>
  )
}

export default function LobbyPage() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { state: routeState } = useLocation()
  const { token, loading: authLoading } = useAuth()
  const activeToken = token || localStorage.getItem('access_token')

  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [participantCount, setParticipantCount] = useState(routeState?.registeredCount ?? 0)
  const pollRef = useRef(null)

  const secondsLeft = useCountdown(contest?.starts_at)
  const canStart = contest && (contest.status === 'live' || secondsLeft === 0)
  const isLobby = contest?.status === 'lobby'
  const isUrgent = secondsLeft !== null && secondsLeft <= 60 && secondsLeft > 0

  // Auto-navigate to quiz when contest goes live
  useEffect(() => {
    if (canStart) navigate(`/arena/${contestId}/quiz`, { replace: true })
  }, [canStart])

  const fetchContest = useCallback(async () => {
    if (!activeToken) return
    try {
      const [detail, dashboard] = await Promise.all([
        getArenaQuizDetail(activeToken, contestId).catch(() => null),
        getArenaDashboard(activeToken, contestId).catch(() => null),
      ])
      const dashboardContest = dashboard?.contest ?? dashboard
      const detailContest = detail ?? {}
      const c = { ...detailContest, ...dashboardContest }
      if (!c || Object.keys(c).length === 0) return
      setContest({ ...c, difficulty: c.difficulty ?? null })
      if (c.registered_count != null) setParticipantCount(c.registered_count)
    } catch {
      // silent — initial load already handles error display
    }
  }, [activeToken, contestId])

  useEffect(() => {
    if (authLoading) return
    if (!activeToken) { navigate('/arena'); return }

    Promise.all([
      getArenaQuizDetail(activeToken, contestId).catch(err => { setError(err.message); return null }),
      getArenaDashboard(activeToken, contestId).catch(() => null),
    ])
      .then(([detail, dashboard]) => {
        const dashboardContest = dashboard?.contest ?? dashboard
        const detailContest = detail ?? {}
        const c = { ...detailContest, ...dashboardContest }
        if (!c || Object.keys(c).length === 0) return
        setContest({ ...c, difficulty: c.difficulty ?? null })
        if (c.registered_count != null) setParticipantCount(c.registered_count)
      })
      .catch(() => setError('Unable to load lobby right now.'))
      .finally(() => setLoading(false))
  }, [contestId, activeToken, authLoading])

  // Poll for participant count + status updates every 15s while in lobby/published
  useEffect(() => {
    if (!contest) return
    if (contest.status === 'live' || contest.status === 'ended') return

    pollRef.current = setInterval(fetchContest, 15000)
    return () => clearInterval(pollRef.current)
  }, [contest?.status, fetchContest])


  return (
    <>
      <Helmet>
        <title>{contest ? `${contest.title} — Lobby` : 'Lobby'} — MedAscend</title>
      </Helmet>
      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-lg mx-auto px-6 py-12">
          <div className="mb-6">
            <Link to="/arena" className="text-xs text-sky/50 hover:text-teal transition-colors no-underline">
              ← Back to Arena
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-sky/50">
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}

          {error && !contest && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-terracotta/20 bg-terracotta/5 text-terracotta text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && contest && (
            <div className="space-y-4">
              {/* Header card */}
              <div className="rounded-2xl border border-teal/15 bg-dark-card p-6 text-center">
                {contest.difficulty && (
                  <div className="mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      contest.difficulty === 'easy' ? 'text-teal bg-teal/10 border-teal/20'
                      : contest.difficulty === 'hard' ? 'text-terracotta bg-terracotta/10 border-terracotta/20'
                      : 'text-gold bg-gold/10 border-gold/20'
                    }`}>
                      {contest.difficulty.charAt(0).toUpperCase() + contest.difficulty.slice(1)}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl font-extrabold text-cream leading-tight mb-1">{contest.title}</h1>
                <p className="text-xs text-sky/50">{contest.duration_minutes} min · {contest.question_count} questions</p>
              </div>

              {/* Countdown card */}
              {!canStart && secondsLeft !== null && (
                <div className="rounded-2xl border border-teal/10 bg-dark-card p-8 text-center">
                  <p className="text-xs font-semibold text-sky/50 uppercase tracking-widest mb-4">Starts in</p>
                  <p className={`text-6xl font-extrabold tabular-nums tracking-tight transition-colors ${isUrgent ? 'text-terracotta animate-pulse' : 'text-teal'}`}>
                    {formatCountdown(secondsLeft)}
                  </p>
                  <p className="text-xs text-sky/35 mt-4">Stay here — the Start button will appear when the contest goes live.</p>
                </div>
              )}

              {/* Live — auto-redirecting */}
              {canStart && (
                <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-sm font-bold text-green-400">Contest is live — entering quiz...</p>
                    <Loader2 size={16} className="animate-spin text-green-400" />
                  </div>
                </div>
              )}

              {/* Participants joining */}
              <div className="rounded-2xl border border-teal/10 bg-dark-card p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky/70 mb-4">
                  <Users size={15} className="text-teal" />
                  Participants joined
                  {isLobby && <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse ml-1" />}
                </div>
                <AnimatedParticipants targetCount={participantCount} maxDisplay={24} />
                {isLobby && (
                  <p className="text-[11px] text-sky/35 text-center mt-3">Updating every 15s as more join</p>
                )}
              </div>

              {/* Contest details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-dark-card border border-teal/8 p-4 text-center">
                  <p className="text-[11px] text-sky/45 mb-1">Entry fee</p>
                  <p className="text-sm font-bold text-cream">
                    {contest.entry_fee ? `₹${(contest.entry_fee / 100).toLocaleString('en-IN')}` : 'Free'}
                  </p>
                </div>
                <div className="rounded-xl bg-dark-card border border-teal/8 p-4 text-center">
                  <p className="text-[11px] text-sky/45 mb-1">Prize pool</p>
                  <p className="text-sm font-bold text-cream">
                    {contest.prize_pool ? `₹${(contest.prize_pool / 100).toLocaleString('en-IN')}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
