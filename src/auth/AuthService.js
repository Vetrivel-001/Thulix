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

// Reused for optional URL validation in the recruiter application service.
// Explicit extension so the mock service also loads under plain Node ESM
// (used by offline test harnesses).
import { isUrl } from './validation.js'

const STORAGE_KEY = 'thulix_session'

// ---------------------------------------------------------------------------
// Development / test users. Marked clearly as mock data.
//   learner  -> active (no approval needed)
//   trainer  -> active (has a trainer APPLICATION with its own lifecycle)
//   recruiter-> active (has a recruiter APPLICATION with its own lifecycle)
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
    password: 'password123', role: 'trainer', status: 'active',
    phone: '+91 90000 00001', courseOffered: 'Full Stack Development', otherCourse: '',
    knownSkills: ['JavaScript', 'React', 'Node.js'], experience: '5–10 Years', salaryExpectation: 85000,
    applicationStatus: 'new', applicationId: 'TRN-2026-DEVT1',
    createdAt: '2026-08-10T10:30:00.000Z', updatedAt: '2026-08-10T10:30:00.000Z',
  },
  {
    id: 'dev-recruiter', name: 'Dev Recruiter', email: 'recruiter@thulix.app',
    password: 'password123', role: 'recruiter', status: 'active',
    phone: '+91 90000 00002', jobTitle: 'Talent Acquisition Lead',
    companyName: 'Acme Recruiting Co.', companyEmail: 'hire@acme.com', website: 'https://acme.com',
    companyLocation: 'Bengaluru, India',
    applicationStatus: 'new', applicationId: 'REC-2026-DEVR1',
    createdAt: '2026-08-12T14:45:00.000Z', updatedAt: '2026-08-12T14:45:00.000Z',
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
    const idx = users.findIndex((u) => u.email === dev.email)
    if (idx === -1) {
      users.push({ ...dev })
    } else if ((dev.role === 'trainer' || dev.role === 'recruiter') && !users[idx].applicationStatus) {
      // Migrate legacy stored dev-trainer / dev-recruiter records (old pending
      // approval shape) to the new application model.
      users[idx] = { ...users[idx], ...dev }
    }
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

// Compare phone numbers by their digits only, so "+91 90000 00000" and
// "9000000000" are treated as the same number.
function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

// Duplicate checks used by the onboarding forms (email / mobile already tied to
// an existing account). An optional excludeId lets a user keep their OWN email
// or phone when editing — only *another* account's values are treated as taken.
export function isEmailTaken(email, excludeId) {
  const key = String(email || '').trim().toLowerCase()
  if (!key) return false
  return [...readStore(), ...DEV_USERS].some(
    (u) => u.id !== excludeId && String(u.email || '').trim().toLowerCase() === key,
  )
}

export function isPhoneTaken(phone, excludeId) {
  const digits = normalizePhone(phone)
  if (!digits) return false
  return [...readStore(), ...DEV_USERS].some((u) => u.id !== excludeId && normalizePhone(u.phone) === digits)
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

// Learner edits their OWN enquiry from the profile. Always available; system
// fields (enquiryId, createdAt, enrollmentStatus) are never touched here — the
// admin owns the lifecycle status.
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

// ---------------------------------------------------------------------------
// TRAINER APPLICATION (become-a-trainer enquiry) — DEVELOPMENT / MOCK
// A trainer application creates an account AND an application record. Trainers
// do NOT go through the trainer/recruiter approval workflow; the application
// has its own lifecycle:
//   new → reviewed → accepted / not_accepted → closed
// Replace with API calls when a real backend exists.
// ---------------------------------------------------------------------------

export const TRAINER_APPLICATION_STATUSES = ['new', 'reviewed', 'accepted', 'not_accepted', 'closed']

export const TRAINER_APPLICATION_STATUS_LABELS = {
  new: 'New',
  reviewed: 'Reviewed',
  accepted: 'Accepted',
  not_accepted: 'Not Accepted',
  closed: 'Closed',
}

let applicationSeq = 0
// Human-readable trainer application reference, e.g. TRN-2026-A1B2C3.
function nextApplicationId() {
  applicationSeq += 1
  const year = new Date().getFullYear()
  const frag = (Date.now().toString(36) + applicationSeq + Math.random().toString(36).slice(2, 7)).slice(-6).toUpperCase()
  return `TRN-${year}-${frag}`
}

// Display-safe reference: real applicationId, or a stable fallback derived from
// the record so older stored trainers still show one.
function displayApplicationId(u) {
  if (u && u.applicationId) return u.applicationId
  const year = new Date(u?.createdAt || Date.now()).getFullYear()
  const tail = String(u?.id || '').replace('usr_', '').slice(0, 6).toUpperCase()
  return `TRN-${year}-${tail || 'APP'}`
}

// Known skills may arrive as an array (chip input) or a comma-separated string.
// Trimmed, de-duplicated (case-insensitive, first occurrence wins), no blanks.
function normalizeSkills(value) {
  const list = Array.isArray(value) ? value : String(value || '').split(',')
  const seen = new Set()
  const out = []
  for (const raw of list) {
    const s = String(raw).trim()
    if (!s) continue
    const key = s.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(s)
  }
  return out
}

// Salary is stored as a clean number (never a formatted "₹50,000" string).
function toAmount(value) {
  const digits = String(value ?? '').replace(/[^0-9]/g, '')
  return digits ? Number(digits) : 0
}

// Creates the trainer account + application record. Throws on duplicate email.
// Returns { user } (session-safe) and { application } (profile/admin-safe).
export async function createTrainerApplication(data) {
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
    courseOffered: data.courseOffered || '',
    otherCourse: data.otherCourse || '',
    knownSkills: normalizeSkills(data.knownSkills),
    experience: data.experience || '',
    salaryExpectation: toAmount(data.salaryExpectation),
    password: data.password,
    role: 'trainer',
    status: 'active',
    applicationStatus: 'new',
    applicationId: nextApplicationId(),
    id: uniqueId(),
    createdAt: now,
    updatedAt: now,
  }
  users.push(record)
  writeStore(users)
  return { user: sanitize(record), application: sanitizeTrainerApplication(record) }
}

// Admin-facing list of trainer applications (never includes passwords).
export function getTrainerApplications() {
  return getAllUsers().filter((u) => u.role === 'trainer' && u.status === 'active')
}

// A trainer's own application by user id (used by the profile view).
export function getTrainerApplication(id) {
  const all = [...readStore(), ...DEV_USERS]
  const u = all.find((x) => x.id === id && x.role === 'trainer')
  return sanitizeTrainerApplication(u || null)
}

// Admin updates an application's lifecycle status. Persisted to the store.
export async function updateTrainerApplicationStatus(id, applicationStatus) {
  await delay(300)
  if (!TRAINER_APPLICATION_STATUSES.includes(applicationStatus)) {
    throw new Error('Invalid application status.')
  }
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'trainer')
  if (idx === -1) throw new Error('Trainer application not found.')
  users[idx].applicationStatus = applicationStatus
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeTrainerApplication(users[idx])
}

// Trainer edits their OWN application from the profile. Always available; system
// fields (applicationId, createdAt, applicationStatus) are never touched here —
// the admin owns the lifecycle status.
export async function updateTrainerApplication(id, patch = {}) {
  await delay(300)
  const name = String(patch.name || '').trim()
  const phone = String(patch.phone || '').trim()
  const courseOffered = String(patch.courseOffered || '').trim()
  const experience = String(patch.experience || '').trim()
  const knownSkills = normalizeSkills(patch.knownSkills)
  const salaryExpectation = toAmount(patch.salaryExpectation)
  if (!name) throw new Error('Please enter your full name.')
  if (!phone) throw new Error('Please enter your phone number.')
  if (!courseOffered) throw new Error('Please choose a course you can offer.')
  if (!experience) throw new Error('Please choose your experience level.')
  if (!knownSkills.length) throw new Error('Please add at least one skill.')
  if (!salaryExpectation) throw new Error('Please enter your salary expectation.')
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'trainer')
  if (idx === -1) throw new Error('Trainer application not found.')
  users[idx].name = name
  users[idx].phone = phone
  users[idx].courseOffered = courseOffered
  users[idx].otherCourse = String(patch.otherCourse || '').trim()
  users[idx].knownSkills = knownSkills
  users[idx].experience = experience
  users[idx].salaryExpectation = salaryExpectation
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeTrainerApplication(users[idx])
}

// ---------------------------------------------------------------------------
// RECRUITER APPLICATION (become-a-hiring-partner) — DEVELOPMENT / MOCK
// A recruiter application creates an account AND an application record.
// Recruiters do NOT wait for account approval — the application has its own
// lifecycle (new → reviewed → accepted / not_accepted → closed) and the
// account is created usable (status active) on submission.
// Replace with API calls when a real backend exists.
// ---------------------------------------------------------------------------

export const RECRUITER_APPLICATION_STATUSES = ['new', 'reviewed', 'accepted', 'not_accepted', 'closed']

export const RECRUITER_APPLICATION_STATUS_LABELS = {
  new: 'New',
  reviewed: 'Reviewed',
  accepted: 'Accepted',
  not_accepted: 'Not Accepted',
  closed: 'Closed',
}

let recruiterSeq = 0
// Human-readable recruiter application reference, e.g. REC-2026-A1B2C3.
function nextRecruiterId() {
  recruiterSeq += 1
  const year = new Date().getFullYear()
  const frag = (Date.now().toString(36) + recruiterSeq + Math.random().toString(36).slice(2, 7)).slice(-6).toUpperCase()
  return `REC-${year}-${frag}`
}

// Display-safe reference: real applicationId, or a stable fallback derived from
// the record so older stored recruiters still show one.
function displayRecruiterApplicationId(u) {
  if (u && u.applicationId) return u.applicationId
  const year = new Date(u?.createdAt || Date.now()).getFullYear()
  const tail = String(u?.id || '').replace('usr_', '').slice(0, 6).toUpperCase()
  return `REC-${year}-${tail || 'APP'}`
}

// Creates the recruiter account + application record. Throws on duplicate
// email. Returns { user } (session-safe) and { application } (profile/admin-safe).
export async function createRecruiterApplication(data) {
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
    jobTitle: String(data.jobTitle || '').trim(),
    companyName: String(data.companyName || '').trim(),
    companyEmail: String(data.companyEmail || '').trim(),
    website: String(data.website || '').trim(),
    companyLocation: String(data.companyLocation || '').trim(),
    password: data.password,
    role: 'recruiter',
    status: 'active',
    applicationStatus: 'new',
    applicationId: nextRecruiterId(),
    id: uniqueId(),
    createdAt: now,
    updatedAt: now,
  }
  users.push(record)
  writeStore(users)
  return { user: sanitize(record), application: sanitizeRecruiterApplication(record) }
}

// Admin-facing list of recruiter applications (never includes passwords).
export function getRecruiterApplications() {
  return getAllUsers().filter((u) => u.role === 'recruiter' && u.status === 'active')
}

// A recruiter's own application by user id (used by the profile view).
export function getRecruiterApplication(id) {
  const all = [...readStore(), ...DEV_USERS]
  const u = all.find((x) => x.id === id && x.role === 'recruiter')
  return sanitizeRecruiterApplication(u || null)
}

// Admin updates an application's lifecycle status. Persisted to the store.
export async function updateRecruiterApplicationStatus(id, applicationStatus) {
  await delay(300)
  if (!RECRUITER_APPLICATION_STATUSES.includes(applicationStatus)) {
    throw new Error('Invalid application status.')
  }
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'recruiter')
  if (idx === -1) throw new Error('Recruiter application not found.')
  users[idx].applicationStatus = applicationStatus
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeRecruiterApplication(users[idx])
}

// Recruiter edits their OWN application from the profile. Always available;
// system fields (applicationId, email, createdAt, applicationStatus) are never
// touched here — the admin owns the lifecycle status.
export async function updateRecruiterApplication(id, patch = {}) {
  await delay(300)
  const name = String(patch.name || '').trim()
  const phone = String(patch.phone || '').trim()
  const jobTitle = String(patch.jobTitle || '').trim()
  const companyName = String(patch.companyName || '').trim()
  const companyEmail = String(patch.companyEmail || '').trim()
  const website = String(patch.website || '').trim()
  const companyLocation = String(patch.companyLocation || '').trim()
  if (!name) throw new Error('Please enter your full name.')
  if (!phone) throw new Error('Please enter your phone number.')
  if (!jobTitle) throw new Error('Please enter your job title.')
  if (!companyName) throw new Error('Please enter your company name.')
  if (!companyEmail) throw new Error('Please enter your company email / domain.')
  if (website && !isUrl(website)) throw new Error('Please enter a valid website URL.')
  if (!companyLocation) throw new Error('Please enter your company location.')
  const users = reconcileStore()
  const idx = users.findIndex((u) => u.id === id && u.role === 'recruiter')
  if (idx === -1) throw new Error('Recruiter application not found.')
  users[idx].name = name
  users[idx].phone = phone
  users[idx].jobTitle = jobTitle
  users[idx].companyName = companyName
  users[idx].companyEmail = companyEmail
  users[idx].website = website
  users[idx].companyLocation = companyLocation
  users[idx].updatedAt = new Date().toISOString()
  writeStore(users)
  return sanitizeRecruiterApplication(users[idx])
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
      companyLocation: u.companyLocation || '',
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
    application: {
      courseOffered: u.courseOffered || '',
      otherCourse: u.otherCourse || '',
      knownSkills: normalizeSkills(u.knownSkills),
      experience: u.experience || '',
      salaryExpectation: toAmount(u.salaryExpectation),
      jobTitle: u.jobTitle || '',
      companyName: u.companyName || '',
      companyEmail: u.companyEmail || '',
      website: u.website || '',
      companyLocation: u.companyLocation || '',
      phone: u.phone || '',
      applicationStatus: u.applicationStatus || 'new',
      applicationId: u.role === 'recruiter' ? displayRecruiterApplicationId(u) : displayApplicationId(u),
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

// Sanitized trainer application view (no password / auth internals).
function sanitizeTrainerApplication(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    phone: u.phone || '',
    courseOffered: u.courseOffered || '',
    otherCourse: u.otherCourse || '',
    knownSkills: normalizeSkills(u.knownSkills),
    experience: u.experience || '',
    salaryExpectation: toAmount(u.salaryExpectation),
    applicationStatus: u.applicationStatus || 'new',
    applicationId: displayApplicationId(u),
    createdAt: u.createdAt || '',
    updatedAt: u.updatedAt || u.createdAt || '',
  }
}

// Sanitized recruiter application view (no password / auth internals).
function sanitizeRecruiterApplication(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    phone: u.phone || '',
    jobTitle: u.jobTitle || '',
    companyName: u.companyName || '',
    companyEmail: u.companyEmail || '',
    website: u.website || '',
    companyLocation: u.companyLocation || '',
    applicationStatus: u.applicationStatus || 'new',
    applicationId: displayRecruiterApplicationId(u),
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
