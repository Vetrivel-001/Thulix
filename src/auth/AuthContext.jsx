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

  // Learner course-enrollment flow: create account + enquiry, then keep the
  // learner authenticated (session saved exactly like the other registers).
  const enrollLearner = useCallback(async (data) => {
    const result = await auth.createLearnerEnrollment(data)
    auth.saveSession(result.user)
    setUser(result.user)
    return result
  }, [])

  // Trainer application flow: create account + application, then keep the
  // trainer authenticated (session saved exactly like the other registers).
  const enrollTrainer = useCallback(async (data) => {
    const result = await auth.createTrainerApplication(data)
    auth.saveSession(result.user)
    setUser(result.user)
    return result
  }, [])

  // Recruiter application flow: create account + application, then keep the
  // recruiter authenticated (session saved exactly like the other registers).
  const enrollRecruiter = useCallback(async (data) => {
    const result = await auth.createRecruiterApplication(data)
    auth.saveSession(result.user)
    setUser(result.user)
    return result
  }, [])

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
      enrollLearner,
      enrollTrainer,
      enrollRecruiter,
      dashboardPath,
      getAllUsers: auth.getAllUsers,
      getPendingApplications: auth.getPendingApplications,
      getRejectedApplications: auth.getRejectedApplications,
      getStats: auth.getStats,
      setUserStatus: auth.setUserStatus,
      deleteUser: auth.deleteUser,
      getLearnerEnrollments: auth.getLearnerEnrollments,
      getLearnerEnrollment: auth.getLearnerEnrollment,
      updateEnrollmentStatus: auth.updateEnrollmentStatus,
      updateLearnerEnrollment: auth.updateLearnerEnrollment,
      getTrainerApplications: auth.getTrainerApplications,
      getTrainerApplication: auth.getTrainerApplication,
      updateTrainerApplication: auth.updateTrainerApplication,
      updateTrainerApplicationStatus: auth.updateTrainerApplicationStatus,
      getRecruiterApplications: auth.getRecruiterApplications,
      getRecruiterApplication: auth.getRecruiterApplication,
      updateRecruiterApplication: auth.updateRecruiterApplication,
      updateRecruiterApplicationStatus: auth.updateRecruiterApplicationStatus,
      ENROLLMENT_STATUS_LABELS: auth.ENROLLMENT_STATUS_LABELS,
      TRAINER_APPLICATION_STATUS_LABELS: auth.TRAINER_APPLICATION_STATUS_LABELS,
      RECRUITER_APPLICATION_STATUS_LABELS: auth.RECRUITER_APPLICATION_STATUS_LABELS,
    }),
    [user, loading, login, logout, registerLearner, registerTrainer, enrollLearner, enrollTrainer, enrollRecruiter, dashboardPath],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
