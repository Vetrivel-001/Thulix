// This file intentionally exports both the AuthProvider component and the
// useAuth hook (required for context consumption) from a single module.
/* eslint-disable react/only-export-components */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as auth from './AuthService'
import { ROLE_DASHBOARDS } from './permission'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount.
  useEffect(() => {
    const session = auth.getStoredSession()
    setUser(session)
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const u = await auth.loginWithEmail(credentials)
    if (credentials.remember) auth.saveSession(u)
    else auth.saveSession(u)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (fn, data) => {
    const u = await fn(data)
    auth.saveSession(u)
    setUser(u)
    return u
  }, [])

  const registerLearner = useCallback((data) => register(auth.registerLearner, data), [register])
  const registerTrainer = useCallback((data) => register(auth.registerTrainer, data), [register])
  const registerRecruiter = useCallback((data) => register(auth.registerRecruiter, data), [register])

  const logout = useCallback(async () => {
    await auth.logout()
    setUser(null)
  }, [])

  // Where to send the user based on their role (after login/signup).
  const dashboardPath = useCallback(() => (user ? ROLE_DASHBOARDS[user.role] || '/' : '/login'), [user])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      registerLearner,
      registerTrainer,
      registerRecruiter,
      dashboardPath,
      getAllUsers: auth.getAllUsers,
      getPendingApplications: auth.getPendingApplications,
      getStats: auth.getStats,
      setUserStatus: auth.setUserStatus,
    }),
    [user, loading, login, logout, registerLearner, registerTrainer, registerRecruiter, dashboardPath],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
