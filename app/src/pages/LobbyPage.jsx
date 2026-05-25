import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Clock, Users, ChevronRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { friendlyArenaAccessMessage } from '../lib/api'

const API = '/api/v1'

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
  if (secs <= 0) return "Starting now"
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function LobbyPage() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { state: routeState } = useLocation()
  const { token, loading: authLoading } = useAuth()

  const registeredCount = routeState?.registeredCount ?? '—'

  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const secondsLeft = useCountdown(contest?.starts_at)
  const canStart = contest && (contest.status === 'live' || secondsLeft === 0)

  useEffect(() => {
    if (authLoading) return
    const activeToken = token
    if (!activeToken) { navigate('/arena'); return }

    const headers = { Authorization: `Bearer ${activeToken}` }
    fetch(`${API}/arena/quizzes/${contestId}/dashboard`, { headers })
      .then(res => {
        if (res.status === 400 || res.status === 403 || res.status === 409) {
          setError(friendlyArenaAccessMessage(res.status))
          setLoading(false)
          return null
        }
        if (!res.ok) throw new Error('Failed to load lobby')
        return res.json()
      })
      .then(d => {
        if (!d) return
        const c = d.contest ?? d
        setContest({
          ...c,
          difficulty: c.difficulty ?? null,
        })
      })
      .catch(() => setError('Unable to load lobby right now.'))
      .finally(() => setLoading(false))
  }, [contestId, token, authLoading])

  const handleStartQuiz = () => {
    navigate(`/arena/${contestId}/quiz`)
  }

  return (
    <>
      <Helmet>
        <title>{contest ? `${contest.title} — Lobby` : 'Lobby'} — MedAscend</title>
      </Helmet>
      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-xl mx-auto px-6 py-16">
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

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-terracotta/20 bg-terracotta/5 text-terracotta text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && !error && contest && (
            <div className="rounded-2xl border border-teal/15 bg-dark-card p-8 text-center">
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

              <h1 className="text-2xl font-extrabold text-cream mb-6 leading-tight">{contest.title}</h1>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl bg-dark-surface p-4">
                  <div className="flex items-center justify-center gap-2 text-sky/50 text-xs mb-1">
                    <Users size={13} />
                    <span>Registered</span>
                  </div>
                  <p className="text-lg font-bold text-cream">{registeredCount}</p>
                </div>
                <div className="rounded-xl bg-dark-surface p-4">
                  <div className="flex items-center justify-center gap-2 text-sky/50 text-xs mb-1">
                    <Clock size={13} />
                    <span>Duration</span>
                  </div>
                  <p className="text-lg font-bold text-cream">{contest.duration_minutes} min</p>
                </div>
              </div>

              {!canStart && secondsLeft !== null && (
                <div className="mb-8">
                  <p className="text-xs text-sky/50 mb-3">Starts in</p>
                  <p className="text-5xl font-extrabold text-teal tabular-nums tracking-tight">
                    {formatCountdown(secondsLeft)}
                  </p>
                  <p className="text-xs text-sky/40 mt-4">Come back when the countdown hits zero.</p>
                </div>
              )}

              {canStart && !error && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-teal mb-5">The contest is live — good luck!</p>
                  <button
                    onClick={handleStartQuiz}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-teal text-cream font-bold text-base rounded-xl hover:bg-teal/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all cursor-pointer border-none"
                  >
                    Start Quiz <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {error && !contest && (
                <p className="text-sm text-sky/60 mt-2">You can still view the lobby state, but quiz access is currently locked.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
