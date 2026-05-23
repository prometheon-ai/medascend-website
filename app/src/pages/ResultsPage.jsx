import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, Trophy, ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API = '/api/v1'

export default function ResultsPage() {
  const { contestId } = useParams()
  const { token } = useAuth()
  const activeToken = token || localStorage.getItem('access_token')

  const [myResult, setMyResult] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
    Promise.all([
      fetch(`${API}/arena/events/${contestId}/my-result`, { headers })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
      fetch(`${API}/arena/events/${contestId}/leaderboard`, { headers })
        .then(r => r.ok ? r.json() : [])
        .catch(() => []),
    ])
      .then(([result, lb]) => {
        setMyResult(result)
        const entries = Array.isArray(lb) ? lb : lb.entries ?? lb.results ?? lb.leaderboard ?? []
        setLeaderboard(entries)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [contestId, activeToken])

  // Support both API shapes
  const score = myResult?.total_score ?? myResult?.score ?? '—'
  const correct = myResult?.problems_solved ?? myResult?.correct_answers ?? '—'
  const total = myResult?.total_questions
  const accuracy = myResult?.accuracy_pct != null
    ? `${myResult.accuracy_pct}%`
    : (myResult?.correct_answers != null && myResult?.total_questions > 0)
      ? `${Math.round((myResult.correct_answers / myResult.total_questions) * 100)}%`
      : '—'
  const rank = myResult?.rank ?? '—'

  return (
    <>
      <Helmet>
        <title>Results — MedAscend Arena</title>
      </Helmet>
      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-6">
            <Link
              to="/arena"
              className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline"
            >
              <ArrowLeft size={14} />
              Back to Arena
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold text-cream mb-8">Contest Results</h1>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-sky/50">
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-terracotta/20 bg-terracotta/5 text-terracotta text-sm mb-6">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && (
            <>
              {myResult ? (
                <div className="rounded-2xl border border-teal/15 bg-dark-card p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy size={24} className="text-gold" />
                    <h2 className="text-base font-bold text-cream">Your Performance</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-dark-surface p-4 text-center">
                      <p className="text-xs text-sky/50 mb-1">Rank</p>
                      <p className="text-2xl font-extrabold text-gold">#{rank}</p>
                    </div>
                    <div className="rounded-xl bg-dark-surface p-4 text-center">
                      <p className="text-xs text-sky/50 mb-1">Score</p>
                      <p className="text-2xl font-extrabold text-teal">{score}</p>
                    </div>
                    <div className="rounded-xl bg-dark-surface p-4 text-center">
                      <p className="text-xs text-sky/50 mb-1">Correct</p>
                      <p className="text-2xl font-extrabold text-cream">
                        {correct}
                        {total ? <span className="text-sm text-sky/40">/{total}</span> : null}
                      </p>
                    </div>
                    <div className="rounded-xl bg-dark-surface p-4 text-center">
                      <p className="text-xs text-sky/50 mb-1">Accuracy</p>
                      <p className="text-2xl font-extrabold text-cream">{accuracy}</p>
                    </div>
                  </div>
                </div>
              ) : (
                !error && (
                  <div className="rounded-2xl border border-teal/10 bg-dark-card p-6 mb-8 text-center text-sky/40 text-sm">
                    Your result is not available yet.
                  </div>
                )
              )}

              {leaderboard.length > 0 && (
                <div className="rounded-2xl border border-teal/10 bg-dark-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-teal/10">
                    <h2 className="text-base font-bold text-cream">Leaderboard</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-teal/10">
                          <th className="text-left px-6 py-3 text-xs font-bold text-sky/50 uppercase tracking-wider">Rank</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-sky/50 uppercase tracking-wider">Name</th>
                          <th className="text-right px-6 py-3 text-xs font-bold text-sky/50 uppercase tracking-wider">Score</th>
                          <th className="text-right px-6 py-3 text-xs font-bold text-sky/50 uppercase tracking-wider">Correct</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, i) => {
                          const isMe = entry.is_current_user || (myResult && entry.rank === myResult.rank)
                          const entryRank = entry.rank ?? i + 1
                          return (
                            <tr
                              key={entry.user_id || i}
                              className={`border-b border-teal/5 transition-colors ${isMe ? 'bg-teal/5' : 'hover:bg-dark-surface/50'}`}
                            >
                              <td className="px-6 py-3.5">
                                <span className={`font-bold ${entryRank === 1 ? 'text-gold' : entryRank === 2 ? 'text-sky/70' : entryRank === 3 ? 'text-terracotta/80' : 'text-sky/40'}`}>
                                  #{entryRank}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-cream font-medium">
                                {entry.full_name ?? entry.name ?? `User ${i + 1}`}
                                {isMe && <span className="ml-2 text-xs text-teal font-semibold">(you)</span>}
                              </td>
                              <td className="px-6 py-3.5 text-right font-bold text-teal">
                                {entry.total_score ?? entry.score ?? '—'}
                              </td>
                              <td className="px-6 py-3.5 text-right text-sky/60">
                                {entry.problems_solved ?? entry.correct_answers ?? '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {leaderboard.length === 0 && !error && (
                <div className="text-center py-12 text-sky/40 text-sm">
                  Leaderboard not yet available.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
