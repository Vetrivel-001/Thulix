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

// Default destination per role (used for post-login redirect).
// Learners, trainers and recruiters have no dashboard — they land on the public
// home page, where the Navbar account menu exposes their Profile / Application.
export const ROLE_DASHBOARDS = {
  learner: '/',
  trainer: '/',
  recruiter: '/',
  admin: '/admin/dashboard',
}

// Route prefix each role is allowed to access.
export const ROLE_HOME = {
  learner: '/learner',
  trainer: '/trainer',
  recruiter: '/recruiter',
  admin: '/admin',
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
