import { create } from 'zustand'

export const useArenaStore = create((set, get) => ({
  contestId: null,
  questions: [],
  currentIdx: 0,
  selectedOption: null,
  timeLeft: 0,
  submitting: false,
  runningScore: 0,
  liveRank: null,
  totalParticipants: 0,
  streak: 0,
  lastResult: null,
  switchCount: 0,
  status: 'idle', // 'idle' | 'live' | 'finished'

  initQuiz: (contestId, questions) => set({
    contestId,
    questions,
    currentIdx: 0,
    selectedOption: null,
    timeLeft: questions[0]?.time_budget_sec ?? 60,
    runningScore: 0,
    liveRank: null,
    totalParticipants: 0,
    streak: 0,
    lastResult: null,
    switchCount: 0,
    submitting: false,
    status: 'live',
  }),

  selectOption: (option) => set({ selectedOption: option }),

  tickTimer: () => set(state => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

  setSubmitting: (val) => set({ submitting: val }),

  afterSubmit: (result) => set(state => ({
    runningScore: result.running_score ?? state.runningScore,
    liveRank: result.live_rank ?? state.liveRank,
    totalParticipants: result.total_participants ?? state.totalParticipants,
    streak: result.new_streak ?? state.streak,
    lastResult: result,
    submitting: false,
    status: state.currentIdx + 1 >= state.questions.length ? 'finished' : state.status,
  })),

  nextQuestion: () => set(state => ({
    currentIdx: state.currentIdx + 1,
    selectedOption: null,
    timeLeft: state.questions[state.currentIdx + 1]?.time_budget_sec ?? 60,
    lastResult: null,
  })),

  incrementSwitchCount: () => set(state => ({ switchCount: state.switchCount + 1 })),

  // keep old names as aliases so nothing else breaks
  setTimeLeft: (t) => set({ timeLeft: t }),
  applyResult: (result) => get().afterSubmit(result),
  incrementSwitch: () => get().incrementSwitchCount(),
  setStatus: (status) => set({ status }),
  setQuestions: (questions) => set({ questions, currentIdx: 0, status: 'live' }),
  setContest: (id) => set({ contestId: id }),
  reset: () => set({
    contestId: null, questions: [], currentIdx: 0, selectedOption: null,
    timeLeft: 0, submitting: false, runningScore: 0, liveRank: null,
    totalParticipants: 0, streak: 0, lastResult: null, status: 'idle', switchCount: 0,
  }),
}))
