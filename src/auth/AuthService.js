// ============================================================================
// DEVELOPMENT / MOCK AUTH SERVICE  (isolated)
//
// This is a clean, isolated mock intended for frontend development only.
// It simulates login, registration, OTP, verification and approval WITHOUT a
// real backend.
//
// WHEN A REAL BACKEND EXISTS: replace the implementations in this file with
// API calls (fetch/axios) returning the same shapes. Components never import
// this directly except through src/auth/AuthContext.jsx, so the swap is
// contained to this one layer.
// ============================================================================

const STORAGE_KEY = 'thulix_session'

// ---------------------------------------------------------------------------
// Development / test users. Marked clearly as mock data.
//   learner  -> active (no approval needed)
//   trainer  -> pending (requires admin approval)
//   recruiter-> pending (requires admin approval)
//   admin    -> active (internal/testing only)
// ---------------------------------------------------------------------------
const DEV_USERS = [
  {
    id: 'dev-learner', name: 'Dev Learner', email: 'learner@thulix.app',
    password: 'password123', role: 'learner', status: 'active',
    phone: '+91 90000 00000', departmentOrDegree: 'BCA', neededCourse: 'Full Stack Development',
    enrollmentStatus: 'new', enquiryId: 'THX-2026-DEVL1',
    createdAt: '2026-08-01T09:15:00.000Z', updatedAt: '2026-08-01T09:15:00.000Z',
  },
  {
    id: 'dev-trainer', name: 'Dev Trainer', email: 'trainer@thulix.app',
    password: 'password123', role: 'trainer', status: 'pending',
    professionalTitle: 'Senior Full-Stack Engineer', expertise: 'Web Development', experience: '6–10 years',
    createdAt: '2026-08-10T10:30:00.000Z',
  },
  {
    id: 'dev-recruiter', name: 'Dev Recruiter', email: 'recruiter@thulix.app',
    password: 'password123', role: 'recruiter', status: 'pending',
    companyName: 'Acme Recruiting Co.', industry: 'Technology', companyLocation: 'Bengaluru, India',
    createdAt: '2026-08-12T14:45:00.000Z',
  },
  {
    id: 'dev-admin', name: 'Dev Admin', email: 'admin@thulix.app',
    password: 'password123', role: 'admin', status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
]

// ---------------------------------------------------------------------------
// In-browser user store (simulates a database across sessions in the frontend).
// ---------------------------------------------------------------------------
function readStore() {
  try {
    return JSON.parse(localStorage.getItem('thulix_users') || '[]')
  } catch {
    return []
  }
}

function writeStore(users) {
  localStorage.setItem('thulix_users', JSON.stringify(users))
}

function seedDevUsers() {
  const users = readStore()
  for (const dev of DEV_USERS) {
    if (!users.some((u) => u.email === dev.email)) users.push({ ...dev })
  }
  writeStore(users)
}

// ---------------------------------------------------------------------------
// Public session storage
// ---------------------------------------------------------------------------
export function saveSession(user) {
  const safe = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

function sanitize(user) {
  if (!user) return null
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
}

function findUserByEmail(email) {
  const all = [...readStore(), ...DEV_USERS]
  const e = String(email || '').trim().toLowerCase()
  return all.find((u) => String(u.email || '').trim().toLowerCase() === e) || null
}

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms))

// ---------------------------------------------------------------------------
// AUTH METHODS — swap these internals when the backend is ready.
// ---------------------------------------------------------------------------

export async function loginWithEmail({ email, password }) {
  await delay(700)
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    // Deactivated learners are barred from sign-in (they have no dashboard guard).
    if (user.role === 'learner' && user.status === 'rejected') {
      throw new Error('Your account has been deactivated. Please contact support.')
    }
    return sanitize(user)
  }
  throw new Error('Invalid email or password.')
}

// Google OAuth integration point.
// When OAuth is configured, call the provider here and return:
//   { user: { id, name, email, role, status } }
export async function loginWithGoogle() {
  await delay(700)
  // Not configured — do not fake success. Throw a clear message.
  throw new Error('Google sign-in is not configured yet. Use email and password instead.')
}

export async function sendOtp(phone) {
  await delay(700)
  if (!/^\+?[0-9]{8,15}$/.test(String(phone || '').trim())) {
    throw new Error('Please enter a valid phone number.')
  }
  return { ok: true, devCode: '123456' }
}

export async function verifyOtp(code) {
  await delay(600)
  if (String(code || '').trim() !== '123456') throw new Error('Invalid verification code.')
  return { ok: true }
}

// Collision-proof id: timestamp base36 + counter + random fragment. Two quick
// registrations in the same millisecond can no longer produce the same id.
let idCounter = 0
function uniqueId() {
  idCounter += 1
  const ts = Date.now().toString(36)
  const rnd = Math.random().toString(36).slice(2, 8)
  return `usr_${ts}_${idCounter}_${rnd}`
}

// Registration — returns the newly created sanitized user.
function createUser(payload) {
  const users = readStore()
  const existing = users.find((u) => String(u.email).toLowerCase() === String(payload.email).toLowerCase())
  if (existing) throw new Error('An account with this email already exists.')
  const record = { ...payload, id: uniqueId(), createdAt: new Date().toISOString() }
  const user = { ...record }
  delete user.password
  users.push(record)
  writeStore(users)
  return sanitize(user)
}

export async function registerLearner(data) {
  await delay(700)
  return createUser({ ...data, role: 'learner', status: 'active' })
}

export async function registerTrainer(data) {
  await delay(700)
  return createUser({ ...data, role: 'trainer', status: 'pending' })
}

export async function registerRecruiter(data) {
  await delay(700)
  return createUser({ ...data, role: 'recruiter', status: 'pending' })
}

// ---------------------------------------------------------------------------
// LEARNER ENROLLMENT (course enquiry) — DEVELOPMENT / MOCK
// A learner enrolment creates an account AND an enquiry record. Learners do
// NOT go through the trainer/recruiter approval workflow; the enquiry has its
// own lifecycle (new → contacted → in_progress → enrolled → closed).
// Replace with API calls when a real backend exists.
// ---------------------------------------------------------------------------

export const ENROLLMENT_STATUSES = ['new', 'contacted', 'in_progress', 'enrolled', 'closed']

export const ENROLLMENT_STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  enrolled: 'Enrolled',
  closed: 'Closed',
}

let enquirySeq = 0
// Human-readable application / enquiry reference, e.g. THX-2026-A1B2C3.
function nextEnquiryId() {
  enquirySeq += 1
  const year = new Date().getFullYear()
  const frag = (Date.now().toString(36) + enquirySeq + Math.random().toString(36).slice(2, 7)).slice(-6).toUpperCase()
  return `THX-${year}-${frag}`
}

// Display-safe reference: real enquiryId, or a stable fallback derived from the
// record so older stored learners (without an enquiryId) still show one.
function displayEnquiryId(u) {
  if (u && u.enquiryId) return u.enquiryId
  const year = new Date(u?.createdAt || Date.now()).getFullYear()
  const tail = String(u?.id || '').replace('usr_', '').slice(0, 6).toUpperCase()
  return `THX-${year}-${tail || 'ENQ'}`
}

// Creates the learner account + enrollment record. Throws on duplicate email.
// Returns { user } (session-safe) and { enrollment } (profile/admin-safe).
export async function createLearnerEnrollment(data) {
  await delay(700)
  const users = readStore()
  const email = String(data.email || '').trim().toLowerCase()
  if (users.some((u) => String(u.email || '').trim().toLowerCase() === email)) {
    throw new Error('An account with this email already exists.')
  }
  const now = new Date().toISOString()
  const record = {
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim(),
    phone: String(data.phone || '').trim(),
    departmentOrDegree: data.departmentOrDegree || '',
    neededCourse: data.neededCourse || '',
    otherCourse: data.otherCourse || '',
    otherDegree: data.otherDegree || '',
    password: data.password,
    role: 'learner',
    status: 'active',
    enrollmentStatus: 'new',
    enquiryId: nextEnquiryId(),
    id: uniqueId(),
    createdAt: now,
    updatedAt: now,
  }
  users.push(record)
  writeStore(users)
  return { user: sanitize(record), enrollment: sanitizeEnrollment(record) }
}

// Admin-facing list of active learner enquiries (never includes passwords).
export function getLearnerEnrollments() {
  return getAllUsers().filter((u) => u.role === 'learner' && u.status === 'active')
}

// A learner's own enrollment by user id (used by the profile view).
export function getLearnerEnrollment(id) {
  const all = [...readStore(), ...DEV_USERS]
  const u = all.find((x) => x.id === id && x.role === 'learner')
  return sanitizeEnrollment(u || null)
}

// Admin updates an enquiry's lifecycle status. Persisted to the store.
export async function updateEnrollmentStatus(id, enrollmentStatus) {
  await delay(300)
  if (!ENROLLMENT_STATUSES.includes(enrollmentStatus)) throw new Error('Invalid enrollment status.')
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'learner')
  if (idx === -1) throw new Error('Enrollment not found.')
  users[idx].enrollmentStatus = enrollmentStatus
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeEnrollment(users[idx])
}

// Learner edits their OWN enquiry from the profile. Locked once the admin has
// started acting on it (status leaves `new`). Preserves enquiryId + createdAt.
export async function updateLearnerEnrollment(id, patch = {}) {
  await delay(300)
  const name = String(patch.name || '').trim()
  const phone = String(patch.phone || '').trim()
  const degree = String(patch.departmentOrDegree || '').trim()
  const course = String(patch.neededCourse || '').trim()
  if (!name) throw new Error('Please enter your full name.')
  if (!phone) throw new Error('Please enter your phone number.')
  if (!degree) throw new Error('Please tell us your department / degree.')
  if (!course) throw new Error('Please choose an interested course.')
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'learner')
  if (idx === -1) throw new Error('Enrollment not found.')
  if (users[idx].enrollmentStatus !== 'new') {
    throw new Error('This enquiry is already being handled. Contact our admissions team to make changes.')
  }
  users[idx].name = name
  users[idx].phone = phone
  users[idx].departmentOrDegree = degree
  users[idx].neededCourse = course
  users[idx].otherDegree = String(patch.otherDegree || '').trim()
  users[idx].otherCourse = String(patch.otherCourse || '').trim()
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeEnrollment(users[idx])
}

export async function forgotPassword(email) {
  await delay(700)
  if (!findUserByEmail(email)) throw new Error('No account found with that email.')
  return { ok: true }
}

export async function resetPassword(email, password) {
  await delay(700)
  if (String(password).length < 8) throw new Error('Password must contain at least 8 characters.')
  const users = readStore()
  const idx = users.findIndex(
    (u) => String(u.email).toLowerCase() === String(email).trim().toLowerCase(),
  )
  if (idx === -1) throw new Error('No account found with that email.')
  users[idx].password = password
  writeStore(users)
  return { ok: true, verifiedUser: sanitize(users[idx]) }
}

export async function verifyEmail(token) {
  await delay(700)
  if (!token) throw new Error('Invalid verification link.')
  return { ok: true }
}

export async function resendVerification(_email) {
  await delay(700)
  return { ok: true }
}

export async function resendOtp() {
  await delay(700)
  return { ok: true }
}

export async function logout() {
  await delay(200)
  clearSession()
  return { ok: true }
}

// ---------------------------------------------------------------------------
// ADMIN DATA & ACTIONS (mock backend for the admin dashboard)
// ---------------------------------------------------------------------------

// Sanitized view for the admin UI: no password, plus role-specific context.
function sanitizeForAdmin(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt || '',
    meta: {
      professionalTitle: u.professionalTitle || '',
      expertise: u.expertise || '',
      experience: u.experience || '',
      companyName: u.companyName || '',
      industry: u.industry || '',
      companyLocation: u.companyLocation || '',
      companySize: u.companySize || '',
      phone: u.phone || '',
      degree: u.degree || '',
      city: u.city || '',
      jobTitle: u.jobTitle || '',
    },
    enrollment: {
      departmentOrDegree: u.departmentOrDegree || u.degree || '',
      neededCourse: u.neededCourse || '',
      otherCourse: u.otherCourse || '',
      otherDegree: u.otherDegree || '',
      enrollmentStatus: u.enrollmentStatus || 'new',
      enquiryId: displayEnquiryId(u),
      updatedAt: u.updatedAt || u.createdAt || '',
    },
  }
}

// Sanitized learner enrollment view (no password / auth internals).
function sanitizeEnrollment(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    phone: u.phone || '',
    departmentOrDegree: u.departmentOrDegree || u.degree || '',
    neededCourse: u.neededCourse || '',
    otherCourse: u.otherCourse || '',
    otherDegree: u.otherDegree || '',
    enrollmentStatus: u.enrollmentStatus || 'new',
    enquiryId: displayEnquiryId(u),
    createdAt: u.createdAt || '',
    updatedAt: u.updatedAt || u.createdAt || '',
  }
}

// Guarantee every stored record has a unique id. Legacy data created before
// collision-proof ids (or records that otherwise share an id) get reassigned,
// so admin actions keyed by id can never hit the wrong user.
function reconcileStore() {
  const users = readStore()
  const seen = new Set()
  let changed = false
  for (const u of users) {
    if (!u.id || seen.has(u.id)) {
      u.id = uniqueId()
      changed = true
    }
    seen.add(u.id)
  }
  if (changed) writeStore(users)
  return users
}

// Full, deduplicated list of all users (dev-seeded + registered), password stripped.
export function getAllUsers() {
  const users = reconcileStore()
  const seen = new Set()
  const all = [...users, ...DEV_USERS]
  const list = []
  for (const u of all) {
    const key = String(u.email || '').trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    list.push(sanitizeForAdmin(u))
  }
  return list
}

export function getPendingApplications() {
  return getAllUsers().filter(
    (u) => (u.role === 'trainer' || u.role === 'recruiter') && u.status === 'pending',
  )
}

// A rejected application = rejected trainer/recruiter/learner (deactivated learner
// is treated the same as a rejected application for the Rejected section).
export function isRejectedApplication(u) {
  return (
    (u.role === 'trainer' || u.role === 'recruiter' || u.role === 'learner') &&
    u.status === 'rejected'
  )
}

// Rejected applications (for the dedicated Rejected section).
export function getRejectedApplications() {
  return getAllUsers().filter(isRejectedApplication)
}

// Permanently remove a user/application from the store.
export async function deleteUser(id) {
  await delay(300)
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('User not found.')
  users.splice(idx, 1)
  writeStore(users)
  return { ok: true }
}

export function getStats() {
  const users = getAllUsers()
  const byRole = { learner: 0, trainer: 0, recruiter: 0, admin: 0 }
  let active = 0
  let pending = 0
  let rejected = 0
  let rejectedApps = 0
  for (const u of users) {
    // Rejected applications are NOT counted toward users or role totals.
    if (isRejectedApplication(u)) {
      rejected += 1
      rejectedApps += 1
      continue
    }
    if (byRole[u.role] != null) byRole[u.role] += 1
    if (u.status === 'active') active += 1
    else if (u.status === 'pending') pending += 1
    else if (u.status === 'rejected') rejected += 1
  }
  const nonRejected = users.filter((u) => !isRejectedApplication(u))
  const sorted = [...nonRejected].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return {
    total: nonRejected.length,
    active,
    pending,
    rejected,
    rejectedApps,
    byRole,
    recent: sorted.slice(0, 5),
  }
}

// Admin sets a user's approval status. Persisted to the store (works for
// newly-registered and dev-seeded users alike). Returns the updated user.
export async function setUserStatus(id, status) {
  await delay(300)
  const allowed = ['active', 'pending', 'rejected']
  if (!allowed.includes(status)) throw new Error('Invalid status.')
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('User not found.')
  users[idx].status = status
  writeStore(users)
  return sanitizeForAdmin(users[idx])
}

// Seed dev users on first load so the mock login works immediately.
seedDevUsers()
