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
  flaggedQuestionIds: [],
  bookmarkedQuestionIds: [],
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
    flaggedQuestionIds: [],
    bookmarkedQuestionIds: [],
    submitting: false,
    status: 'live',
  }),

  hydrateLiveState: (liveState = {}) => set(state => {
    const order = Array.isArray(liveState.question_order) ? liveState.question_order : []
    const reorderedQuestions = order.length > 0
      ? order.map(questionId => state.questions.find(question => question.id === questionId)).filter(Boolean)
      : state.questions
    const nextQuestions = reorderedQuestions.length > 0 ? reorderedQuestions : state.questions
    const requestedIdx = Number.isInteger(liveState.current_question_index) ? liveState.current_question_index : state.currentIdx
    const currentIdx = Math.min(Math.max(requestedIdx, 0), Math.max(nextQuestions.length - 1, 0))

    return {
      questions: nextQuestions,
      currentIdx,
      selectedOption: null,
      timeLeft: nextQuestions[currentIdx]?.time_budget_sec ?? state.timeLeft,
      runningScore: liveState.running_score ?? state.runningScore,
      liveRank: liveState.live_rank ?? state.liveRank,
      totalParticipants: liveState.total_participants ?? state.totalParticipants,
      streak: liveState.streak ?? liveState.best_streak ?? state.streak,
      switchCount: liveState.switch_count ?? state.switchCount,
      flaggedQuestionIds: Array.isArray(liveState.flagged_question_ids) ? liveState.flagged_question_ids : state.flaggedQuestionIds,
      bookmarkedQuestionIds: Array.isArray(liveState.bookmarked_question_ids) ? liveState.bookmarked_question_ids : state.bookmarkedQuestionIds,
      status: liveState.status || 'live',
      lastResult: null,
    }
  }),

  setCurrentIdx: (currentIdx) => set(state => ({
    currentIdx,
    selectedOption: null,
    timeLeft: state.questions[currentIdx]?.time_budget_sec ?? state.timeLeft,
    lastResult: null,
  })),

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
  toggleFlaggedQuestion: (questionId) => set(state => {
    const flaggedQuestionIds = state.flaggedQuestionIds.includes(questionId)
      ? state.flaggedQuestionIds.filter(id => id !== questionId)
      : [...state.flaggedQuestionIds, questionId]
    return { flaggedQuestionIds }
  }),
  toggleBookmarkedQuestion: (questionId) => set(state => {
    const bookmarkedQuestionIds = state.bookmarkedQuestionIds.includes(questionId)
      ? state.bookmarkedQuestionIds.filter(id => id !== questionId)
      : [...state.bookmarkedQuestionIds, questionId]
    return { bookmarkedQuestionIds }
  }),

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
    flaggedQuestionIds: [], bookmarkedQuestionIds: [],
  }),
}))
