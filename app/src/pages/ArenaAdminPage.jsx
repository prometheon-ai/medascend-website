import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Trash2,
  Users,
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
  readApiErrorMessage,
  removeAdminArenaQuestion,
  reorderAdminArenaQuestions,
  updateAdminArenaEvent,
  updateAdminArenaEventStatus,
} from '../lib/api'

const STATUS_OPTIONS = ['draft', 'published', 'registration_open', 'lobby', 'live', 'ended', 'results_published', 'cancelled']
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard', 'mixed']
const TYPE_OPTIONS = ['topic_blitz', 'mixed', 'subject_specific', 'practice', 'other']

const emptyCreateForm = {
  title: '',
  slug: '',
  type: 'topic_blitz',
  difficulty: 'mixed',
  status: 'draft',
  starts_at: '',
  ends_at: '',
  duration_minutes: '',
  question_count: '',
  entry_fee: '',
  prize_pool: '',
  subject_id: '',
}

const emptyQuestionForm = {
  questionJson: '{\n  "question_text": "",\n  "options": ["A", "B", "C", "D"],\n  "correct_option": "A"\n}',
  bulkJson: '[\n  {\n    "question_text": "",\n    "options": ["A", "B", "C", "D"],\n    "correct_option": "A"\n  }\n]',
  orderJson: '{\n  "question_ids": []\n}',
}

function safeParseJson(text, fallback = null) {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

function pillClass(status) {
  if (status === 'live') return 'border-green-400/20 bg-green-400/10 text-green-400'
  if (status === 'lobby' || status === 'registration_open') return 'border-teal/20 bg-teal/10 text-teal-light'
  if (status === 'published') return 'border-gold/20 bg-gold/10 text-gold'
  if (status === 'ended' || status === 'results_published') return 'border-sky/20 bg-sky/10 text-sky/80'
  if (status === 'cancelled') return 'border-terracotta/20 bg-terracotta/10 text-terracotta'
  return 'border-sky/20 bg-dark-surface text-sky/60'
}

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-teal/10 bg-dark-card ${className}`}>{children}</div>
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky/50">{label}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return <input {...props} className={`w-full rounded-xl border border-teal/15 bg-dark-surface px-4 py-3 text-sm text-cream outline-none focus:border-teal/40 ${props.className || ''}`} />
}

function TextArea(props) {
  return <textarea {...props} className={`w-full rounded-xl border border-teal/15 bg-dark-surface px-4 py-3 text-sm text-cream outline-none focus:border-teal/40 ${props.className || ''}`} />
}

function Select(props) {
  return <select {...props} className={`w-full rounded-xl border border-teal/15 bg-dark-surface px-4 py-3 text-sm text-cream outline-none focus:border-teal/40 ${props.className || ''}`} />
}

function sectionTitle(title, subtitle) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-cream">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-sky/60">{subtitle}</p> : null}
    </div>
  )
}

export default function ArenaAdminPage() {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { user, token, loading: authLoading } = useAuth()
  const [events, setEvents] = useState([])
  const [selectedId, setSelectedId] = useState(contestId || '')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [filters, setFilters] = useState({ page: 1, page_size: 20, status: 'live', type: '' })
  const [createForm, setCreateForm] = useState(emptyCreateForm)
  const [editForm, setEditForm] = useState(emptyCreateForm)
  const [statusDraft, setStatusDraft] = useState('')
  const [questionForms, setQuestionForms] = useState(emptyQuestionForm)
  const activeToken = token || localStorage.getItem('access_token')
  const isAdmin = user?.role === 'admin'

  const queryStatuses = useMemo(() => {
    if (!filters.status) return []
    return filters.status.split(',').map(s => s.trim()).filter(Boolean)
  }, [filters.status])

  const loadList = async () => {
    if (!activeToken || !isAdmin) return
    setListLoading(true)
    setError('')
    try {
      const data = await getAdminArenaEvents(activeToken, {
        page: filters.page,
        page_size: filters.page_size,
        status: queryStatuses,
        type: filters.type || undefined,
      })
      const items = Array.isArray(data) ? data : data?.items || data?.results || data?.events || data?.quizzes || []
      setEvents(items)
    } catch (err) {
      setError(err.message)
    } finally {
      setListLoading(false)
    }
  }

  const loadDetail = async (id) => {
    if (!activeToken || !isAdmin || !id) return
    setDetailLoading(true)
    setError('')
    try {
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
        starts_at: detail?.starts_at ? String(detail.starts_at).slice(0, 16) : '',
        ends_at: detail?.ends_at ? String(detail.ends_at).slice(0, 16) : '',
        duration_minutes: detail?.duration_minutes ?? '',
        question_count: detail?.question_count ?? '',
        entry_fee: detail?.entry_fee ?? '',
        prize_pool: detail?.prize_pool ?? detail?.prize_pool_estimate ?? '',
        subject_id: detail?.subject_id || '',
      })
      setStatusDraft(detail?.status || '')
      setRegistrations(Array.isArray(regs) ? regs : regs?.registrations || regs?.items || [] )
    } catch (err) {
      setError(err.message)
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!activeToken) return
    if (!isAdmin) return
    loadList()
  }, [authLoading, activeToken, isAdmin, filters.page, filters.page_size, filters.status, filters.type])

  useEffect(() => {
    if (!contestId) return
    setSelectedId(contestId)
  }, [contestId])

  useEffect(() => {
    if (!selectedId) {
      setSelectedEvent(null)
      setRegistrations([])
      return
    }
    loadDetail(selectedId)
    navigate(`/arena/admin/${selectedId}`, { replace: true })
  }, [selectedId])

  useEffect(() => {
    if (!selectedEvent) return
    if (typeof selectedEvent.status === 'string') {
      setStatusDraft(selectedEvent.status)
    }
  }, [selectedEvent])

  const refreshAll = async () => {
    await loadList()
    if (selectedId) await loadDetail(selectedId)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        ...createForm,
        duration_minutes: createForm.duration_minutes === '' ? undefined : Number(createForm.duration_minutes),
        question_count: createForm.question_count === '' ? undefined : Number(createForm.question_count),
        entry_fee: createForm.entry_fee === '' ? undefined : Number(createForm.entry_fee),
        prize_pool: createForm.prize_pool === '' ? undefined : Number(createForm.prize_pool),
        starts_at: createForm.starts_at || undefined,
        ends_at: createForm.ends_at || undefined,
        subject_id: createForm.subject_id || undefined,
      }
      const created = await createAdminArenaEvent(activeToken, payload)
      const newId = created?.id || created?.contest_id || created?._id
      setMessage('Contest created.')
      setCreateForm(emptyCreateForm)
      await refreshAll()
      if (newId) setSelectedId(newId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContest = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        ...editForm,
        duration_minutes: editForm.duration_minutes === '' ? undefined : Number(editForm.duration_minutes),
        question_count: editForm.question_count === '' ? undefined : Number(editForm.question_count),
        entry_fee: editForm.entry_fee === '' ? undefined : Number(editForm.entry_fee),
        prize_pool: editForm.prize_pool === '' ? undefined : Number(editForm.prize_pool),
        starts_at: editForm.starts_at || undefined,
        ends_at: editForm.ends_at || undefined,
        subject_id: editForm.subject_id || undefined,
      }
      await updateAdminArenaEvent(activeToken, selectedId, payload)
      setMessage('Contest updated.')
      await refreshAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedId || !statusDraft) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await updateAdminArenaEventStatus(activeToken, selectedId, statusDraft)
      setMessage(`Contest status changed to ${statusDraft}.`)
      await refreshAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (!window.confirm('Delete this draft contest?')) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await deleteAdminArenaEvent(activeToken, selectedId)
      setMessage('Contest deleted.')
      setSelectedId('')
      setSelectedEvent(null)
      setRegistrations([])
      await loadList()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    const payload = safeParseJson(questionForms.questionJson)
    if (!payload) {
      setError('Question JSON is invalid.')
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await addAdminArenaQuestion(activeToken, selectedId, payload)
      setMessage('Question added.')
      await loadDetail(selectedId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleBulkAdd = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    const payload = safeParseJson(questionForms.bulkJson)
    if (!payload) {
      setError('Bulk JSON is invalid.')
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await bulkAddAdminArenaQuestions(activeToken, selectedId, payload)
      setMessage('Bulk questions added.')
      await loadDetail(selectedId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReorder = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    const payload = safeParseJson(questionForms.orderJson)
    if (!payload) {
      setError('Reorder JSON is invalid.')
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await reorderAdminArenaQuestions(activeToken, selectedId, payload)
      setMessage('Questions reordered.')
      await loadDetail(selectedId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveQuestion = async (questionId) => {
    if (!selectedId || !questionId) return
    if (!window.confirm('Remove this question from the contest?')) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await removeAdminArenaQuestion(activeToken, selectedId, questionId)
      setMessage('Question removed.')
      await loadDetail(selectedId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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
          <Shield size={40} className="mx-auto mb-4 text-teal/40" />
          <h1 className="text-2xl font-bold text-cream mb-3">Admin Arena</h1>
          <p className="text-sm text-sky/60 mb-6">Sign in first to access contest administration.</p>
          <button
            onClick={() => navigate('/arena')}
            className="px-5 py-3 rounded-xl bg-teal text-cream font-semibold"
          >
            Go to Arena
          </button>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="pt-17 min-h-screen bg-dark flex items-center justify-center px-6 text-center">
        <Card className="max-w-xl w-full p-8">
          <Shield size={40} className="mx-auto mb-4 text-terracotta/70" />
          <h1 className="text-2xl font-bold text-cream mb-3">Admin only</h1>
          <p className="text-sm text-sky/60 mb-6">Your account does not have admin access.</p>
          <Link to="/arena" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal text-cream font-semibold no-underline">
            Back to Arena
          </Link>
        </Card>
      </div>
    )
  }

  const selectedQuestionCount = Array.isArray(selectedEvent?.questions) ? selectedEvent.questions.length : 0

  return (
    <>
      <Helmet>
        <title>Admin Arena — MedAscend</title>
        <meta name="description" content="Admin contest management for MedAscend Arena." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <Link to="/arena" className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline mb-4">
                <ArrowLeft size={14} />
                Back to Arena
              </Link>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-cream tracking-tight">Arena Admin</h1>
                <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  {user?.role || 'admin'}
                </span>
              </div>
              <p className="mt-2 text-sm text-sky/70">Contest creation, state changes, registrations, and question management.</p>
            </div>
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center gap-2 rounded-xl border border-teal/20 bg-dark-card px-4 py-2 text-sm font-semibold text-cream transition-colors hover:border-teal/40 hover:bg-teal/10"
            >
              <RefreshCw size={16} className={listLoading || detailLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-xl border border-teal/20 bg-teal/5 p-4 text-sm text-teal-light">
              {message}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] mb-6">
            <Card className="p-5">
              {sectionTitle('List contests', 'Filter and pick an event to manage.')}
              <div className="space-y-3 mb-4">
                <Field label="Status filters (comma separated)">
                  <TextInput value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} placeholder="live,published" />
                </Field>
                <Field label="Type">
                  <Select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All types</option>
                    {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Page">
                    <TextInput type="number" min="1" value={filters.page} onChange={e => setFilters(f => ({ ...f, page: Number(e.target.value) || 1 }))} />
                  </Field>
                  <Field label="Page size">
                    <TextInput type="number" min="1" max="50" value={filters.page_size} onChange={e => setFilters(f => ({ ...f, page_size: Number(e.target.value) || 20 }))} />
                  </Field>
                </div>
              </div>
              <div className="space-y-2 max-h-[62vh] overflow-y-auto pr-1">
                {listLoading ? (
                  <div className="py-10 flex items-center justify-center text-sky/50">
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                ) : events.length === 0 ? (
                  <div className="py-10 text-center text-sm text-sky/40">No contests found.</div>
                ) : events.map(event => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedId(event.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedId === event.id ? 'border-teal/30 bg-teal/10' : 'border-teal/10 bg-dark-surface hover:border-teal/20'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-cream">{event.title || event.slug || event.id}</div>
                        <div className="mt-1 text-xs text-sky/50">{event.type || 'type unknown'} · {event.difficulty || 'mixed'}</div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${pillClass(event.status)}`}>
                        {event.status || 'unknown'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              {sectionTitle('Selected contest', 'View and edit contest metadata, question bank, and registrations.')}
              {!selectedId ? (
                <div className="rounded-2xl border border-dashed border-teal/15 px-6 py-16 text-center text-sm text-sky/40">
                  Select a contest from the list.
                </div>
              ) : detailLoading ? (
                <div className="py-20 flex items-center justify-center text-sky/50">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : selectedEvent ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${pillClass(selectedEvent.status)}`}>
                      {selectedEvent.status || 'unknown'}
                    </span>
                    <span className="text-sm text-sky/60">ID: {selectedEvent.id}</span>
                    <span className="text-sm text-sky/60">Questions: {selectedQuestionCount || selectedEvent.question_count || 0}</span>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <form onSubmit={handleSaveContest} className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-cream"><Save size={16} /> Edit contest</div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title"><TextInput value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></Field>
                        <Field label="Slug"><TextInput value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} /></Field>
                        <Field label="Type">
                          <Select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}>
                            {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </Select>
                        </Field>
                        <Field label="Difficulty">
                          <Select value={editForm.difficulty} onChange={e => setEditForm(f => ({ ...f, difficulty: e.target.value }))}>
                            {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </Select>
                        </Field>
                        <Field label="Starts at"><TextInput type="datetime-local" value={editForm.starts_at} onChange={e => setEditForm(f => ({ ...f, starts_at: e.target.value }))} /></Field>
                        <Field label="Ends at"><TextInput type="datetime-local" value={editForm.ends_at} onChange={e => setEditForm(f => ({ ...f, ends_at: e.target.value }))} /></Field>
                        <Field label="Status">
                          <Select value={statusDraft} onChange={e => setStatusDraft(e.target.value)}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </Select>
                        </Field>
                        <Field label="Duration minutes"><TextInput type="number" min="1" value={editForm.duration_minutes} onChange={e => setEditForm(f => ({ ...f, duration_minutes: e.target.value }))} /></Field>
                        <Field label="Question count"><TextInput type="number" min="0" value={editForm.question_count} onChange={e => setEditForm(f => ({ ...f, question_count: e.target.value }))} /></Field>
                        <Field label="Entry fee (paise)"><TextInput type="number" min="0" value={editForm.entry_fee} onChange={e => setEditForm(f => ({ ...f, entry_fee: e.target.value }))} /></Field>
                        <Field label="Prize pool (paise)"><TextInput type="number" min="0" value={editForm.prize_pool} onChange={e => setEditForm(f => ({ ...f, prize_pool: e.target.value }))} /></Field>
                        <Field label="Subject id"><TextInput value={editForm.subject_id} onChange={e => setEditForm(f => ({ ...f, subject_id: e.target.value }))} /></Field>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-60">
                          <Save size={16} /> Save changes
                        </button>
                        <button type="button" disabled={saving || !statusDraft} onClick={handleStatusUpdate} className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold disabled:opacity-60">
                          <ChevronRight size={16} /> Update status
                        </button>
                        <button type="button" disabled={saving} onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-2.5 text-sm font-semibold text-terracotta disabled:opacity-60">
                          <Trash2 size={16} /> Delete draft
                        </button>
                      </div>
                    </form>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-cream"><Users size={16} /> Registrations</div>
                      <div className="rounded-2xl border border-teal/10 bg-dark-surface p-4 overflow-y-auto" style={{ maxHeight: '330px' }}>
                        {Array.isArray(registrations) && registrations.length > 0 ? registrations.map((row, index) => (
                          <div key={row.id || row.user_id || index} className="border-b border-teal/5 py-3 last:border-b-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-cream">{row.full_name || row.name || row.email || `Registration ${index + 1}`}</p>
                                <p className="text-xs text-sky/50">{row.payment_status || row.participation_state || row.status || 'registered'}</p>
                              </div>
                              <span className="text-xs text-sky/40">{row.registered_at || row.created_at || ''}</span>
                            </div>
                          </div>
                        )) : (
                          <div className="py-12 text-center text-sm text-sky/40">No registrations returned.</div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-teal/10 bg-dark-surface p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-cream"><BookOpen size={16} /> Questions</div>
                        <div className="text-xs text-sky/50">Use JSON bodies for add, bulk add, reorder, and remove actions. This mirrors the API contract directly.</div>
                        <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: '220px' }}>
                          {Array.isArray(selectedEvent.questions) && selectedEvent.questions.length > 0 ? selectedEvent.questions.map((question, index) => (
                            <div key={question.id || index} className="rounded-xl border border-teal/10 bg-dark-card p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-cream">{question.question_text || question.prompt || question.text || `Question ${index + 1}`}</p>
                                  <p className="mt-1 text-xs text-sky/50">{question.id || question.question_id || ''}</p>
                                </div>
                                {(question.id || question.question_id) && (
                                  <button type="button" onClick={() => handleRemoveQuestion(question.id || question.question_id)} className="text-xs font-semibold text-terracotta hover:text-terracotta/80">
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          )) : (
                            <div className="py-6 text-center text-sm text-sky/40">No questions loaded in detail.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-3">
                    <form onSubmit={handleCreate} className="rounded-2xl border border-teal/10 bg-dark-surface p-4 space-y-4">
                      {sectionTitle('Create contest', 'Create a new draft contest.')}
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title"><TextInput value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} /></Field>
                        <Field label="Slug"><TextInput value={createForm.slug} onChange={e => setCreateForm(f => ({ ...f, slug: e.target.value }))} /></Field>
                        <Field label="Type"><Select value={createForm.type} onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))}>{TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</Select></Field>
                        <Field label="Difficulty"><Select value={createForm.difficulty} onChange={e => setCreateForm(f => ({ ...f, difficulty: e.target.value }))}>{DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</Select></Field>
                        <Field label="Status"><Select value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))}>{STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</Select></Field>
                        <Field label="Duration minutes"><TextInput type="number" min="1" value={createForm.duration_minutes} onChange={e => setCreateForm(f => ({ ...f, duration_minutes: e.target.value }))} /></Field>
                        <Field label="Question count"><TextInput type="number" min="0" value={createForm.question_count} onChange={e => setCreateForm(f => ({ ...f, question_count: e.target.value }))} /></Field>
                        <Field label="Entry fee (paise)"><TextInput type="number" min="0" value={createForm.entry_fee} onChange={e => setCreateForm(f => ({ ...f, entry_fee: e.target.value }))} /></Field>
                        <Field label="Prize pool (paise)"><TextInput type="number" min="0" value={createForm.prize_pool} onChange={e => setCreateForm(f => ({ ...f, prize_pool: e.target.value }))} /></Field>
                        <Field label="Starts at"><TextInput type="datetime-local" value={createForm.starts_at} onChange={e => setCreateForm(f => ({ ...f, starts_at: e.target.value }))} /></Field>
                        <Field label="Ends at"><TextInput type="datetime-local" value={createForm.ends_at} onChange={e => setCreateForm(f => ({ ...f, ends_at: e.target.value }))} /></Field>
                      </div>
                      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-60">
                        <Plus size={16} /> Create contest
                      </button>
                    </form>

                    <form onSubmit={handleAddQuestion} className="rounded-2xl border border-teal/10 bg-dark-surface p-4 space-y-4">
                      {sectionTitle('Add question', 'POST /questions with a JSON body.')}
                      <TextArea rows={14} value={questionForms.questionJson} onChange={e => setQuestionForms(f => ({ ...f, questionJson: e.target.value }))} className="font-mono text-xs" />
                      <button type="submit" disabled={saving || !selectedId} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-60">
                        <Plus size={16} /> Add question
                      </button>
                    </form>

                    <div className="space-y-4 rounded-2xl border border-teal/10 bg-dark-surface p-4">
                      {sectionTitle('Bulk add & reorder', 'POST /questions/bulk and PUT /questions/reorder.')}
                      <form onSubmit={handleBulkAdd} className="space-y-3">
                        <TextArea rows={8} value={questionForms.bulkJson} onChange={e => setQuestionForms(f => ({ ...f, bulkJson: e.target.value }))} className="font-mono text-xs" />
                        <button type="submit" disabled={saving || !selectedId} className="inline-flex items-center gap-2 rounded-xl border border-teal/20 bg-teal/10 px-4 py-2.5 text-sm font-semibold text-teal-light disabled:opacity-60">
                          <Plus size={16} /> Bulk add
                        </button>
                      </form>
                      <form onSubmit={handleReorder} className="space-y-3 pt-2 border-t border-teal/10">
                        <TextArea rows={8} value={questionForms.orderJson} onChange={e => setQuestionForms(f => ({ ...f, orderJson: e.target.value }))} className="font-mono text-xs" />
                        <button type="submit" disabled={saving || !selectedId} className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold disabled:opacity-60">
                          <ChevronRight size={16} /> Reorder
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-teal/15 px-6 py-16 text-center text-sm text-sky/40">
                  Contest detail could not be loaded.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
