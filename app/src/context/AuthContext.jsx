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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem('access_token', session.access_token)
        if (session.refresh_token) {
          localStorage.setItem('refresh_token', session.refresh_token)
        }
        setToken(session.access_token)
        try {
          const res = await fetch(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          if (res.ok) {
            const userData = await res.json()
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            setNeedsOnboarding(isProfileIncomplete(userData))
          }
        } catch {
          // ignore fetch errors — still set session
        }
        // After Google OAuth redirect, send user back to where they came from
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !didOAuthRedirect.current) {
          const redirect = sessionStorage.getItem('authRedirect')
          if (redirect) {
            didOAuthRedirect.current = true
            sessionStorage.removeItem('authRedirect')
            navigate(redirect)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        setNeedsOnboarding(false)
      }
      setLoading(false)
    })

    // If no supabase session at all, also try local token (non-OAuth users)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const storedToken = localStorage.getItem('access_token')
        if (!storedToken) {
          setLoading(false)
          return
        }
        fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
          .then(res => {
            if (res.ok) return res.json()
            throw new Error('Unauthorized')
          })
          .then(userData => {
            setToken(storedToken)
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            setNeedsOnboarding(isProfileIncomplete(userData))
          })
          .catch(() => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
          })
          .finally(() => setLoading(false))
      }
    }).catch(() => setLoading(false))

    const handleUnauthorized = () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
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
