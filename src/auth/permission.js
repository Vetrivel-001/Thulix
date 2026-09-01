// Permission / RBAC helpers.
// Each role maps to a route prefix and has a public-facing label + dashboard path.

export const ROLES = {
  learner: 'learner',
  trainer: 'trainer',
  recruiter: 'recruiter',
  admin: 'admin',
}

export const ROLE_LABELS = {
  learner: 'Learner',
  trainer: 'Trainer',
  recruiter: 'Recruiter',
  admin: 'Admin',
}

// Default dashboard route per role (used for post-login redirect).
export const ROLE_DASHBOARDS = {
  learner: '/learner/dashboard',
  trainer: '/trainer/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard',
}

// Route prefix each role is allowed to access.
export const ROLE_HOME = {
  learner: '/learner',
  trainer: '/trainer',
  recruiter: '/recruiter',
  admin: '/admin',
}

// Roles that require admin approval before becoming active.
export const REVIEW_ROLES = ['trainer', 'recruiter']

export function isReviewRole(role) {
  return REVIEW_ROLES.includes(role)
}

export function isAdmin(role) {
  return role === ROLES.admin
}

// Determine whether a path (prefix) belongs to a given role area.
// e.g. "/learner/dashboard" => "learner"
export function roleFromPath(pathname) {
  const first = (pathname || '').split('/')[1]
  return ROLES[first] || null
}

export function canAccessRoute(role, pathname) {
  const area = roleFromPath(pathname)
  if (!area) return true
  return role === area
}
