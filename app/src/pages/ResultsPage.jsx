import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Trophy, ArrowLeft, AlertCircle, Clock, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { publishAdminArenaResults } from '../lib/api'

const API = '/api/v1'

function StatBox({ label, value, sub, highlight }) {
  return (
    <div className="rounded-xl bg-dark-surface p-4 text-center">
      <p className="text-xs text-sky/50 mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${highlight || 'text-cream'}`}>{value}</p>
      {sub && <p className="text-xs text-sky/40 mt-0.5">{sub}</p>}
    </div>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="font-extrabold text-gold">🥇 #1</span>
  if (rank === 2) return <span className="font-extrabold text-sky/70">🥈 #2</span>
  if (rank === 3) return <span className="font-extrabold text-terracotta/80">🥉 #3</span>
  return <span className="font-bold text-sky/50">#{rank}</span>
}

export default function ResultsPage() {
  const { contestId } = useParams()
  const { user, token } = useAuth()
  const isAdmin = user?.role === 'admin'
  const activeToken = token || localStorage.getItem('access_token')

  const [myResult, setMyResult] = useState(null)   // from /review → .summary
  const [lb, setLb] = useState(null)                // full leaderboard API response
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState('')

  useEffect(() => {
    if (!activeToken) { setLoading(false); return }
    const headers = { Authorization: `Bearer ${activeToken}` }

    Promise.all([
      fetch(`${API}/arena/quizzes/${contestId}/review`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/arena/quizzes/${contestId}/leaderboard`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([review, lbData]) => {
      setMyResult(review?.summary ?? null)
      setLb(lbData)
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [contestId, activeToken])

  const handlePublishResults = async () => {
    if (!window.confirm('Publish results? This will compute ranks, distribute prizes, and award trophies.')) return
    setPublishing(true)
    setPublishMsg('')
    try {
      await publishAdminArenaResults(activeToken, contestId)
      setPublishMsg('Results published! Reloading leaderboard...')
      // reload leaderboard
      const headers = { Authorization: `Bearer ${activeToken}` }
      const lbData = await fetch(`${API}/arena/quizzes/${contestId}/leaderboard`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null)
      setLb(lbData)
    } catch (err) {
      setPublishMsg(`Error: ${err.message}`)
    } finally {
      setPublishing(false)
    }
  }

  const pending = lb?.pending ?? true
  const pendingMessage = lb?.pending_message ?? 'Results will be declared soon.'
  const totalParticipants = lb?.total_participants ?? null
  const myRank = lb?.my_rank ?? null
  const myPrize = lb?.my_prize ?? null
  const entries = lb?.leaderboard ?? []

  // personal stats from /review summary
  const score = myResult?.total_score ?? '—'
  const correct = myResult?.correct ?? '—'
  const total = myResult?.total_questions
  const accuracy = myResult?.accuracy_pct != null ? `${myResult.accuracy_pct.toFixed(1)}%` : '—'
  const bestStreak = myResult?.best_streak ?? null

  // leaderboard is visible to non-admins only when results_published (pending: false)
  const showLeaderboard = isAdmin || !pending

  return (
    <>
      <Helmet><title>Results — MedAscend Arena</title></Helmet>
      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-3xl mx-auto px-6 py-12">

          <div className="mb-6">
            <Link to="/arena" className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline">
              <ArrowLeft size={14} /> Back to Arena
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <h1 className="text-2xl font-extrabold text-cream">Contest Results</h1>
            {totalParticipants != null && (
              <span className="text-xs text-sky/40">{totalParticipants} participants</span>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24 text-sky/50">
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-terracotta/20 bg-terracotta/5 text-terracotta text-sm mb-6">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {!loading && (
            <>
              {/* ── Personal stats (always shown if quiz was taken) ── */}
              {myResult ? (
                <div className="rounded-2xl border border-teal/15 bg-dark-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Trophy size={20} className="text-gold" />
                    <h2 className="text-base font-bold text-cream">Your Performance</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <StatBox label="Score" value={score} highlight="text-teal" />
                    <StatBox label="Correct" value={correct} sub={total ? `out of ${total}` : null} />
                    <StatBox label="Accuracy" value={accuracy} />
                    {bestStreak != null && <StatBox label="Best streak" value={`🔥 ${bestStreak}`} />}
                  </div>
                  {/* rank + prize only after results published */}
                  {!pending && (myRank != null || myPrize != null) && (
                    <div className="flex items-center gap-5 mt-4 pt-4 border-t border-teal/10 flex-wrap">
                      {myRank != null && (
                        <div className="text-sm flex items-center gap-2">
                          <span className="text-sky/50">Your rank</span>
                          <RankBadge rank={myRank} />
                        </div>
                      )}
                      {myPrize != null && myPrize > 0 && (
                        <div className="text-sm flex items-center gap-2">
                          <span className="text-sky/50">Prize won</span>
                          <span className="font-bold text-gold">₹{(myPrize / 100).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                !error && (
                  <div className="rounded-2xl border border-teal/10 bg-dark-card p-6 mb-6 text-center text-sky/40 text-sm">
                    Your result is not available.
                  </div>
                )
              )}

              {/* ── Admin: publish results button ── */}
              {isAdmin && pending && (
                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-cream">Results not published yet</p>
                    <p className="text-xs text-sky/50 mt-0.5">Publishing will compute ranks, distribute prizes and award trophies.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePublishResults}
                    disabled={publishing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/20 border border-gold/30 text-gold text-sm font-semibold hover:bg-gold/30 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {publishing ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    Publish Results
                  </button>
                </div>
              )}
              {publishMsg && (
                <div className={`mb-6 rounded-xl border p-4 text-sm ${publishMsg.startsWith('Error') ? 'border-terracotta/20 bg-terracotta/5 text-terracotta' : 'border-teal/20 bg-teal/5 text-teal-light'}`}>
                  {publishMsg}
                </div>
              )}

              {/* ── Leaderboard ── */}
              {showLeaderboard ? (
                entries.length > 0 ? (
                  <div className="rounded-2xl border border-teal/10 bg-dark-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-teal/10 flex items-center justify-between">
                      <h2 className="text-base font-bold text-cream">Leaderboard</h2>
                      <div className="flex items-center gap-3">
                        {!isAdmin && <p className="text-xs text-sky/40">Top 25</p>}
                        {isAdmin && pending && <span className="text-xs text-gold/70 font-semibold">Admin preview</span>}
                      </div>
                    </div>
                    <div className="divide-y divide-teal/5">
                      {entries.map((entry, i) => {
                        const isMe = entry.is_current_user
                        const entryRank = entry.rank ?? i + 1
                        return (
                          <div
                            key={entry.user_id || i}
                            className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${isMe ? 'bg-teal/8' : 'hover:bg-dark-surface/40'}`}
                          >
                            <div className="w-12 shrink-0 text-sm">
                              <RankBadge rank={entryRank} />
                            </div>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {entry.avatar_url ? (
                                <img src={entry.avatar_url} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0 border border-teal/20" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-teal/15 flex items-center justify-center text-xs font-bold text-teal shrink-0">
                                  {entry.full_name?.[0]?.toUpperCase() ?? '?'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold truncate ${isMe ? 'text-teal' : 'text-cream'}`}>
                                  {entry.full_name ?? `User ${i + 1}`}
                                  {isMe && <span className="ml-1.5 text-xs font-normal text-teal/70">(you)</span>}
                                </p>
                                <p className="text-xs text-sky/40 truncate">{entry.college ?? entry.tier ?? ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-5 shrink-0 text-right text-xs">
                              <div>
                                <p className="text-sky/40">Correct</p>
                                <p className="font-semibold text-cream">{entry.problems_solved ?? '—'}</p>
                              </div>
                              <div>
                                <p className="text-sky/40">Accuracy</p>
                                <p className="font-semibold text-cream">{entry.accuracy_pct != null ? `${entry.accuracy_pct.toFixed(0)}%` : '—'}</p>
                              </div>
                              <div>
                                <p className="text-sky/40">Score</p>
                                <p className="text-base font-extrabold text-teal">{entry.total_score ?? '—'}</p>
                              </div>
                              {entry.prize_amount > 0 && (
                                <div>
                                  <p className="text-sky/40">Prize</p>
                                  <p className="font-semibold text-gold">₹{(entry.prize_amount / 100).toFixed(0)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-teal/10 bg-dark-card p-8 text-center text-sky/40 text-sm">
                    No leaderboard data yet.
                  </div>
                )
              ) : (
                /* Non-admin, results not published */
                <div className="rounded-2xl border border-teal/15 bg-dark-card p-8 text-center">
                  <Clock size={32} className="mx-auto mb-3 text-sky/30" />
                  <p className="text-sm font-semibold text-cream mb-1">Results not published yet</p>
                  <p className="text-xs text-sky/50">{pendingMessage}</p>
                  {totalParticipants != null && (
                    <p className="text-xs text-sky/35 mt-2">{totalParticipants} people took this quiz</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
