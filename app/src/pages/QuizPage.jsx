import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useArenaStore } from '../stores/arenaStore'

const API = '/api/v1'

function Toast({ message, type = 'warning' }) {
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl
      ${type === 'warning' ? 'bg-gold/90 text-dark' : 'bg-terracotta/90 text-cream'}`}>
      <AlertTriangle size={16} />
      {message}
    </div>
  )
}

export default function QuizPage() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const activeToken = token || localStorage.getItem('access_token')

  const {
    questions, currentIdx, selectedOption, timeLeft, submitting,
    runningScore, liveRank, streak, lastResult, switchCount,
    initQuiz, selectOption, tickTimer, setSubmitting, afterSubmit,
    nextQuestion, incrementSwitchCount,
  } = useArenaStore()

  const [initializing, setInitializing] = useState(true)
  const [initError, setInitError] = useState('')
  const [toast, setToast] = useState(null)
  const [terminated, setTerminated] = useState(false)
  const [resultVisible, setResultVisible] = useState(false)

  const timerRef = useRef(null)
  const submittingRef = useRef(false)

  const currentQuestion = questions[currentIdx] || null
  const isLastQuestion = currentIdx === questions.length - 1

  // On mount — start quiz and load questions
  useEffect(() => {
    if (!activeToken) { navigate('/arena'); return }

    const init = async () => {
      try {
        await fetch(`${API}/arena/quizzes/${contestId}/start`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        })
        const res = await fetch(`${API}/arena/quizzes/${contestId}/questions`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        })
        if (!res.ok) throw new Error('Failed to load questions')
        const data = await res.json()
        const qs = Array.isArray(data) ? data : data.questions || []
        if (qs.length === 0) throw new Error('No questions available')
        initQuiz(contestId, qs)
      } catch (err) {
        setInitError(err.message)
      } finally {
        setInitializing(false)
      }
    }
    init()
  }, [])

  // Timer per question
  useEffect(() => {
    if (!currentQuestion || terminated || initializing) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const { timeLeft: t } = useArenaStore.getState()
      if (t <= 1) {
        clearInterval(timerRef.current)
        if (!submittingRef.current) {
          submittingRef.current = true
          submitAnswer(null)
        }
      } else {
        tickTimer()
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIdx, currentQuestion?.id, terminated, initializing])

  // Anti-cheat
  useEffect(() => {
    if (initializing) return
    const handler = () => {
      if (document.hidden && !terminated) {
        const newCount = useArenaStore.getState().switchCount + 1
        incrementSwitchCount()
        fetch(`${API}/arena/quizzes/${contestId}/report-switch`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        }).catch(() => {})

        if (newCount >= 3) {
          setTerminated(true)
          clearInterval(timerRef.current)
          setToast({ message: 'Quiz ended due to tab switching', type: 'error' })
        } else {
          setToast({ message: `Warning: tab switch ${newCount}/3`, type: 'warning' })
          setTimeout(() => setToast(null), 3000)
        }
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [contestId, activeToken, terminated, initializing])

  const submitAnswer = useCallback(async (option) => {
    if (submitting) return
    clearInterval(timerRef.current)
    setSubmitting(true)

    const budget = currentQuestion?.time_budget_sec ?? 60
    const timeTaken = Math.max(0, budget - useArenaStore.getState().timeLeft)

    try {
      const res = await fetch(`${API}/arena/quizzes/${contestId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          selected_option: option,
          time_taken_sec: timeTaken,
        }),
      })
      if (res.ok) {
        const result = await res.json()
        afterSubmit(result)
        setResultVisible(true)
        setTimeout(async () => {
          setResultVisible(false)
          submittingRef.current = false
          if (isLastQuestion || result.is_finished) {
            await finishQuiz()
          } else {
            nextQuestion()
          }
        }, 1500)
      } else {
        setSubmitting(false)
        submittingRef.current = false
      }
    } catch {
      setSubmitting(false)
      submittingRef.current = false
    }
  }, [contestId, activeToken, currentQuestion, submitting, isLastQuestion])

  const finishQuiz = useCallback(async () => {
    try {
      await fetch(`${API}/arena/quizzes/${contestId}/finish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${activeToken}` },
      })
    } catch { /* best-effort */ }
    navigate(`/arena/${contestId}/results`)
  }, [contestId, activeToken, navigate])

  const handleSubmit = () => {
    if (submittingRef.current || submitting || terminated) return
    submittingRef.current = true
    submitAnswer(selectedOption)
  }

  // Loading state
  if (initializing) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-3 text-sky/50">
        <Loader2 size={32} className="animate-spin text-teal" />
        <span className="text-sm">Loading quiz...</span>
      </div>
    )
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle size={40} className="text-terracotta" />
        <p className="text-cream font-semibold">{initError}</p>
        <button
          onClick={() => navigate('/arena')}
          className="px-6 py-3 bg-teal text-cream font-semibold rounded-xl cursor-pointer border-none"
        >
          Back to Arena
        </button>
      </div>
    )
  }

  if (terminated) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6 px-6 text-center">
        {toast && <Toast message={toast.message} type={toast.type} />}
        <AlertTriangle size={48} className="text-terracotta" />
        <h2 className="text-2xl font-bold text-cream">Quiz Terminated</h2>
        <p className="text-sky/60 text-sm">You switched tabs too many times.</p>
        <button
          onClick={() => navigate('/arena')}
          className="px-6 py-3 bg-teal text-cream font-semibold rounded-xl cursor-pointer border-none"
        >
          Back to Arena
        </button>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-teal" />
      </div>
    )
  }

  const budget = currentQuestion.time_budget_sec ?? 60
  const timerPct = budget > 0 ? (timeLeft / budget) * 100 : 0
  const timerColor = timerPct > 50 ? 'teal' : timerPct > 20 ? 'gold' : 'terracotta'

  // Options can be array of {key, text} or array of strings
  const options = (currentQuestion.options || []).map((opt, i) => ({
    key: opt.key ?? String.fromCharCode(65 + i),
    text: opt.text ?? opt,
  }))

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Top bar */}
      <div className="bg-dark-surface border-b border-teal/10 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
          <span className="text-sky/60">
            Question <span className="text-cream">{currentIdx + 1}</span>/{questions.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sky/60">Score <span className="text-teal font-bold">{runningScore}</span></span>
            {liveRank && <span className="text-sky/60">Rank <span className="text-gold font-bold">#{liveRank}</span></span>}
            {streak > 1 && <span className="text-terracotta font-bold">{streak}x streak</span>}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-dark-surface w-full">
        <div
          className={`h-full transition-all duration-1000 bg-${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {currentQuestion.subject_name && (
              <span className="px-2.5 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold border border-teal/15">
                {currentQuestion.subject_name}
              </span>
            )}
            {currentQuestion.topic && (
              <span className="px-2.5 py-1 rounded-full bg-sky/10 text-sky text-xs font-semibold border border-sky/15">
                {currentQuestion.topic}
              </span>
            )}
          </div>
          <div className={`text-2xl font-extrabold tabular-nums text-${timerColor}`}>
            {timeLeft}s
          </div>
        </div>

        <p className="text-lg md:text-xl font-semibold text-cream leading-relaxed mb-8">
          {currentQuestion.question_text || currentQuestion.text}
        </p>

        {currentQuestion.image_url && (
          <img src={currentQuestion.image_url} alt="" className="rounded-xl mb-6 max-h-64 object-contain" />
        )}

        <div className="grid grid-cols-1 gap-3 mb-8">
          {options.map(({ key, text }) => {
            const isSelected = selectedOption === key
            const isDisabled = !!lastResult || submitting

            let optClass = 'border-teal/15 bg-dark-surface text-cream/80 hover:border-teal/30 hover:bg-teal/5'
            if (lastResult) {
              if (key === lastResult.correct_option) {
                optClass = 'border-teal bg-teal/15 text-teal'
              } else if (isSelected && !lastResult.is_correct) {
                optClass = 'border-teal/40 bg-teal/10 text-teal/70'
              } else {
                optClass = 'border-teal/10 bg-dark-surface text-cream/40'
              }
            } else if (isSelected) {
              optClass = 'border-teal bg-teal/15 text-teal'
            }

            return (
              <button
                key={key}
                onClick={() => !isDisabled && selectOption(key)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-150 text-left cursor-pointer ${optClass} disabled:cursor-default`}
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-current shrink-0">
                  {key}
                </span>
                <span className="flex-1">{text}</span>
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {resultVisible && lastResult && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-3 ${
            lastResult.is_correct ? 'bg-teal/10 border border-teal/20 text-teal'
            : lastResult.is_correct === false ? 'bg-teal/10 border border-teal/20 text-teal/70'
            : 'bg-sky/10 border border-sky/20 text-sky'
          }`}>
            <span>
              {lastResult.is_correct === true && '✓ Correct!'}
              {lastResult.is_correct === false && '✗ Wrong'}
              {lastResult.is_correct === null && "⏱ Time's up"}
            </span>
            {lastResult.points_earned != null && (
              <span className="text-xs opacity-80">+{lastResult.points_earned} pts</span>
            )}
            {lastResult.speed_bonus > 0 && (
              <span className="text-xs opacity-80">⚡ +{lastResult.speed_bonus} speed</span>
            )}
            {lastResult.streak_bonus > 0 && (
              <span className="text-xs opacity-80">🔥 +{lastResult.streak_bonus} streak</span>
            )}
          </div>
        )}

        {!lastResult && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || submitting}
            className="w-full py-4 bg-teal text-cream font-bold text-base rounded-xl hover:bg-teal/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting
              ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Submitting...</span>
              : isLastQuestion ? 'Submit & Finish' : 'Submit Answer'
            }
          </button>
        )}
      </div>
    </div>
  )
}
