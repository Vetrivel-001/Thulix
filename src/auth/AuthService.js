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
    createdAt: '2026-08-01T09:15:00.000Z',
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
  if (user && user.password === password) return sanitize(user)
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

export function getStats() {
  const users = getAllUsers()
  const byRole = { learner: 0, trainer: 0, recruiter: 0, admin: 0 }
  let active = 0
  let pending = 0
  let rejected = 0
  for (const u of users) {
    if (byRole[u.role] != null) byRole[u.role] += 1
    if (u.status === 'active') active += 1
    else if (u.status === 'pending') pending += 1
    else if (u.status === 'rejected') rejected += 1
  }
  const sorted = [...users].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return {
    total: users.length,
    active,
    pending,
    rejected,
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
