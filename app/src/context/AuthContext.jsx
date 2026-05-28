import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const API = '/api/v1'

function isProfileIncomplete(userData) {
  return !userData?.college || !userData?.phone
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const navigate = useNavigate()
  const didOAuthRedirect = useRef(false)

  useEffect(() => {
    let cancelled = false

    const tryRefresh = async () => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return null
      try {
        const res = await fetch(`${API}/auth/refresh`, {
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

    const fetchMeWithRefresh = async (initialToken) => {
      let activeToken = initialToken
      let res = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      if (res.status === 401) {
        const newToken = await tryRefresh()
        if (!newToken) return null
        activeToken = newToken
        res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        })
      }
      if (!res.ok) return null
      return { userData: await res.json(), token: activeToken }
    }

    const applySession = (userData, accessToken) => {
      setToken(accessToken)
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setNeedsOnboarding(isProfileIncomplete(userData))
    }

    const clearSession = () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      setNeedsOnboarding(false)
    }

    const bootstrap = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return

        if (session) {
          localStorage.setItem('access_token', session.access_token)
          if (session.refresh_token) {
            localStorage.setItem('refresh_token', session.refresh_token)
          }
          const result = await fetchMeWithRefresh(session.access_token)
          if (cancelled) return
          if (result) applySession(result.userData, result.token)
          setLoading(false)
          return
        }

        const storedToken = localStorage.getItem('access_token')
        if (!storedToken) {
          setLoading(false)
          return
        }
        const result = await fetchMeWithRefresh(storedToken)
        if (cancelled) return
        if (result) {
          applySession(result.userData, result.token)
        } else {
          clearSession()
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clearSession()
        return
      }
      if (!session) return
      localStorage.setItem('access_token', session.access_token)
      if (session.refresh_token) {
        localStorage.setItem('refresh_token', session.refresh_token)
      }
      try {
        const res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) applySession(await res.json(), session.access_token)
      } catch {
        // ignore
      }
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !didOAuthRedirect.current) {
        const redirect = sessionStorage.getItem('authRedirect')
        if (redirect) {
          didOAuthRedirect.current = true
          sessionStorage.removeItem('authRedirect')
          navigate(redirect)
        }
      }
    })

    const handleUnauthorized = async () => {
      const newToken = await tryRefresh()
      if (newToken) {
        setToken(newToken)
        return
      }
      clearSession()
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      cancelled = true
      subscription.unsubscribe()
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid credentials')
    }
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
    setNeedsOnboarding(isProfileIncomplete(data.user))
  }, [])

  const register = useCallback(async ({ name, email, password, college, phone, batch }) => {
    const signupRes = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: name }),
    })
    const signupData = await signupRes.json()
    if (!signupRes.ok) {
      throw new Error(signupData.detail || 'Registration failed')
    }

    const accessToken = signupData.access_token
    const refreshToken = signupData.refresh_token

    const yearOfStudy = batch ? Number(batch) - 2018 : undefined
    const patchBody = {}
    if (college) patchBody.college = college
    if (phone) patchBody.phone = phone
    if (yearOfStudy !== undefined) patchBody.year_of_study = yearOfStudy

    if (Object.keys(patchBody).length > 0) {
      await fetch(`${API}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(patchBody),
      })
    }

    const meRes = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const userData = meRes.ok ? await meRes.json() : { email, full_name: name }

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
    setNeedsOnboarding(isProfileIncomplete(userData))
  }, [])

  const logout = useCallback(async () => {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      try {
        await fetch(`${API}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${storedToken}` },
        })
      } catch {
        // ignore network errors on logout
      }
    }
    await supabase.auth.signOut()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setNeedsOnboarding(false)
  }, [])

  const completeOnboarding = useCallback(async ({ name, college, phone, batch }) => {
    const activeToken = token || localStorage.getItem('access_token')
    const yearOfStudy = batch ? Number(batch) - 2018 : undefined
    const patchBody = {}
    if (name) patchBody.full_name = name
    if (college) patchBody.college = college
    if (phone) patchBody.phone = phone
    if (yearOfStudy !== undefined) patchBody.year_of_study = yearOfStudy

    const res = await fetch(`${API}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${activeToken}` },
      body: JSON.stringify(patchBody),
    })
    if (!res.ok) throw new Error('Failed to save profile. Please try again.')

    const meRes = await fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${activeToken}` } })
    if (meRes.ok) {
      const userData = await meRes.json()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    }
    setNeedsOnboarding(false)
  }, [token])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const updateProfile = useCallback(async (fields) => {
    const activeToken = token || localStorage.getItem('access_token')
    const res = await fetch(`${API}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${activeToken}` },
      body: JSON.stringify(fields),
    })
    if (!res.ok) throw new Error('Failed to update profile.')
    const userData = await res.json()
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loginWithGoogle, loading, needsOnboarding, completeOnboarding, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
