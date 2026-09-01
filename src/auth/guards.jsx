import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { canAccessRoute, isReviewRole, roleFromPath } from '../auth/permission'

// Full-screen loading matched to the app aesthetic.
function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-abyss" role="status" aria-label="Loading">
      <div className="loader" />
    </div>
  )
}

// Requires an authenticated session. Redirects to /login if not.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <RouteLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

// Protects a role-specific area, e.g. /learner/*, and enforces status rules.
// Props: role ('learner' | 'trainer' | 'recruiter' | 'admin')
export function RoleGuard({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  // Wrong role -> unauthorized.
  if (user.role !== role) {
    return <Navigate to="/unauthorized" replace />
  }

  const area = roleFromPath(location.pathname)
  if (!canAccessRoute(user.role, location.pathname) && area !== user.role) {
    return <Navigate to="/unauthorized" replace />
  }

  // Status gating for review roles (trainer / recruiter).
  if (isReviewRole(user.role)) {
    if (user.status === 'pending') {
      return <Navigate to={`/${user.role}/pending`} replace />
    }
    if (user.status === 'rejected') {
      return <Navigate to={`/${user.role}/rejected`} replace />
    }
    if (user.status !== 'active') {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

// Redirects to the correct dashboard once authenticated, keeps anonymous
// users on the page (e.g. login already redirects).
export function RequireLoggedIn({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <RouteLoader />
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />
  return children
}
