export async function readApiErrorMessage(res, fallback = 'Something went wrong. Try again.') {
  const contentType = res.headers.get('content-type') || ''

  const stringifyMessage = (value) => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) return value.map(stringifyMessage).filter(Boolean).join(', ') || fallback
    if (typeof value === 'object') {
      return value.detail || value.error || value.message || value.msg || value.title || JSON.stringify(value)
    }
    return fallback
  }

  try {
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (typeof data === 'string') return data
      return stringifyMessage(data?.detail || data?.error || data?.message || data)
    }

    const text = await res.text()
    if (text) return text
  } catch {
    // fall through to fallback
  }

  return fallback
}

export const API_BASE = '/api/v1'

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item === undefined || item === null || item === '') return
        searchParams.append(key, String(item))
      })
      return
    }
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token)
      return data.access_token
    }
  } catch {
    // swallow
  }
  return null
}

export async function apiRequest(path, options = {}) {
  const {
    token,
    query,
    body,
    headers = {},
    method = 'GET',
    fallbackError = 'Something went wrong. Try again.',
    signal,
  } = options

  const baseHeaders = { ...headers }

  let requestBody = body
  const isJsonBody = body !== undefined
    && body !== null
    && typeof body !== 'string'
    && !(body instanceof FormData)
    && !(body instanceof URLSearchParams)

  if (isJsonBody) {
    baseHeaders['Content-Type'] = baseHeaders['Content-Type'] || 'application/json'
    requestBody = JSON.stringify(body)
  }

  const url = `${API_BASE}${path}${buildQueryString(query)}`

  const send = (bearer) => {
    const h = { ...baseHeaders }
    if (bearer) h.Authorization = `Bearer ${bearer}`
    return fetch(url, { method, headers: h, body: requestBody, signal })
  }

  let activeToken = token
  let res = await send(activeToken)

  if (res.status === 401 && activeToken) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      activeToken = newToken
      res = await send(activeToken)
    }
  }

  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
    throw new Error(await readApiErrorMessage(res, fallbackError))
  }

  if (!res.ok) {
    throw new Error(await readApiErrorMessage(res, fallbackError))
  }

  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }

  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function loadRazorpayCheckoutScript() {
  if (typeof window === 'undefined') return false
  if (window.Razorpay) return true

  const existing = document.querySelector('script[data-razorpay-checkout="true"]')
  if (existing) {
    if (window.Razorpay) return true
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true })
      existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'))
    document.body.appendChild(script)
  })
}

export const formatRupees = (paise) => {
  const numeric = Number(paise || 0)
  return `₹${(numeric / 100).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(numeric / 100) ? 0 : 2,
  })}`
}

export async function getArenaQuizzes(token, query = {}) {
  return apiRequest('/arena/quizzes', { token, query, fallbackError: 'Failed to load contests.' })
}

export async function getArenaQuizDetail(token, quizId) {
  return apiRequest(`/arena/quizzes/${quizId}`, { token, fallbackError: 'Failed to load quiz detail.' })
}

export async function getAdminArenaEvents(token, query = {}) {
  return apiRequest('/admin/arena/events', { token, query, fallbackError: 'Failed to load admin contests.' })
}

export async function getAdminArenaEvent(token, contestId) {
  return apiRequest(`/admin/arena/events/${contestId}`, { token, fallbackError: 'Failed to load contest detail.' })
}

export async function createAdminArenaEvent(token, body) {
  return apiRequest('/admin/arena/events', {
    token,
    method: 'POST',
    body,
    fallbackError: 'Failed to create contest.',
  })
}

export async function updateAdminArenaEvent(token, contestId, body) {
  return apiRequest(`/admin/arena/events/${contestId}`, {
    token,
    method: 'PUT',
    body,
    fallbackError: 'Failed to update contest.',
  })
}

export async function updateAdminArenaEventStatus(token, contestId, status) {
  return apiRequest(`/admin/arena/events/${contestId}/status`, {
    token,
    method: 'PATCH',
    body: { status },
    fallbackError: 'Failed to update contest status.',
  })
}

export async function deleteAdminArenaEvent(token, contestId) {
  return apiRequest(`/admin/arena/events/${contestId}`, {
    token,
    method: 'DELETE',
    fallbackError: 'Failed to delete contest.',
  })
}

export async function addAdminArenaQuestion(token, contestId, body) {
  return apiRequest(`/admin/arena/events/${contestId}/questions`, {
    token,
    method: 'POST',
    body,
    fallbackError: 'Failed to add question.',
  })
}

export async function bulkAddAdminArenaQuestions(token, contestId, body) {
  return apiRequest(`/admin/arena/events/${contestId}/questions/bulk`, {
    token,
    method: 'POST',
    body,
    fallbackError: 'Failed to bulk add questions.',
  })
}

export async function removeAdminArenaQuestion(token, contestId, questionId) {
  return apiRequest(`/admin/arena/events/${contestId}/questions/${questionId}`, {
    token,
    method: 'DELETE',
    fallbackError: 'Failed to remove question.',
  })
}

export async function reorderAdminArenaQuestions(token, contestId, body) {
  return apiRequest(`/admin/arena/events/${contestId}/questions/reorder`, {
    token,
    method: 'PUT',
    body,
    fallbackError: 'Failed to reorder questions.',
  })
}

export async function publishAdminArenaResults(token, contestId) {
  return apiRequest(`/admin/arena/events/${contestId}/publish-results`, {
    token,
    method: 'POST',
    fallbackError: 'Failed to publish results.',
  })
}

export async function getAdminArenaRegistrations(token, contestId) {
  return apiRequest(`/admin/arena/events/${contestId}/registrations`, {
    token,
    fallbackError: 'Failed to load registrations.',
  })
}

export async function getArenaDashboard(token, quizId) {
  return apiRequest(`/arena/quizzes/${quizId}/dashboard`, { token, fallbackError: 'Failed to load lobby.' })
}

export async function getArenaLiveState(token, quizId) {
  return apiRequest(`/arena/quizzes/${quizId}/live-state`, { token, fallbackError: 'Failed to load live state.' })
}

export async function patchArenaLiveState(token, quizId, body) {
  return apiRequest(`/arena/quizzes/${quizId}/live-state`, {
    token,
    method: 'PATCH',
    body,
    fallbackError: 'Failed to save live state.',
  })
}

export async function registerArenaQuiz(token, quizId, body = { payment_method: 'wallet' }) {
  return apiRequest(`/arena/quizzes/${quizId}/register`, {
    token,
    method: 'POST',
    body,
    fallbackError: 'Registration failed.',
  })
}

export async function getArenaWalletSummary(token) {
  return apiRequest('/arena/wallet', { token, fallbackError: 'Failed to load wallet.' })
}

export async function getArenaWalletTransactions(token, query = {}) {
  return apiRequest('/arena/wallet/transactions', { token, query, fallbackError: 'Failed to load wallet transactions.' })
}

export async function getArenaMyCertificates(token) {
  return apiRequest('/arena/certificates', { token, fallbackError: 'Failed to load certificates.' })
}

export async function getArenaMyStats(token) {
  return apiRequest('/arena/my-stats', { token, fallbackError: 'Failed to load arena stats.' })
}

export async function getArenaTierHistory(token, query = {}) {
  return apiRequest('/arena/my-stats/tier-history', { token, query, fallbackError: 'Failed to load tier history.' })
}

export async function getArenaSubjectMastery(token) {
  return apiRequest('/arena/my-subject-mastery', { token, fallbackError: 'Failed to load subject mastery.' })
}

export async function getArenaTrophyHistory(token, query = {}) {
  return apiRequest('/arena/my-trophy-history', { token, query, fallbackError: 'Failed to load trophy history.' })
}

export async function createWalletTopUpOrder(token, amountRupees) {
  return apiRequest('/wallet/add-money', {
    token,
    method: 'POST',
    body: { amount_rupees: amountRupees },
    fallbackError: 'Unable to create Razorpay order right now.',
  })
}

export function friendlyArenaAccessMessage(status) {
  if (status === 403) return "You haven't registered for this contest."
  if (status === 409) return 'This quiz has already started.'
  if (status === 400) return "You can't access this quiz right now."
  return 'You cannot access this contest right now.'
}
