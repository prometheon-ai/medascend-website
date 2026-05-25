import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Loader2,
  Medal,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getArenaMyStats,
  getArenaSubjectMastery,
  getArenaTierHistory,
  getArenaTrophyHistory,
} from '../lib/api'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'tier', label: 'Tier History', icon: Medal },
  { id: 'mastery', label: 'Subject Mastery', icon: BookOpen },
  { id: 'trophies', label: 'Trophy History', icon: Trophy },
]

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-teal/10 bg-dark-card ${className}`}>{children}</div>
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-teal/10 bg-dark-surface p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky/45">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-cream">{value ?? '—'}</p>
      {hint ? <p className="mt-1 text-xs text-sky/55">{hint}</p> : null}
    </div>
  )
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.items)) return value.items
  if (value && Array.isArray(value.results)) return value.results
  if (value && Array.isArray(value.data)) return value.data
  if (value && Array.isArray(value.certificates)) return value.certificates
  if (value && Array.isArray(value.history)) return value.history
  if (value && Array.isArray(value.tier_history)) return value.tier_history
  if (value && Array.isArray(value.subject_mastery)) return value.subject_mastery
  if (value && Array.isArray(value.trophy_history)) return value.trophy_history
  return []
}

function unwrapStats(value) {
  if (!value || typeof value !== 'object') return value || {}
  return value.my_stats_summary || value.stats || value.summary || value.data || value
}

function scoreCardValue(stats, keys) {
  for (const key of keys) {
    const value = stats?.[key]
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object') {
        const nested = value.value ?? value.count ?? value.total ?? value.amount ?? value.label ?? value.name
        if (nested !== undefined && nested !== null && nested !== '') return nested
      } else {
        return value
      }
    }
  }
  return null
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-cream">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-sky/60">{subtitle}</p> : null}
    </div>
  )
}

export default function ArenaProfilePage() {
  const navigate = useNavigate()
  const { user, token, loading: authLoading } = useAuth()
  const activeToken = token || localStorage.getItem('access_token')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sectionErrors, setSectionErrors] = useState({})
  const [stats, setStats] = useState(null)
  const [tierHistory, setTierHistory] = useState([])
  const [subjectMastery, setSubjectMastery] = useState([])
  const [trophyHistory, setTrophyHistory] = useState([])

  useEffect(() => {
    if (authLoading) return
    if (!activeToken) {
      navigate('/arena')
      return
    }

    const load = async () => {
      setLoading(true)
      setError('')
      setSectionErrors({})
      try {
        const [statsResult, tierResult, masteryResult, trophyResult] = await Promise.allSettled([
          getArenaMyStats(activeToken),
          getArenaTierHistory(activeToken, { limit: 20 }),
          getArenaSubjectMastery(activeToken),
          getArenaTrophyHistory(activeToken, { limit: 50 }),
        ])
        const nextSectionErrors = {}

        if (statsResult.status === 'fulfilled') {
          setStats(unwrapStats(statsResult.value))
        } else {
          setStats(null)
          nextSectionErrors.overview = statsResult.reason?.message || 'Failed to load arena stats.'
        }

        if (tierResult.status === 'fulfilled') {
          setTierHistory(asArray(tierResult.value))
        } else {
          setTierHistory([])
          nextSectionErrors.tier = tierResult.reason?.message || 'Failed to load tier history.'
        }

        if (masteryResult.status === 'fulfilled') {
          setSubjectMastery(asArray(masteryResult.value))
        } else {
          setSubjectMastery([])
          nextSectionErrors.mastery = masteryResult.reason?.message || 'Failed to load subject mastery.'
        }

        if (trophyResult.status === 'fulfilled') {
          setTrophyHistory(asArray(trophyResult.value))
        } else {
          setTrophyHistory([])
          nextSectionErrors.trophies = trophyResult.reason?.message || 'Failed to load trophy history.'
        }

        setSectionErrors(nextSectionErrors)

        const failedCount = Object.keys(nextSectionErrors).length
        if (failedCount >= 5) {
          setError('All arena profile sections failed to load.')
        } else if (failedCount > 0) {
          setError('Some arena profile sections could not be loaded.')
        }
      } catch (err) {
        setError(err.message || 'Failed to load arena profile.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [activeToken, authLoading, navigate])

  const overviewCards = useMemo(() => {
    const s = stats || {}
    return [
      { label: 'Trophies', value: formatValue(scoreCardValue(s, ['trophies', 'trophy_count', 'total_trophies', 'trophyPoints'])), hint: 'Arena-wide recognition' },
      { label: 'Tier', value: formatValue(scoreCardValue(s, ['tier', 'current_tier', 'level'])), hint: 'Current rank band' },
      { label: 'Contests', value: formatValue(scoreCardValue(s, ['contests_participated', 'contests', 'participations', 'contests_played'])), hint: 'Joined arena contests' },
      { label: 'Wins', value: formatValue(scoreCardValue(s, ['wins', 'win_count', 'victories'])), hint: 'Finished in winning spots' },
      { label: 'Winnings', value: formatValue(scoreCardValue(s, ['winnings_rupees', 'winnings', 'total_winnings', 'prize_total'])), hint: 'Lifetime winnings' },
      { label: 'Badges', value: formatValue(scoreCardValue(s, ['badge_count', 'total_badges', 'badges'])), hint: 'Unlocked achievements' },
    ]
  }, [stats])

  const activeTabMeta = TABS.find(tab => tab.id === activeTab) || TABS[0]
  const ActiveIcon = activeTabMeta.icon

  if (authLoading) {
    return (
      <div className="pt-17 min-h-screen bg-dark flex items-center justify-center text-sky/50">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (!activeToken) {
    return (
      <div className="pt-17 min-h-screen bg-dark flex items-center justify-center px-6 text-center">
        <Card className="max-w-xl w-full p-8">
          <Sparkles size={40} className="mx-auto mb-4 text-teal/40" />
          <h1 className="text-2xl font-bold text-cream mb-3">Arena profile</h1>
          <p className="text-sm text-sky/60 mb-6">Login to view your arena stats, certificates, and history.</p>
          <button
            onClick={() => navigate('/arena')}
            className="px-5 py-3 rounded-xl bg-teal text-cream font-semibold"
          >
            Back to Arena
          </button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Arena Profile — MedAscend</title>
        <meta name="description" content="View your arena stats, certificates, tier history, subject mastery, and trophy history." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link to="/arena" className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline mb-4">
                <ArrowLeft size={14} />
                Back to Arena
              </Link>
              <h1 className="text-3xl font-extrabold text-cream tracking-tight">Arena Profile</h1>
              <p className="mt-2 text-sm text-sky/70">Your certificates, tier changes, mastery, and trophy trail in one place.</p>
            </div>
            <div className="rounded-2xl border border-teal/10 bg-dark-card px-4 py-3 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky/45">Signed in as</p>
              <p className="mt-1 text-sm font-semibold text-cream">{user?.full_name || user?.email || 'Arena user'}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
              <CalendarClock size={18} />
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'border-teal/30 bg-teal/10 text-teal-light' : 'border-teal/10 bg-dark-card text-sky/60 hover:border-teal/20 hover:bg-teal/5'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {loading ? (
            <Card className="flex items-center justify-center gap-3 py-24 text-sky/50">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Loading arena profile...</span>
            </Card>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <SectionHeading title="Arena summary" subtitle="Quick snapshot from your stats endpoint." />
                    {sectionErrors.overview && (
                      <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                        {sectionErrors.overview}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {overviewCards.map(card => (
                        <StatCard key={card.label} {...card} />
                      ))}
                    </div>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-1">
                    <Card className="p-6">
                      <SectionHeading title="Recent trophy events" subtitle="Append-only arena trophy feed." />
                      {sectionErrors.trophies && (
                        <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                          {sectionErrors.trophies}
                        </div>
                      )}
                      <div className="space-y-3">
                        {trophyHistory.length > 0 ? trophyHistory.slice(0, 4).map((event, index) => (
                          <div key={event.id || event.event_id || index} className="rounded-xl border border-teal/10 bg-dark-surface p-4">
                            <p className="font-semibold text-cream">{event.title || event.reason || event.type || 'Trophy event'}</p>
                            <p className="mt-1 text-xs text-sky/50">{formatDate(event.created_at || event.date || event.timestamp)}</p>
                          </div>
                        )) : (
                          <div className="rounded-xl border border-dashed border-teal/15 px-6 py-10 text-center text-sm text-sky/40">No trophy events yet.</div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'certificates' && (
                <Card className="p-6">
                  <SectionHeading title="My certificates" subtitle="All certificates earned in the Arena." />
                  {sectionErrors.certificates && (
                    <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                      {sectionErrors.certificates}
                    </div>
                  )}
                  <div className="space-y-3">
                    {certificates.length > 0 ? certificates.map((certificate, index) => (
                      <div key={certificate.id || certificate.certificate_id || index} className="rounded-xl border border-teal/10 bg-dark-surface p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-cream">{certificate.title || certificate.contest_title || certificate.quiz_title || `Certificate ${index + 1}`}</p>
                          <p className="mt-1 text-xs text-sky/50">{certificate.slug || certificate.quiz_slug || certificate.contest_id || certificate.quiz_id || '—'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-sky/45">Issued</p>
                          <p className="text-sm font-semibold text-cream">{formatDate(certificate.issued_at || certificate.created_at || certificate.completed_at)}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-teal/15 px-6 py-12 text-center text-sm text-sky/40">No certificates available.</div>
                    )}
                  </div>
                </Card>
              )}

              {activeTab === 'tier' && (
                <Card className="p-6">
                  <SectionHeading title="Tier history" subtitle="Promotions, demotions, and decay events." />
                  {sectionErrors.tier && (
                    <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                      {sectionErrors.tier}
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-teal/10 text-left text-xs uppercase tracking-wider text-sky/45">
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">From</th>
                          <th className="px-3 py-3">To</th>
                          <th className="px-3 py-3">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tierHistory.length > 0 ? tierHistory.map((row, index) => (
                          <tr key={row.id || row.history_id || index} className="border-b border-teal/5">
                            <td className="px-3 py-3 text-sky/60">{formatDate(row.created_at || row.date || row.timestamp)}</td>
                            <td className="px-3 py-3 text-cream">{row.from_tier || row.previous_tier || row.old_tier || '—'}</td>
                            <td className="px-3 py-3 text-teal-light">{row.to_tier || row.new_tier || row.current_tier || '—'}</td>
                            <td className="px-3 py-3 text-sky/60">{row.reason || row.note || row.event || '—'}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-3 py-12 text-center text-sky/40">No tier history yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {activeTab === 'mastery' && (
                <Card className="p-6">
                  <SectionHeading title="Subject mastery" subtitle="Per-subject progress and mastery signals." />
                  {sectionErrors.mastery && (
                    <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                      {sectionErrors.mastery}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {subjectMastery.length > 0 ? subjectMastery.map((row, index) => (
                      <div key={row.subject_id || row.id || index} className="rounded-xl border border-teal/10 bg-dark-surface p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-cream">{row.subject_name || row.subject || row.name || `Subject ${index + 1}`}</p>
                            <p className="mt-1 text-xs text-sky/50">{row.category || row.branch || row.label || 'Mastery record'}</p>
                          </div>
                          <Trophy size={18} className="text-gold" />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg bg-dark-card p-3">
                            <p className="text-xs text-sky/45">Score</p>
                            <p className="mt-1 font-semibold text-cream">{formatValue(row.score ?? row.mastery_score ?? row.value)}</p>
                          </div>
                          <div className="rounded-lg bg-dark-card p-3">
                            <p className="text-xs text-sky/45">Accuracy</p>
                            <p className="mt-1 font-semibold text-cream">{formatValue(row.accuracy_pct ?? row.accuracy ?? row.percent)}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full rounded-xl border border-dashed border-teal/15 px-6 py-12 text-center text-sm text-sky/40">No subject mastery data yet.</div>
                    )}
                  </div>
                </Card>
              )}

              {activeTab === 'trophies' && (
                <Card className="p-6">
                  <SectionHeading title="Trophy history" subtitle="Append-only event feed of your trophy changes." />
                  {sectionErrors.trophies && (
                    <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                      {sectionErrors.trophies}
                    </div>
                  )}
                  <div className="space-y-3">
                    {trophyHistory.length > 0 ? trophyHistory.map((event, index) => (
                      <div key={event.id || event.event_id || index} className="rounded-xl border border-teal/10 bg-dark-surface p-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-cream">{event.title || event.reason || event.type || `Event ${index + 1}`}</p>
                          <p className="mt-1 text-xs text-sky/50">{event.description || event.note || event.message || 'Trophy movement recorded by the arena.'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-sky/45">When</p>
                          <p className="text-sm font-semibold text-cream">{formatDate(event.created_at || event.date || event.timestamp)}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-teal/15 px-6 py-12 text-center text-sm text-sky/40">No trophy history yet.</div>
                    )}
                  </div>
                </Card>
              )}

              <div className="mt-6 rounded-2xl border border-teal/10 bg-dark-card p-4 text-sm text-sky/60 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <ActiveIcon size={16} className="text-teal" />
                  <span>Viewing {activeTabMeta.label}</span>
                </div>
                <Link to="/arena" className="inline-flex items-center gap-2 text-teal-light no-underline hover:text-teal">
                  Back to Arena
                  <ChevronRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
