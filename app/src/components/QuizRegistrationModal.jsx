import { useState, useEffect, useRef } from 'react'
import {
  X, ChevronRight, ChevronLeft, Trophy, Clock, Users, Zap,
  Shield, AlertCircle, Check, Loader2, BookOpen, Target, CreditCard,
} from 'lucide-react'
import { loadRazorpayCheckoutScript, readApiErrorMessage } from '../lib/api'

// Auto-detect if scroll is needed; if not, immediately unlock
function useScrollGate() {
  const ref = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.scrollHeight <= el.clientHeight + 40) setScrolled(true)
  }, [])
  const onScroll = (e) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) setScrolled(true)
  }
  return { ref, scrolled, onScroll }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function formatRupees(paise) {
  if (!paise) return '₹0'
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

function useCountdown(target) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    if (!target) return
    const tick = () => setDiff(Math.max(0, new Date(target) - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  if (diff <= 0) return null
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS = ['Details', 'Disclaimer', 'Instructions', 'Confirm']

function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-4">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all
            ${i < step ? 'bg-teal text-dark' : i === step ? 'bg-teal/20 border border-teal/60 text-teal' : 'bg-white/5 border border-white/10 text-white/25'}`}>
            {i < step ? <Check size={10} strokeWidth={3} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-6 h-px transition-colors ${i < step ? 'bg-teal/50' : 'bg-white/8'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 0: Quiz Details ──────────────────────────────────────────────────────

function StepDetails({ contest, onNext, onClose, isFree }) {
  const countdown = useCountdown(contest.starts_at)
  const prize = contest.prize_pool_estimate ?? contest.prize_pool ?? 0

  const PRIZE_SPLIT = [
    [1, 150000], [2, 100000], [3, 65000], [4, 45000], [5, 35000],
    [6, 28000], [7, 24000], [8, 21000], [9, 19000], [10, 17000],
    [11, 15000], [12, 14000], [13, 13000], [14, 12000], [15, 11000],
    [16, 10500], [17, 10400], [18, 10300], [19, 10200], [20, 10100],
    [21, 10000], [22, 9900], [23, 9900], [24, 9900], [25, 9900],
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Title */}
        <div>
          <h2 className="text-lg font-extrabold text-white leading-tight">{contest.title}</h2>
          <p className="text-xs text-white/35 mt-0.5 capitalize">{contest.type ?? contest.contest_type}{contest.difficulty ? ` · ${contest.difficulty}` : ''}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Date & Time', formatDate(contest.starts_at), 'text-white'],
            ['Duration', `${contest.duration_minutes} min`, 'text-white'],
            ['Entry Fee', isFree ? 'FREE' : formatRupees(contest.entry_fee), isFree ? 'text-teal font-bold' : 'text-gold font-bold'],
            ['Registered', `${contest.registered_count ?? 0} joined`, 'text-white'],
            ...(contest.question_count > 0 ? [['Questions', `${contest.question_count} Qs`, 'text-white']] : []),
          ].map(([label, val, cls]) => (
            <div key={label} className="rounded-2xl bg-white/4 border border-white/6 p-3">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.12em] mb-1">{label}</p>
              <p className={`text-sm ${cls}`}>{val}</p>
            </div>
          ))}
          {countdown && (
            <div className="rounded-2xl bg-teal/10 border border-teal/25 p-3">
              <p className="text-[10px] text-teal/50 uppercase tracking-[0.12em] mb-1">Starts in</p>
              <p className="text-sm font-bold text-teal">{countdown}</p>
            </div>
          )}
        </div>

        {/* Prize pool */}
        {!isFree && prize > 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3.5">
            <div className="flex items-center gap-2 mb-2.5">
              <Trophy size={14} className="text-yellow-400" />
              <p className="text-xs font-bold text-yellow-400">Prize Pool — {formatRupees(prize)}</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRIZE_SPLIT.slice(0, 10).map(([rank, paise]) => (
                <div key={rank} className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-xl bg-white/5">
                  <span className={`font-bold ${rank <= 3 ? 'text-yellow-400' : 'text-white/40'}`}>#{rank}</span>
                  <span className="text-white/80 font-semibold">{formatRupees(paise)}</span>
                </div>
              ))}
              <div className="col-span-2 text-center text-[10px] text-white/25 pt-1">Top 25 win · Ranks 22–25 recover entry fee</div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-white/6">
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal text-dark font-bold text-sm hover:bg-teal/90 active:scale-[0.98] transition-all cursor-pointer border-none"
        >
          {isFree ? 'Continue' : 'Next'} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Step 1: Disclaimer ────────────────────────────────────────────────────────

function StepDisclaimer({ onNext, onBack, isFree }) {
  const { ref, scrolled, onScroll } = useScrollGate()
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={15} className="text-white/60" />
        <h2 className="text-sm font-bold text-white">Disclaimer</h2>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-3.5 space-y-2">
          {[
            'These quizzes are games of skill. Outcomes depend on knowledge, accuracy, and speed — not chance.',
            'Participation is voluntary and requires a one-time entry fee per paid quiz.',
            'This platform is an educational and competitive tool. It is not affiliated with any university, NMC, NBE, or official medical authority.',
            'Quiz content is for practice and learning. Questions are not guaranteed to reflect official examination standards.',
            'Prize amounts are fixed and announced before each quiz and do not change with participant numbers.',
            'The platform reserves the right to disqualify participants found violating fair-play rules, with forfeiture of entry fee and winnings.',
            'Participants must be 18 years or older to join paid quizzes.',
          ].map((t, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-teal/50 shrink-0 mt-0.5">·</span>
              <p className="text-xs text-white/60 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>

        {!isFree && (
          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-3.5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-400/70 mb-1">Payment Terms</p>
            {[
              'Entry is confirmed only after successful Razorpay payment. Your seat is reserved for 10 minutes once payment is initiated.',
              'Prizes are credited to your in-app wallet within 24 hours of the quiz ending.',
              'A PAN card is required to withdraw winnings. TDS is deducted as per Indian tax law.',
              'Withdrawals cannot be processed without a valid PAN on record.',
            ].map((t, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-yellow-500/40 shrink-0 mt-0.5">·</span>
                <p className="text-xs text-white/55 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        )}

        {!scrolled && <p className="text-[11px] text-white/30 pb-2 text-center">↓ Scroll down to confirm</p>}
      </div>

      <div className="pt-3 mt-3 border-t border-white/6 space-y-2">
        <label className={`flex items-start gap-3 cursor-pointer rounded-2xl border p-3 transition-all ${agreed ? 'border-teal/35 bg-teal/8' : 'border-white/8 bg-white/2'} ${!scrolled ? 'opacity-25 pointer-events-none' : ''}`}>
          <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all ${agreed ? 'bg-teal border-teal' : 'border-white/15'}`}>
            {agreed && <Check size={10} strokeWidth={3} className="text-dark" />}
          </div>
          <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} disabled={!scrolled} />
          <span className="text-xs text-white/55 leading-relaxed">
            I have read and agree to the Disclaimer and Terms above.
          </span>
        </label>

        <div className="flex gap-2">
          <button onClick={onBack} className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-white/8 text-white/45 text-sm hover:bg-white/5 transition-all cursor-pointer bg-transparent">
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!agreed}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal text-dark font-bold text-sm hover:bg-teal/90 active:scale-[0.98] transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            I Agree <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Instructions + Fair Play ─────────────────────────────────────────

function StepInstructions({ contest, onNext, onBack }) {
  const { ref, scrolled, onScroll } = useScrollGate()
  const qCount = contest.question_count || 'N'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={15} className="text-teal" />
        <h2 className="text-sm font-bold text-white">Instructions & Fair Play</h2>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="space-y-1.5">
          {[
            `This quiz has ${qCount} questions. You get 45 seconds per question.`,
            '+10 to +15 for a correct answer (harder = more points). −3 for wrong. 0 for unanswered.',
            'Speed bonus: every second left on the clock adds +1 point. Answer instantly to maximise.',
            'Streak bonus: consecutive correct answers unlock milestones — 3→+3, 5→+6, 7→+10, 10→+15, 15→+25, 20→+40.',
            'Once you answer or the timer runs out, you move on. You cannot go back.',
            'The quiz starts at the exact scheduled time for everyone. Join the lobby 5 minutes early.',
            "Rank is decided by: total score → correct count → speed. Don't waste time.",
            "Only the Top 25 winners are shown publicly. You'll see your own rank privately.",
            'Use a stable internet connection. Disconnection may auto-submit your quiz.',
          ].map((text, i) => (
            <div key={i} className="flex gap-2.5 py-1.5 px-2 rounded-xl hover:bg-white/3 transition-colors">
              <span className="w-4.5 h-4.5 rounded-full bg-teal/15 text-teal text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-xs text-white/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Scoring */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal/80 mb-2.5">Scoring Summary</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
            {[['Easy', '+10', 'text-white/60'], ['Medium', '+12', 'text-white/60'], ['Hard', '+15', 'text-white/60']].map(([d, p, c]) => (
              <div key={d} className="rounded-xl bg-white/5 p-2">
                <p className={`text-[10px] ${c} mb-0.5`}>{d}</p>
                <p className="font-bold text-teal text-sm">{p}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/45">
            <span>⏱ +1/sec left (max +44)</span>
            <span className="text-red-400/70">✗ Wrong = −3</span>
            <span className="text-orange-400/70">🔥 Streak up to +99</span>
          </div>
        </div>

        {/* Fair Play */}
        <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-400/70 mb-2">Fair Play & Anti-Cheat</p>
          <div className="space-y-1.5">
            {[
              'Stay on screen. 1st tab switch = warning, 2nd = warning, 3rd = quiz auto-submits.',
              'Screenshots and screen recording are disabled. Attempting this forfeits your entry.',
              'You cannot re-attempt a quiz once your session has started or been submitted.',
              'Sharing questions during a live quiz results in immediate disqualification.',
              'Once registered for a quiz that runs, entry fees are non-refundable.',
              'If minimum participants not met, all entry fees are auto-refunded.',
            ].map((t, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-red-400/40 shrink-0 mt-0.5">·</span>
                <p className="text-xs text-white/55 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-white/6 flex gap-2">
        <button onClick={onBack} className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-white/8 text-white/50 text-sm hover:bg-white/5 transition-all cursor-pointer bg-transparent">
          <ChevronLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!scrolled}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal text-dark font-bold text-sm hover:bg-teal/90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          Understood <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Confirm & Register ────────────────────────────────────────────────

function StepConfirm({ contest, onConfirm, onBack, registering, paymentStatus, paymentAttempted, error, isFree }) {
  const prize = contest.prize_pool_estimate ?? contest.prize_pool ?? 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target size={15} className="text-teal" />
        <h2 className="text-sm font-bold text-white">
          {isFree ? 'Enter Quiz' : 'Confirm Registration'}
        </h2>
      </div>

      <div className="flex-1 space-y-3">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2.5">
          {[
            ['Quiz', <span className="text-white font-semibold text-right max-w-[60%] truncate">{contest.title}</span>],
            ['Starts', <span className="text-white font-semibold">{formatDate(contest.starts_at)}</span>],
            ['Duration', <span className="text-white font-semibold">{contest.duration_minutes} min</span>],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center text-xs">
              <span className="text-white/40">{label}</span>
              {val}
            </div>
          ))}
          <div className="flex justify-between items-center text-xs pt-2 border-t border-white/6">
            <span className="text-white/40">Entry Fee</span>
            <span className={`font-bold text-base ${isFree ? 'text-teal' : 'text-gold'}`}>
              {isFree ? 'FREE' : formatRupees(contest.entry_fee)}
            </span>
          </div>
          {!isFree && prize > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Prize Pool</span>
              <span className="font-bold text-gold">{formatRupees(prize)}</span>
            </div>
          )}
        </div>

        {!isFree && (
          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-3 text-xs text-yellow-400/75 leading-relaxed">
            You will be redirected to Razorpay to pay {formatRupees(contest.entry_fee)}. Your seat is reserved for 10 minutes once the order is created.
          </div>
        )}

        {isFree && (
          <div className="rounded-2xl border border-teal/15 bg-teal/5 p-3 text-xs text-teal/75 leading-relaxed">
            This is a free quiz. No entry fee required. Join the lobby before the quiz starts.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/8 p-3 text-xs text-red-400">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-white/6 flex gap-2">
        {!registering && !paymentStatus && !paymentAttempted && (
          <button onClick={onBack} className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-white/8 text-white/50 text-sm hover:bg-white/5 transition-all cursor-pointer bg-transparent">
            <ChevronLeft size={14} /> Back
          </button>
        )}
        <button
          onClick={onConfirm}
          disabled={registering}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal text-dark font-bold text-sm hover:bg-teal/90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer border-none"
        >
          {paymentStatus === 'confirming'
            ? <><Loader2 size={15} className="animate-spin" /> Confirming payment...</>
            : paymentStatus === 'awaiting_payment'
            ? <><Loader2 size={15} className="animate-spin" /> Awaiting payment...</>
            : registering
            ? <><Loader2 size={15} className="animate-spin" /> {isFree ? 'Registering...' : 'Opening payment...'}</>
            : isFree
            ? <><Zap size={15} /> Enter Lobby</>
            : <><CreditCard size={15} /> Pay ₹{contest.entry_fee ? (contest.entry_fee / 100).toLocaleString('en-IN') : '0'}</>}
        </button>
      </div>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export default function QuizRegistrationModal({ contest, onClose, onRegistered, onWalletChanged, token, onAuth }) {
  const [step, setStep] = useState(0)
  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('') // '' | 'awaiting_payment' | 'confirming'
  const [paymentAttempted, setPaymentAttempted] = useState(false)
  const pollRef = useRef(null)
  const timeoutRef = useRef(null)
  const handlerFiredRef = useRef(false) // track if Razorpay handler fired (payment attempted)

  const isFree = !contest.entry_fee || contest.entry_fee === 0

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
  }

  useEffect(() => () => stopPolling(), [])

  const pollForConfirmation = () => {
    setPaymentStatus('confirming')
    setRegError('')
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/arena/quizzes/${contest.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const payStatus = data?.my_registration?.payment_status
        // resolve on paid (webhook confirmed) OR payment_pending (seat reserved, webhook in flight)
        if (payStatus === 'paid' || payStatus === 'payment_pending') {
          stopPolling()
          onRegistered(contest.id)
          onClose()
        }
      } catch { /* keep polling */ }
    }, 2000)

    // After 30s show a message but keep polling — webhook may still be in flight
    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) {
        setRegistering(false)
        setPaymentStatus('confirming')
        setRegError('Payment is processing — please wait, do not close this screen.')
      }
    }, 30000)

    // Hard stop at 3 minutes
    setTimeout(() => {
      if (pollRef.current) {
        stopPolling()
        setRegistering(false)
        setPaymentStatus('')
        setRegError('Payment confirmation taking too long. If money was deducted, refresh the arena page — you will be shown as registered.')
      }
    }, 180000)
  }

  const handleConfirm = async () => {
    if (!token) { onClose(); onAuth(); return }
    setRegistering(true)
    setRegError('')

    // Free quiz
    if (isFree) {
      try {
        const res = await fetch(`/api/v1/arena/quizzes/${contest.id}/register`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_method: 'wallet' }),
        })
        if (res.status === 409) { onRegistered(contest.id); onClose(); return }
        if (!res.ok) throw new Error(await readApiErrorMessage(res, 'Registration failed. Please try again.'))
        onRegistered(contest.id)
        onClose()
      } catch (err) {
        setRegError(err.message)
        setRegistering(false)
      }
      return
    }

    // Paid quiz — Razorpay direct-pay flow (§7)
    try {
      const scriptLoaded = await loadRazorpayCheckoutScript()
      if (!scriptLoaded) throw new Error('Unable to load payment gateway. Please try again.')

      const orderRes = await fetch(`/api/v1/arena/quizzes/${contest.id}/create-payment-order`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (orderRes.status === 409) { onRegistered(contest.id); onClose(); return }
      if (!orderRes.ok) throw new Error(await readApiErrorMessage(orderRes, 'Could not create payment order. Please try again.'))
      const order = await orderRes.json()

      handlerFiredRef.current = false
      setPaymentStatus('awaiting_payment')

      const rzp = new window.Razorpay({
        key: order.razorpay_key,
        amount: order.amount_paise,
        currency: order.currency,
        order_id: order.order_id,
        name: 'MedAscend Arena',
        description: `Quiz Entry — ${contest.title}`,
        receipt: order.receipt,
        theme: { color: '#2dd4bf' },
        handler: () => {
          handlerFiredRef.current = true
          setPaymentAttempted(true)
          pollForConfirmation()
        },
        modal: {
          ondismiss: () => {
            // ondismiss fires on any close — including after successful payment
            // Only treat as cancelled if handler never fired
            if (!handlerFiredRef.current) {
              stopPolling()
              setRegistering(false)
              setPaymentStatus('')
              setRegError('Payment cancelled. Your seat is reserved for 10 minutes — you can try again.')
            }
          },
          // Razorpay web SDK uses this for payment failures
          on_error: (error) => {
            handlerFiredRef.current = false
            stopPolling()
            setRegistering(false)
            setPaymentStatus('')
            setRegError(error?.description || error?.reason || 'Payment failed. Please try again.')
          },
        },
      })
      rzp.open()
    } catch (err) {
      setRegError(err.message)
      setRegistering(false)
      setPaymentStatus('')
    }
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !paymentStatus) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, paymentStatus])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — block close only while actively polling */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={paymentStatus ? undefined : onClose} />

      {/* Panel — fixed height so inner flex chain has a definite constraint to scroll against */}
      <div className="relative z-10 w-full max-w-md h-[90vh] bg-[#0f1923] border border-white/8 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">

        {/* Top accent line */}
        <div className={`h-0.5 w-full shrink-0 ${isFree ? 'bg-gradient-to-r from-teal/0 via-teal to-teal/0' : 'bg-gradient-to-r from-gold/0 via-gold to-gold/0'}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${isFree ? 'bg-teal/15 text-teal' : 'bg-gold/15 text-gold'}`}>
            {isFree ? 'Free Quiz' : `₹${contest.entry_fee ? (contest.entry_fee / 100).toLocaleString('en-IN') : '0'} Entry`}
          </span>
          <button
            onClick={paymentStatus ? undefined : onClose}
            disabled={!!paymentStatus}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/15 bg-white/8 hover:bg-white/18 text-white/70 hover:text-white border-none cursor-pointer transition-all disabled:opacity-15 disabled:cursor-not-allowed"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step dots */}
        <div className="px-5 pt-3 shrink-0">
          <StepDots step={step} />
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5 shrink-0" />

        {/* Content — flex-1 + min-h-0 gives it the remaining height to scroll within */}
        <div className="flex-1 min-h-0 px-5 py-4 flex flex-col">
          {step === 0 && (
            <StepDetails contest={contest} isFree={isFree} onNext={() => setStep(1)} onClose={onClose} />
          )}
          {step === 1 && (
            <StepDisclaimer isFree={isFree} onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <StepInstructions contest={contest} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepConfirm
              contest={contest}
              isFree={isFree}
              onConfirm={handleConfirm}
              onBack={() => setStep(2)}
              registering={registering}
              paymentStatus={paymentStatus}
              paymentAttempted={paymentAttempted}
              error={regError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
