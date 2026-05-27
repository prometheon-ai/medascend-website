import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  AlertCircle, ArrowLeft, BookOpen, Check, ChevronRight,
  Info, Loader2, Plus, RefreshCw, Save, Shield, Trash2, Trophy, Users, Eye, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  addAdminArenaQuestion,
  bulkAddAdminArenaQuestions,
  createAdminArenaEvent,
  deleteAdminArenaEvent,
  getAdminArenaEvent,
  getAdminArenaEvents,
  getAdminArenaRegistrations,
  publishAdminArenaResults,
  removeAdminArenaQuestion,
  reorderAdminArenaQuestions,
  updateAdminArenaEvent,
  updateAdminArenaEventStatus,
} from '../lib/api'

const STATUS_OPTIONS = ['draft', 'published', 'registration_open', 'lobby', 'live', 'ended', 'results_published', 'cancelled']

// §5.5: valid PATCH /status targets
// lobby cannot be manually set (always 400) — backend auto-transitions at starts_at - 5min
// Normal manual path: draft → published, then everything is automatic until results_published
const VALID_STATUS_TRANSITIONS = {
  draft:              ['published', 'cancelled'],
  published:          ['ended', 'cancelled'],
  registration_open:  ['ended', 'cancelled'],
  lobby:              ['ended', 'cancelled'],
  live:               ['ended', 'cancelled'],
  ended:              [],
  results_published:  [],
  cancelled:          [],
}

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard', 'mixed']
const TYPE_OPTIONS = ['topic_blitz', 'flash_quiz', 'all_india_challenge', 'subject_showdown', 'college_battle', 'city_championship', 'year_battle']
const OPTION_KEYS = ['A', 'B', 'C', 'D']

const emptyContestForm = {
  title: '', slug: '', type: 'topic_blitz', difficulty: 'mixed',
  starts_at: '', duration_minutes: '', entry_fee: '', prize_pool: '',
}

const DIFFICULTY_POINTS = { easy: 10, medium: 12, hard: 15 }

const emptyQuestion = () => ({
  _id: Math.random().toString(36).slice(2),
  question_text: '',
  options: { A: '', B: '', C: '', D: '' },
  correct_option: '',
  difficulty: 'medium',
  points: 12,
  negative_marks: 3,
  question_order: 0,
})

function pillClass(status) {
  if (status === 'live') return 'border-green-400/20 bg-green-400/10 text-green-400'
  if (status === 'lobby' || status === 'registration_open') return 'border-teal/20 bg-teal/10 text-teal-light'
  if (status === 'published') return 'border-gold/20 bg-gold/10 text-gold'
  if (status === 'ended' || status === 'results_published') return 'border-sky/20 bg-sky/10 text-sky/80'
  if (status === 'cancelled') return 'border-terracotta/20 bg-terracotta/10 text-terracotta'
  return 'border-sky/20 bg-dark-surface text-sky/60'
}

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-teal/15 bg-dark-card ${className}`}>{children}</div>
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/70">{label}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return <input {...props} className={`w-full rounded-xl border border-teal/20 bg-dark-surface px-4 py-2.5 text-sm text-cream outline-none focus:border-teal/50 placeholder:text-sky/35 ${props.className || ''}`} />
}

function Select({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full rounded-xl border border-teal/20 bg-dark-surface px-4 py-2.5 pr-9 text-sm text-cream outline-none focus:border-teal/50 appearance-none ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sky/50">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

function Btn({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer'
  const variants = {
    primary: 'bg-teal text-cream hover:bg-teal/90',
    ghost: 'border border-teal/20 bg-transparent text-cream hover:bg-teal/10',
    gold: 'border border-gold/20 bg-gold/10 text-gold hover:bg-gold/20',
    danger: 'border border-terracotta/20 bg-terracotta/10 text-terracotta hover:bg-terracotta/20',
  }
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold text-cream">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-sky/70">{subtitle}</p>}
    </div>
  )
}

// IST is UTC+5:30 = +330 minutes
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function toISTDate(isoStr) {
  if (!isoStr) return null
  const d = new Date(isoStr)
  if (isNaN(d)) return null
  return new Date(d.getTime() + IST_OFFSET_MS)
}

// Format any ISO/UTC string for display in IST
function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  if (isNaN(d)) return '—'
  return d.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata',
  }) + ' IST'
}

// Convert UTC ISO string → "YYYY-MM-DDTHH:MM" in IST (for datetime-local input value)
function isoToISTInput(isoStr) {
  if (!isoStr) return ''
  const ist = toISTDate(isoStr)
  if (!ist) return ''
  const yyyy = ist.getUTCFullYear()
  const mm = String(ist.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(ist.getUTCDate()).padStart(2, '0')
  const hh = String(ist.getUTCHours()).padStart(2, '0')
  const min = String(ist.getUTCMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

// Convert datetime-local value (treated as IST) → UTC ISO string for API
function istInputToISO(localStr) {
  if (!localStr) return undefined
  // localStr is "YYYY-MM-DDTHH:MM" in IST — subtract 5:30 to get UTC
  const istMs = new Date(localStr + ':00Z').getTime() - IST_OFFSET_MS
  return new Date(istMs).toISOString()
}

// ─── Create Contest Wizard ────────────────────────────────────────────────────

function CreateContestPage({ token, onCreated, onBack }) {
  const [step, setStep] = useState(1) // 1=details, 2=questions, 3=preview
  const [form, setForm] = useState(emptyContestForm)
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState(null)

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // ── Step 1: Contest details ──
  const step1Valid = form.title && form.starts_at && form.duration_minutes

  // ── Step 2: Questions ──
  const addQuestion = () => setQuestions(qs => [...qs, { ...emptyQuestion(), question_order: qs.length + 1 }])

  const removeQuestion = (id) => setQuestions(qs => qs.filter(q => q._id !== id).map((q, i) => ({ ...q, question_order: i + 1 })))

  const updateQuestion = (id, field, value) =>
    setQuestions(qs => qs.map(q => {
      if (q._id !== id) return q
      if (field === 'difficulty') return { ...q, difficulty: value, points: DIFFICULTY_POINTS[value] ?? q.points }
      return { ...q, [field]: value }
    }))

  const updateOption = (id, key, value) =>
    setQuestions(qs => qs.map(q => q._id === id ? { ...q, options: { ...q.options, [key]: value } } : q))

  const step2Valid = questions.every(q => q.question_text.trim() && OPTION_KEYS.every(k => q.options[k].trim()) && q.correct_option !== '')

  // ── Submit ──
  const handlePublish = async () => {
    setSaving(true)
    setError('')
    try {
      // §5.1: field names must match API exactly
      const entryFee = form.entry_fee === '' ? 0 : Math.round(Number(form.entry_fee) * 100)
      const prizePool = form.prize_pool === '' ? 0 : Math.round(Number(form.prize_pool) * 100)
      const isPaid = entryFee > 0
      const payload = {
        title: form.title,
        contest_type: form.type,
        difficulty: form.difficulty,
        duration_minutes: Number(form.duration_minutes),
        starts_at: istInputToISO(form.starts_at),
        // registration_opens_at defaults to now (creation time), registration_closes_at defaults to starts_at — omit both
        // ends_at is NOT a valid field — backend derives it from starts_at + duration_minutes
        entry_fee: entryFee,
        prize_pool_type: prizePool > 0 ? 'fixed' : 'entry_fees_pool',
        prize_pool_fixed: prizePool > 0 ? prizePool : undefined,
        // prize_distribution required when entry_fee > 0 (§5.1)
        prize_distribution: isPaid ? [
          { rank: 1, percent: 50.0 },
          { rank: 2, percent: 30.0 },
          { rank: 3, percent: 20.0 },
        ] : undefined,
        penalty_per_wrong: 3,
        time_bonus_enabled: true,
        shuffle_questions: true,
        shuffle_options: true,
        slug: form.slug || undefined,
      }
      const created = await createAdminArenaEvent(token, payload)
      const id = created?.id || created?.contest_id
      if (!id) throw new Error('No contest ID returned.')
      setCreatedId(id)

      // §5.8 bulk is MCQ-bank only; inline questions use §5.7 single add sequentially
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        await addAdminArenaQuestion(token, id, {
          question_order: i + 1,
          question_text: q.question_text,
          question_type: 'mcq',
          options: OPTION_KEYS.map(k => ({ key: k, text: q.options[k] })),
          correct_option: q.correct_option,
          difficulty: q.difficulty,
          points: DIFFICULTY_POINTS[q.difficulty] ?? 12,
          negative_marks: 3,
        })
      }

      onCreated(id)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors mb-6 bg-transparent border-none cursor-pointer">
        <ArrowLeft size={14} /> Back to contests
      </button>

      <h1 className="text-2xl font-extrabold text-cream mb-2">Create Contest</h1>
      <p className="text-sm text-sky/55 mb-8">Fill in details, add questions, then review and publish.</p>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {[{ n: 1, label: 'Details' }, { n: 2, label: 'Questions' }, { n: 3, label: 'Review' }].map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { if (n < step || (n === 2 && step1Valid) || (n === 3 && step2Valid)) setStep(n) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors bg-transparent cursor-pointer
                ${step === n ? 'border-teal bg-teal/15 text-teal' : step > n ? 'border-teal/20 bg-teal/5 text-teal/60' : 'border-teal/10 text-sky/40'}`}
            >
              {step > n ? <Check size={14} /> : <span className="w-4 text-center">{n}</span>}
              {label}
            </button>
            {i < 2 && <ChevronRight size={14} className="text-sky/30 shrink-0" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Step 1: Details ── */}
      {step === 1 && (
        <Card className="p-6 space-y-6">
          <SectionHeading title="Contest details" subtitle="Basic info, schedule, and pricing." />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title" className="sm:col-span-2">
              <TextInput value={form.title} onChange={setField('title')} placeholder="e.g. NEET PG Anatomy Blitz" required />
            </Field>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={setField('slug')} placeholder="anatomy-blitz-may26" />
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={setField('type')}>
                {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={form.difficulty} onChange={setField('difficulty')}>
                {DIFFICULTY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Starts at">
              <TextInput type="datetime-local" value={form.starts_at} onChange={setField('starts_at')} required />
            </Field>
            <Field label="Duration (minutes)">
              <TextInput type="number" min="1" value={form.duration_minutes} onChange={setField('duration_minutes')} placeholder="10" required />
            </Field>
            <Field label="Entry fee (₹)">
              <TextInput type="number" min="0" step="1" value={form.entry_fee} onChange={setField('entry_fee')} placeholder="0 = Free" />
              {form.entry_fee !== '' && Number(form.entry_fee) > 0 && <p className="text-xs text-sky/40 mt-1">= {Math.round(Number(form.entry_fee) * 100)} paise</p>}
            </Field>
            <Field label="Prize pool (₹)">
              <TextInput type="number" min="0" step="1" value={form.prize_pool} onChange={setField('prize_pool')} placeholder="0 = none" />
              {form.prize_pool !== '' && Number(form.prize_pool) > 0 && <p className="text-xs text-sky/40 mt-1">= {Math.round(Number(form.prize_pool) * 100)} paise</p>}
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <Btn variant="primary" onClick={() => setStep(2)} disabled={!step1Valid}>
              Next: Questions <ChevronRight size={16} />
            </Btn>
          </div>
        </Card>
      )}

      {/* ── Step 2: Questions ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Marking scheme info */}
          <Card className="p-4 border-gold/15 bg-gold/5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold mb-3">Marking scheme</p>
            <div className="grid grid-cols-3 gap-3 text-xs mb-3">
              <div className="rounded-lg bg-dark-surface px-3 py-2 text-center">
                <p className="text-sky/50 mb-0.5">Easy</p><p className="font-bold text-cream">+10 pts</p>
              </div>
              <div className="rounded-lg bg-dark-surface px-3 py-2 text-center">
                <p className="text-sky/50 mb-0.5">Medium</p><p className="font-bold text-cream">+12 pts</p>
              </div>
              <div className="rounded-lg bg-dark-surface px-3 py-2 text-center">
                <p className="text-sky/50 mb-0.5">Hard</p><p className="font-bold text-cream">+15 pts</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-sky/60">
              <span>+time bonus (up to 44s remaining)</span>
              <span className="text-terracotta/80">−3 wrong answer</span>
              <span className="text-teal/70">Streak bonus: 3→+3, 5→+6, 7→+10, 10→+15, 15→+25, 20→+40</span>
            </div>
          </Card>

          {questions.map((q, idx) => (
            <Card key={q._id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-sky/50">Question {idx + 1}</span>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(q._id)} className="text-xs text-terracotta hover:text-terracotta/70 bg-transparent border-none cursor-pointer flex items-center gap-1">
                    <X size={13} /> Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Field label="Question text">
                  <textarea
                    value={q.question_text}
                    onChange={e => updateQuestion(q._id, 'question_text', e.target.value)}
                    rows={3}
                    placeholder="Type the question here..."
                    className="w-full rounded-xl border border-teal/20 bg-dark-surface px-4 py-2.5 text-sm text-cream outline-none focus:border-teal/50 placeholder:text-sky/35 resize-none"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OPTION_KEYS.map(key => (
                    <div key={key} className="flex items-center gap-3 rounded-xl border border-teal/15 bg-dark-surface px-4 py-2.5">
                      <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border border-teal/30 text-sky/50">
                        {key}
                      </span>
                      <input
                        value={q.options[key]}
                        onChange={e => updateOption(q._id, key, e.target.value)}
                        placeholder={`Option ${key}`}
                        className="flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-sky/25"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/70 mb-2">Select correct option</p>
                  <div className="flex items-center gap-2">
                    {OPTION_KEYS.map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateQuestion(q._id, 'correct_option', key)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-colors bg-transparent cursor-pointer
                          ${q.correct_option === key
                            ? 'border-teal bg-teal text-cream'
                            : 'border-teal/25 text-sky/50 hover:border-teal/50 hover:text-sky/80'}`}
                      >
                        {key}
                      </button>
                    ))}
                    {q.correct_option && (
                      <span className="ml-2 text-xs text-teal/80 font-medium">Option {q.correct_option} is correct</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/70 mb-2">Difficulty</p>
                  <div className="flex items-center gap-2">
                    {['easy', 'medium', 'hard'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => updateQuestion(q._id, 'difficulty', d)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 capitalize transition-colors bg-transparent cursor-pointer
                          ${q.difficulty === d
                            ? d === 'easy' ? 'border-teal bg-teal/15 text-teal'
                              : d === 'medium' ? 'border-gold bg-gold/15 text-gold'
                              : 'border-terracotta bg-terracotta/15 text-terracotta'
                            : 'border-teal/20 text-sky/40 hover:border-teal/40'}`}
                      >
                        {d} · +{DIFFICULTY_POINTS[d]}
                      </button>
                    ))}
                    <span className="ml-auto text-xs text-sky/40">−3 wrong</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full rounded-2xl border border-dashed border-teal/20 py-4 text-sm font-semibold text-teal/60 hover:border-teal/40 hover:text-teal transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add question
          </button>

          <div className="flex items-center justify-between pt-2">
            <Btn variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Back
            </Btn>
            <Btn variant="primary" onClick={() => setStep(3)} disabled={!step2Valid}>
              Review <Eye size={16} />
            </Btn>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Publish ── */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="p-6">
            <SectionHeading title="Contest summary" subtitle="Review before publishing." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ['Title', form.title],
                ['Type', form.type],
                ['Difficulty', form.difficulty],
                ['Starts at', formatDate(form.starts_at)],
                ['Duration', form.duration_minutes ? `${form.duration_minutes} min` : '—'],
                ['Entry fee', form.entry_fee && Number(form.entry_fee) > 0 ? `₹${Number(form.entry_fee).toFixed(2)}` : 'Free'],
                ['Prize pool', form.prize_pool && Number(form.prize_pool) > 0 ? `₹${Number(form.prize_pool).toFixed(2)}` : '—'],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl bg-dark-surface p-3">
                  <p className="text-xs text-sky/45 mb-1">{label}</p>
                  <p className="font-semibold text-cream truncate">{val || '—'}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading title={`${questions.length} question${questions.length !== 1 ? 's' : ''}`} subtitle="Final review of all questions and options." />
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q._id} className="rounded-xl border border-teal/10 bg-dark-surface p-4">
                  <p className="text-xs font-bold text-sky/40 uppercase tracking-widest mb-2">Q{idx + 1}</p>
                  <p className="text-sm font-semibold text-cream mb-3">{q.question_text || <span className="text-sky/30 italic">No question text</span>}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {OPTION_KEYS.map(key => (
                      <div key={key} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${q.correct_option === key ? 'bg-teal/10 text-teal font-semibold' : 'text-sky/60'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${q.correct_option === key ? 'bg-teal text-cream' : 'bg-dark-card text-sky/40'}`}>{key}</span>
                        {q.options[key] || <span className="italic text-sky/30">empty</span>}
                        {q.correct_option === key && <Check size={11} className="ml-auto" />}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-sky/40 capitalize">{q.difficulty} · +{DIFFICULTY_POINTS[q.difficulty] ?? q.points} pts · −3 wrong</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Btn variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft size={16} /> Edit questions
            </Btn>
            <Btn variant="primary" onClick={handlePublish} disabled={saving}>
              {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><Check size={16} /> Create contest</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function ArenaAdminPage() {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { user, token, loading: authLoading } = useAuth()
  const [view, setView] = useState(contestId ? 'detail' : 'list') // 'list' | 'create' | 'detail'
  const [events, setEvents] = useState([])
  const [selectedId, setSelectedId] = useState(contestId || '')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [leaderboard, setLeaderboard] = useState(null)
  const [listLoading, setListLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [editForm, setEditForm] = useState(emptyContestForm)
  const [statusDraft, setStatusDraft] = useState('')
  const activeToken = token || localStorage.getItem('access_token')
  const isAdmin = user?.role === 'admin'

  const queryStatuses = useMemo(() => statusFilter ? [statusFilter] : [], [statusFilter])

  const loadList = async () => {
    if (!activeToken || !isAdmin) return
    setListLoading(true)
    setError('')
    try {
      const data = await getAdminArenaEvents(activeToken, { page: 1, page_size: 30, status: queryStatuses, type: typeFilter || undefined })
      const items = Array.isArray(data) ? data : data?.items || data?.results || data?.events || data?.quizzes || []
      setEvents(items)
    } catch (err) { setError(err.message) }
    finally { setListLoading(false) }
  }

  const loadDetail = async (id) => {
    if (!activeToken || !isAdmin || !id) return
    setDetailLoading(true)
    setError('')
    try {
      const isEndedStatus = (s) => ['ended', 'results_published'].includes(s)
      const [detail, regs] = await Promise.all([
        getAdminArenaEvent(activeToken, id),
        getAdminArenaRegistrations(activeToken, id).catch(() => null),
      ])
      setSelectedEvent(detail)
      setEditForm({
        title: detail?.title || '',
        slug: detail?.slug || '',
        type: detail?.type || 'topic_blitz',
        difficulty: detail?.difficulty || 'mixed',
        status: detail?.status || 'draft',
        starts_at: isoToISTInput(detail?.starts_at),
        duration_minutes: detail?.duration_minutes ?? '',
        entry_fee: detail?.entry_fee ?? '',
        prize_pool: detail?.prize_pool ?? detail?.prize_pool_estimate ?? '',
        subject_id: detail?.subject_id || '',
      })
      setStatusDraft((VALID_STATUS_TRANSITIONS[detail?.status] ?? [])[0] ?? '')
      setRegistrations(Array.isArray(regs) ? regs : regs?.registrations || regs?.items || [])
      if (isEndedStatus(detail?.status)) {
        fetch(`/api/v1/arena/quizzes/${id}/leaderboard`, { headers: { Authorization: `Bearer ${activeToken}` } })
          .then(r => r.ok ? r.json() : null).then(setLeaderboard).catch(() => {})
      } else {
        setLeaderboard(null)
      }
    } catch (err) { setError(err.message) }
    finally { setDetailLoading(false) }
  }

  useEffect(() => {
    if (authLoading || !activeToken || !isAdmin) return
    loadList()
  }, [authLoading, activeToken, isAdmin, statusFilter, typeFilter])

  useEffect(() => {
    if (!contestId) return
    setSelectedId(contestId)
    setView('detail')
  }, [contestId])

  useEffect(() => {
    if (!selectedId) { setSelectedEvent(null); setRegistrations([]); setLeaderboard(null); return }
    if (authLoading || !activeToken || !isAdmin) return
    loadDetail(selectedId)
    navigate(`/arena/admin/${selectedId}`, { replace: true })
  }, [selectedId, authLoading, activeToken, isAdmin])

  const handleSelectContest = (id) => { setSelectedId(id); setView('detail') }

  const handleCreated = async (id) => {
    setMessage('Contest created with questions.')
    await loadList()
    setSelectedId(id)
    setView('detail')
  }

  const handleSaveContest = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    setSaving(true); setError(''); setMessage('')
    try {
      const payload = {
        title: editForm.title || undefined,
        slug: editForm.slug || undefined,
        contest_type: editForm.type || undefined,
        difficulty: editForm.difficulty || undefined,
        duration_minutes: editForm.duration_minutes === '' ? undefined : Number(editForm.duration_minutes),
        entry_fee: editForm.entry_fee === '' ? undefined : Number(editForm.entry_fee),
        starts_at: istInputToISO(editForm.starts_at),
        // ends_at is not a valid API field — backend derives from starts_at + duration_minutes
      }
      await updateAdminArenaEvent(activeToken, selectedId, payload)
      setMessage('Contest updated.')
      await loadDetail(selectedId)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleStatusUpdate = async () => {
    if (!selectedId || !statusDraft) return
    setSaving(true); setError(''); setMessage('')
    try {
      await updateAdminArenaEventStatus(activeToken, selectedId, statusDraft)
      setMessage(`Status → ${statusDraft}`)
      await loadList()
      await loadDetail(selectedId)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!selectedId || !window.confirm('Delete this draft contest?')) return
    setSaving(true); setError(''); setMessage('')
    try {
      await deleteAdminArenaEvent(activeToken, selectedId)
      setMessage('Contest deleted.')
      setSelectedId(''); setSelectedEvent(null); setRegistrations([])
      setView('list')
      await loadList()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handlePublishResults = async () => {
    if (!selectedId || !window.confirm('Publish results? This will finalize ranks, distribute prizes, and update Elo. Cannot be undone.')) return
    setSaving(true); setError(''); setMessage('')
    try {
      await publishAdminArenaResults(activeToken, selectedId)
      setMessage('Results published.')
      await loadList()
      await loadDetail(selectedId)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleRemoveQuestion = async (questionId) => {
    if (!selectedId || !questionId || !window.confirm('Remove this question?')) return
    setSaving(true); setError(''); setMessage('')
    try {
      await removeAdminArenaQuestion(activeToken, selectedId, questionId)
      setMessage('Question removed.')
      await loadDetail(selectedId)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const [addQForm, setAddQForm] = useState(null) // null = hidden, object = open
  const [addQSaving, setAddQSaving] = useState(false)

  const openAddQuestion = () => {
    const nextOrder = (selectedEvent?.questions?.length ?? 0) + 1
    setAddQForm({ question_text: '', options: { A: '', B: '', C: '', D: '' }, correct_option: '', difficulty: 'medium', question_order: nextOrder })
  }

  const handleAddQuestion = async () => {
    if (!addQForm) return
    setAddQSaving(true); setError(''); setMessage('')
    try {
      await addAdminArenaQuestion(activeToken, selectedId, {
        question_order: addQForm.question_order,
        question_text: addQForm.question_text,
        question_type: 'mcq',
        options: OPTION_KEYS.map(k => ({ key: k, text: addQForm.options[k] })),
        correct_option: addQForm.correct_option,
        difficulty: addQForm.difficulty,
        points: DIFFICULTY_POINTS[addQForm.difficulty] ?? 12,
        negative_marks: 3,
      })
      setMessage('Question added.')
      setAddQForm(null)
      await loadDetail(selectedId)
    } catch (err) { setError(err.message) }
    finally { setAddQSaving(false) }
  }

  if (authLoading) return (
    <div className="pt-17 min-h-screen bg-dark flex items-center justify-center text-sky/50">
      <Loader2 className="animate-spin" size={24} />
    </div>
  )

  if (!activeToken || !isAdmin) return (
    <div className="pt-17 min-h-screen bg-dark flex items-center justify-center px-6 text-center">
      <Card className="max-w-xl w-full p-8">
        <Shield size={40} className="mx-auto mb-4 text-terracotta/70" />
        <h1 className="text-2xl font-bold text-cream mb-3">{!activeToken ? 'Sign in required' : 'Admin only'}</h1>
        <p className="text-sm text-sky/60 mb-6">{!activeToken ? 'Sign in to access arena admin.' : 'Your account does not have admin access.'}</p>
        <Link to="/arena" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal text-cream font-semibold no-underline">Back to Arena</Link>
      </Card>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Admin Arena — MedAscend</title>
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Header */}
          {view !== 'create' && (
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
              <div>
                <Link to="/arena" className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline mb-4">
                  <ArrowLeft size={14} /> Back to Arena
                </Link>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-extrabold text-cream tracking-tight">Arena Admin</h1>
                  <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    {user?.role || 'admin'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowInfo(v => !v)}
                  className="w-8 h-8 rounded-full border border-teal/20 bg-transparent flex items-center justify-center text-sky/50 hover:text-teal hover:border-teal/40 transition-colors cursor-pointer"
                  title="Contest flow"
                >
                  <Info size={15} />
                </button>
                <Btn variant="primary" onClick={() => setView('create')}>
                  <Plus size={16} /> Create contest
                </Btn>
                <Btn variant="ghost" onClick={() => { loadList(); if (selectedId) loadDetail(selectedId) }}>
                  <RefreshCw size={16} className={listLoading || detailLoading ? 'animate-spin' : ''} /> Refresh
                </Btn>
              </div>
            </div>
          )}

          {view !== 'create' && showInfo && (
            <div className="mb-6 rounded-2xl border border-teal/15 bg-dark-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Contest lifecycle</p>
                <button type="button" onClick={() => setShowInfo(false)} className="text-sky/40 hover:text-sky/70 bg-transparent border-none cursor-pointer"><X size={14} /></button>
              </div>

              {/* Steps table */}
              <div className="space-y-2 text-xs mb-4">
                {[
                  { step: '1', s: 'draft', action: 'Admin', note: 'Create contest + add questions. Invisible to users.' },
                  { step: '2', s: 'published', action: 'Admin', note: 'Publish → users see it, registrations open immediately.' },
                  { step: '3', s: 'lobby', action: 'Auto', note: 'starts_at − 5 min: waiting room, registrations still open. Cannot be set manually.' },
                  { step: '4', s: 'live', action: 'Auto', note: 'starts_at: quiz engine active, POST /start works.' },
                  { step: '5', s: 'ended', action: 'Auto', note: 'ends_at: quiz over, unsubmitted sessions auto-finished.' },
                  { step: '6', s: 'results_published', action: 'Admin', note: 'Use "Publish Results" → ranks, Elo, prizes, trophies.' },
                ].map(({ step, s, action, note }) => (
                  <div key={s} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-dark-surface flex items-center justify-center text-[10px] font-bold text-sky/40 shrink-0 mt-0.5">{step}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0 ${pillClass(s)}`}>{s}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide shrink-0 mt-0.5 ${action === 'Auto' ? 'text-gold/60' : 'text-teal/60'}`}>{action}</span>
                    <span className="text-sky/45">{note}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-dark-surface px-4 py-3 text-xs text-sky/50 space-y-1">
                <p><span className="text-teal/70 font-semibold">Only 2 manual steps:</span> Publish (draft → published) and Publish Results.</p>
                <p>lobby → live → ended all happen automatically. <span className="text-terracotta/70">Do not try to manually set lobby — backend will reject it.</span></p>
                <p>Set <span className="text-teal/80">starts_at</span> at least 15+ min in the future when creating, otherwise paid registration is already closed when you publish.</p>
                <p>Questions can only be edited while status is <span className="text-teal/80">draft</span> or <span className="text-teal/80">published</span>.</p>
              </div>
            </div>
          )}

          {view !== 'create' && error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {view !== 'create' && message && (
            <div className="mb-6 rounded-xl border border-teal/20 bg-teal/5 p-4 text-sm text-teal-light flex items-center gap-3">
              <Check size={16} /> {message}
            </div>
          )}

          {/* Create view */}
          {view === 'create' && (
            <CreateContestPage
              token={activeToken}
              onCreated={handleCreated}
              onBack={() => setView('list')}
            />
          )}

          {/* List + detail view */}
          {view !== 'create' && (
            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">

              {/* ── Left: Contest list ── */}
              <Card className="p-5 self-start">
                <SectionHeading title="Contests" />

                {/* Status filter buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors bg-transparent cursor-pointer
                      ${statusFilter === '' ? 'border-teal/40 bg-teal/10 text-teal' : 'border-teal/15 text-sky/50 hover:border-teal/30'}`}
                  >
                    All
                  </button>
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors bg-transparent cursor-pointer
                        ${statusFilter === s ? `${pillClass(s)} opacity-100` : 'border-teal/15 text-sky/50 hover:border-teal/30'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Type filter */}
                <div className="mb-4">
                  <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All types</option>
                    {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </div>

                <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                  {listLoading ? (
                    <div className="py-10 flex items-center justify-center text-sky/50"><Loader2 className="animate-spin" size={20} /></div>
                  ) : events.length === 0 ? (
                    <div className="py-10 text-center text-sm text-sky/55">No contests found.</div>
                  ) : events.map(event => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleSelectContest(event.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors bg-transparent cursor-pointer
                        ${selectedId === event.id ? 'border-teal/30 bg-teal/10' : 'border-teal/10 bg-dark-surface hover:border-teal/20'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-cream">{event.title || event.slug || event.id}</div>
                          <div className="mt-0.5 text-xs text-sky/65">{event.type || '—'} · {formatDate(event.starts_at)}</div>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${pillClass(event.status)}`}>
                          {event.status || '?'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* ── Right: Detail ── */}
              <div>
                {!selectedId ? (
                  <Card className="p-8 text-center text-sm text-sky/40">Select a contest to manage it.</Card>
                ) : detailLoading ? (
                  <Card className="p-16 flex items-center justify-center text-sky/50"><Loader2 className="animate-spin" size={24} /></Card>
                ) : selectedEvent ? (
                  <div className="space-y-6">

                    {/* Status bar */}
                    <Card className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${pillClass(selectedEvent.status)}`}>
                            {selectedEvent.status}
                          </span>
                          <span className="text-xs text-sky/55 font-mono">{selectedEvent.id}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {(() => {
                            const validNext = VALID_STATUS_TRANSITIONS[selectedEvent.status] ?? []
                            const isAutoPhase = ['lobby', 'live'].includes(selectedEvent.status)
                            const isEnded = selectedEvent.status === 'ended'
                            if (isEnded) return (
                              <Btn variant="primary" onClick={handlePublishResults} disabled={saving}>
                                <Trophy size={16} /> Publish Results
                              </Btn>
                            )
                            if (validNext.length === 0) return (
                              <span className="text-xs text-sky/40 italic">No further status transitions.</span>
                            )
                            return (
                              <>
                                {isAutoPhase && (
                                  <span className="text-xs text-gold/60">Auto-managed — only override if needed</span>
                                )}
                                <Select value={statusDraft} onChange={e => setStatusDraft(e.target.value)} className="w-48">
                                  {validNext.map(o => <option key={o} value={o}>{o}</option>)}
                                </Select>
                                <Btn variant="gold" onClick={handleStatusUpdate} disabled={saving || !statusDraft}>
                                  <ChevronRight size={16} /> Update status
                                </Btn>
                              </>
                            )
                          })()}
                          <Btn variant="danger" onClick={handleDelete} disabled={saving}>
                            <Trash2 size={16} /> Delete
                          </Btn>
                        </div>
                      </div>
                    </Card>

                    {/* Edit form — hidden when ended/results_published */}
                    {!['ended', 'results_published'].includes(selectedEvent.status) && (
                      <Card className="p-6">
                        <SectionHeading title="Edit contest" />
                        <form onSubmit={handleSaveContest}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <Field label="Title" className="lg:col-span-2">
                              <TextInput value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                            </Field>
                            <Field label="Slug">
                              <TextInput value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                            </Field>
                            <Field label="Type">
                              <Select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}>
                                {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                              </Select>
                            </Field>
                            <Field label="Difficulty">
                              <Select value={editForm.difficulty} onChange={e => setEditForm(f => ({ ...f, difficulty: e.target.value }))}>
                                {DIFFICULTY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                              </Select>
                            </Field>
                            <Field label="Duration (min)">
                              <TextInput type="number" min="1" value={editForm.duration_minutes} onChange={e => setEditForm(f => ({ ...f, duration_minutes: e.target.value }))} />
                            </Field>
                            <Field label="Starts at">
                              <TextInput type="datetime-local" value={editForm.starts_at} onChange={e => setEditForm(f => ({ ...f, starts_at: e.target.value }))} />
                            </Field>
                            <Field label="Entry fee (₹)">
                              <TextInput type="number" min="0" step="1" value={editForm.entry_fee !== '' ? (Number(editForm.entry_fee) / 100) : ''} onChange={e => setEditForm(f => ({ ...f, entry_fee: e.target.value === '' ? '' : Math.round(Number(e.target.value) * 100) }))} placeholder="0 = Free" />
                            </Field>
                            <Field label="Prize pool (₹)">
                              <TextInput type="number" min="0" step="1" value={editForm.prize_pool !== '' ? (Number(editForm.prize_pool) / 100) : ''} onChange={e => setEditForm(f => ({ ...f, prize_pool: e.target.value === '' ? '' : Math.round(Number(e.target.value) * 100) }))} placeholder="0 = none" />
                            </Field>
                          </div>
                          <Btn type="submit" variant="primary" disabled={saving}>
                            <Save size={16} /> Save changes
                          </Btn>
                        </form>
                      </Card>
                    )}

                    {/* Leaderboard — only when ended/results_published */}
                    {leaderboard && ['ended', 'results_published'].includes(selectedEvent.status) && (
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <SectionHeading title="Leaderboard" />
                          {leaderboard.pending && (
                            <span className="text-xs text-gold/70 font-semibold">Results not published yet</span>
                          )}
                        </div>
                        {(leaderboard.leaderboard ?? []).length === 0 ? (
                          <div className="rounded-xl border border-dashed border-teal/15 py-10 text-center text-sm text-sky/40">No submissions yet.</div>
                        ) : (
                          <div className="divide-y divide-teal/5 max-h-80 overflow-y-auto">
                            {(leaderboard.leaderboard ?? []).map((entry, i) => (
                              <div key={entry.user_id || i} className="flex items-center gap-3 py-2.5 px-1">
                                <span className="w-7 text-xs font-bold text-sky/50 shrink-0">#{entry.rank ?? i + 1}</span>
                                {entry.avatar_url ? (
                                  <img src={entry.avatar_url} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover shrink-0 border border-teal/20" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-teal/15 flex items-center justify-center text-xs font-bold text-teal shrink-0">{entry.full_name?.[0]?.toUpperCase() ?? '?'}</div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-cream truncate">{entry.full_name ?? `User ${i + 1}`}</p>
                                  <p className="text-xs text-sky/40 truncate">{entry.college ?? entry.tier ?? ''}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 text-right text-xs">
                                  <div>
                                    <p className="text-sky/40">Correct</p>
                                    <p className="font-semibold text-cream">{entry.problems_solved ?? '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sky/40">Score</p>
                                    <p className="font-bold text-teal">{entry.total_score ?? '—'}</p>
                                  </div>
                                  {entry.prize_amount > 0 && (
                                    <div>
                                      <p className="text-sky/40">Prize</p>
                                      <p className="font-semibold text-gold">₹{(entry.prize_amount / 100).toFixed(0)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {leaderboard.total_participants != null && (
                          <p className="text-xs text-sky/35 mt-3">{leaderboard.total_participants} total participants</p>
                        )}
                      </Card>
                    )}

                    {/* Registrations */}
                    <Card className="p-6">
                      <SectionHeading title={`Registrations (${registrations.length})`} />
                      {registrations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-teal/15 py-10 text-center text-sm text-sky/40">No registrations yet.</div>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {registrations.map((row, i) => (
                            <div key={row.id || row.user_id || i} className="flex items-center justify-between gap-4 rounded-xl border border-teal/10 bg-dark-surface px-4 py-3">
                              {(() => {
                                const u = row.user || row
                                const name = u.full_name || u.name || u.email || `User ${i + 1}`
                                const college = u.college || row.college || ''
                                const initial = name[0].toUpperCase()
                                const participated = row.participated ?? u.participated
                                return (
                                  <>
                                    <div className="flex items-center gap-3 min-w-0">
                                      {u.avatar_url ? (
                                        <img src={u.avatar_url} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0 border border-teal/20" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-xs font-bold text-teal shrink-0">{initial}</div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cream truncate">{name}</p>
                                        <p className="text-xs text-sky/55">{college}</p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${participated ? 'bg-teal/10 text-teal' : 'bg-sky/10 text-sky/60'}`}>
                                        {participated ? 'Participated' : row.payment_status || 'Registered'}
                                      </span>
                                      <p className="text-xs text-sky/40 mt-1">{formatDate(row.registered_at || row.created_at)}</p>
                                    </div>
                                  </>
                                )
                              })()}
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>

                    {/* Questions */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-base font-bold text-cream">Questions</h2>
                          <p className="text-sm text-sky/55 mt-1">{Array.isArray(selectedEvent.questions) ? selectedEvent.questions.length : (selectedEvent.question_count || 0)} loaded</p>
                        </div>
                        {['draft', 'published', 'lobby', 'live'].includes(selectedEvent.status) && !addQForm && (
                          <Btn variant="primary" onClick={openAddQuestion}>
                            <Plus size={15} /> Add question
                          </Btn>
                        )}
                      </div>

                      {/* Inline add question form */}
                      {addQForm && (
                        <div className="mb-5 rounded-xl border border-teal/25 bg-teal/5 p-5 space-y-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">New question</p>

                          <Field label="Question text">
                            <textarea
                              value={addQForm.question_text}
                              onChange={e => setAddQForm(f => ({ ...f, question_text: e.target.value }))}
                              rows={3}
                              placeholder="Type the question here..."
                              className="w-full rounded-xl border border-teal/20 bg-dark-surface px-4 py-2.5 text-sm text-cream outline-none focus:border-teal/50 placeholder:text-sky/35 resize-none"
                            />
                          </Field>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {OPTION_KEYS.map(key => (
                              <div key={key} className="flex items-center gap-3 rounded-xl border border-teal/15 bg-dark-surface px-4 py-2.5">
                                <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border border-teal/30 text-sky/50">{key}</span>
                                <input
                                  value={addQForm.options[key]}
                                  onChange={e => setAddQForm(f => ({ ...f, options: { ...f.options, [key]: e.target.value } }))}
                                  placeholder={`Option ${key}`}
                                  className="flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-sky/25"
                                />
                              </div>
                            ))}
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/70 mb-2">Correct option</p>
                            <div className="flex items-center gap-2">
                              {OPTION_KEYS.map(key => (
                                <button key={key} type="button"
                                  onClick={() => setAddQForm(f => ({ ...f, correct_option: key }))}
                                  className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-colors bg-transparent cursor-pointer
                                    ${addQForm.correct_option === key ? 'border-teal bg-teal text-cream' : 'border-teal/25 text-sky/50 hover:border-teal/50'}`}
                                >{key}</button>
                              ))}
                              {addQForm.correct_option && <span className="ml-2 text-xs text-teal/80">Option {addQForm.correct_option} is correct</span>}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/70 mb-2">Difficulty</p>
                            <div className="flex items-center gap-2">
                              {['easy', 'medium', 'hard'].map(d => (
                                <button key={d} type="button"
                                  onClick={() => setAddQForm(f => ({ ...f, difficulty: d }))}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 capitalize transition-colors bg-transparent cursor-pointer
                                    ${addQForm.difficulty === d
                                      ? d === 'easy' ? 'border-teal bg-teal/15 text-teal' : d === 'medium' ? 'border-gold bg-gold/15 text-gold' : 'border-terracotta bg-terracotta/15 text-terracotta'
                                      : 'border-teal/20 text-sky/40 hover:border-teal/40'}`}
                                >{d} · +{DIFFICULTY_POINTS[d]}</button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <Btn variant="primary" onClick={handleAddQuestion} disabled={addQSaving || !addQForm.question_text.trim() || !OPTION_KEYS.every(k => addQForm.options[k].trim()) || !addQForm.correct_option}>
                              {addQSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save question</>}
                            </Btn>
                            <Btn variant="ghost" onClick={() => setAddQForm(null)}>Cancel</Btn>
                          </div>
                        </div>
                      )}
                      {Array.isArray(selectedEvent.questions) && selectedEvent.questions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedEvent.questions.map((q, idx) => (
                            <div key={q.id || idx} className="rounded-xl border border-teal/10 bg-dark-surface p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-sky/40 uppercase tracking-widest">Q{idx + 1}</span>
                                    {q.difficulty && <span className="text-xs text-sky/40">{q.difficulty}</span>}
                                    {q.subject_name && <span className="text-xs text-teal/60">{q.subject_name}</span>}
                                  </div>
                                  <p className="text-sm font-medium text-cream mb-3">{q.question_text || q.prompt || q.text || '—'}</p>
                                  {Array.isArray(q.options) && (
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {q.options.map(opt => (
                                        <div key={opt.key} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${opt.key === q.correct_option ? 'bg-teal/10 text-teal font-semibold' : 'text-sky/55'}`}>
                                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${opt.key === q.correct_option ? 'bg-teal text-cream' : 'bg-dark-card text-sky/40'}`}>{opt.key}</span>
                                          {opt.text}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {['draft', 'published'].includes(selectedEvent.status) && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(q.id || q.question_id)}
                                    className="text-xs text-terracotta hover:text-terracotta/70 bg-transparent border-none cursor-pointer shrink-0"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-teal/15 py-10 text-center text-sm text-sky/40">No questions loaded for this contest.</div>
                      )}
                    </Card>

                  </div>
                ) : (
                  <Card className="p-8 text-center text-sm text-sky/40">Contest could not be loaded.</Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
