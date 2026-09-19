import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Navigate } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Phone, Mail, User, CalendarDays, Clock, FileText, ShieldAlert, ArrowRight,
  Pencil, Check, X, Presentation, BadgeIndianRupee, Wrench, Lock, Briefcase, Building2, AtSign, Globe, MapPin,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  TRAINER_APPLICATION_STATUS_LABELS,
  RECRUITER_APPLICATION_STATUS_LABELS,
} from '../auth/AuthService'
import { ROLE_LABELS } from '../auth/permission'
import { EASE } from '../lib/animations'
import FormField from '../components/auth/FormField'
import { SelectBlock } from '../components/auth/FormControls'
import SkillsInput from '../components/auth/SkillsInput'
import {
  sendEnrollmentUpdate,
  sendTrainerApplicationUpdate,
  sendRecruiterApplicationUpdate,
} from '../auth/EmailService'
import { DEGREE_OPTIONS, COURSE_OPTIONS, TRAINER_EXPERIENCE_OPTIONS, SKILL_SUGGESTIONS } from '../lib/catalog'

const ENROLLMENT_TINT = '#8B5CF6'
const STATUS_TINT = { new: '#F59E0B', contacted: '#06B6D4', in_progress: '#8B5CF6', enrolled: '#10B981', closed: '#94A3B8' }
const TRAINER_STATUS_TINT = { new: '#F59E0B', reviewed: '#06B6D4', accepted: '#10B981', not_accepted: '#EC4899', closed: '#94A3B8' }
const RECRUITER_STATUS_TINT = { new: '#F59E0B', reviewed: '#06B6D4', accepted: '#10B981', not_accepted: '#EC4899', closed: '#94A3B8' }

// ₹ amount from a stored numeric salary (never a formatted string).
function formatSalary(value) {
  const n = Number(value)
  if (!n) return ''
  return `₹${n.toLocaleString('en-IN')} / month`
}

// Builds editable draft state from a stored enrollment, mapping custom values
// back onto the "Other" branch of the select lists.
function enrollmentDraft(e = {}) {
  const degree = DEGREE_OPTIONS.includes(e.departmentOrDegree) ? e.departmentOrDegree : (e.departmentOrDegree ? 'Other' : '')
  const course = COURSE_OPTIONS.includes(e.neededCourse) ? e.neededCourse : (e.neededCourse ? 'Other' : '')
  return {
    name: e.name || '',
    phone: e.phone || '',
    degree,
    otherDegree: e.otherDegree || (degree === 'Other' ? e.departmentOrDegree || '' : ''),
    course,
    otherCourse: e.otherCourse || (course === 'Other' ? e.neededCourse || '' : ''),
  }
}

// Builds editable draft state from a stored trainer application, mapping a
// custom course back onto the "Other" branch of the select list.
function applicationDraft(a = {}) {
  const course = COURSE_OPTIONS.includes(a.courseOffered) ? a.courseOffered : (a.courseOffered ? 'Other' : '')
  return {
    name: a.name || '',
    phone: a.phone || '',
    course,
    otherCourse: a.otherCourse || (course === 'Other' ? a.courseOffered || '' : ''),
    knownSkills: Array.isArray(a.knownSkills) ? [...a.knownSkills] : [],
    experience: a.experience || '',
    salaryExpectation: a.salaryExpectation != null && a.salaryExpectation !== '' ? String(a.salaryExpectation) : '',
  }
}

// Builds editable draft state from a stored recruiter application.
function recruiterDraft(a = {}) {
  return {
    name: a.name || '',
    phone: a.phone || '',
    jobTitle: a.jobTitle || '',
    companyName: a.companyName || '',
    companyEmail: a.companyEmail || '',
    website: a.website || '',
    companyLocation: a.companyLocation || '',
  }
}

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 px-4 py-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-electric/15 text-electric" aria-hidden="true">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">{label}</p>
        <p className="truncate text-sm font-medium text-snow">{value || '—'}</p>
      </div>
    </div>
  )
}

// Read-only system field shown inside the edit forms (application number,
// email, status, dates). Visible but not editable.
function LockedField({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/70">{label}</p>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(148,163,184,0.12)] bg-abyss-2/40 px-4 py-3">
        <span className="truncate text-sm font-medium text-snow">{value || '—'}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-mist/70">
          <Lock size={11} aria-hidden="true" /> Locked
        </span>
      </div>
    </div>
  )
}

// Visual lifecycle: New → Contacted → In Progress → Enrolled → Closed.
function StatusTimeline({ current }) {
  const idx = ENROLLMENT_STATUSES.indexOf(current)
  return (
    <div className="border-t border-[rgba(148,163,184,0.1)] px-5 py-5 sm:px-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Enrollment Progress</p>
      <div className="flex items-center">
        {ENROLLMENT_STATUSES.map((key, i) => {
          const done = i < idx
          const active = i === idx
          const color = STATUS_TINT[key]
          return (
            <div key={key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold transition-colors"
                  style={{
                    background: done || active ? `${color}22` : 'rgba(148,163,184,0.08)',
                    color: done || active ? color : '#64748B',
                    border: `1px solid ${done || active ? color : 'rgba(148,163,184,0.2)'}`,
                    boxShadow: active ? `0 0 0 4px ${color}14` : undefined,
                  }}
                >
                  {i + 1}
                </span>
                <span className={`whitespace-nowrap text-[9px] font-medium uppercase tracking-wide ${active ? 'text-snow' : done ? 'text-mist' : 'text-mist/40'}`}>
                  {ENROLLMENT_STATUS_LABELS[key]}
                </span>
              </div>
              {i < ENROLLMENT_STATUSES.length - 1 && (
                <div className="relative mx-1.5 mt-3 h-0.5 min-w-3 flex-1 self-start">
                  <div className="absolute inset-0 rounded-full bg-[rgba(148,163,184,0.15)]" />
                  {done && <div className="absolute inset-y-0 left-0 rounded-full" style={{ background: color }} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Learner profile + enrollment enquiry summary. Never renders password/auth data.
export default function ProfilePage() {
  const { user, getLearnerEnrollment, updateLearnerEnrollment, getTrainerApplication, updateTrainerApplication, getRecruiterApplication, updateRecruiterApplication } = useAuth()
  const [enrollment, setEnrollment] = useState(null)
  const [application, setApplication] = useState(null)
  const [recruiterApplication, setRecruiterApplication] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)
  const [editingApp, setEditingApp] = useState(false)
  const [appDraft, setAppDraft] = useState(null)
  const [savingApp, setSavingApp] = useState(false)
  const [saveAppError, setSaveAppError] = useState('')
  const [saveAppOk, setSaveAppOk] = useState(false)
  const [editingRcr, setEditingRcr] = useState(false)
  const [rcrDraft, setRcrDraft] = useState(null)
  const [savingRcr, setSavingRcr] = useState(false)
  const [saveRcrError, setSaveRcrError] = useState('')
  const [saveRcrOk, setSaveRcrOk] = useState(false)

  useEffect(() => {
    if (user?.role === 'learner') setEnrollment(getLearnerEnrollment(user.id) || null)
    if (user?.role === 'trainer') setApplication(getTrainerApplication(user.id) || null)
    if (user?.role === 'recruiter') setRecruiterApplication(getRecruiterApplication(user.id) || null)
  }, [user, getLearnerEnrollment, getTrainerApplication, getRecruiterApplication])

  const roleLabel = ROLE_LABELS[user?.role] || 'Member'

  if (user?.role === 'learner' && user?.status === 'rejected') return <Navigate to="/" replace />

  const startEdit = () => {
    setDraft(enrollmentDraft(enrollment || {}))
    setSaveError('')
    setSaveOk(false)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setDraft(null)
    setSaveError('')
  }

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  const startAppEdit = () => {
    setAppDraft(applicationDraft(application || {}))
    setSaveAppError('')
    setSaveAppOk(false)
    setEditingApp(true)
  }

  const cancelAppEdit = () => {
    setEditingApp(false)
    setAppDraft(null)
    setSaveAppError('')
  }

  const setAppField = (key, value) => setAppDraft((d) => ({ ...d, [key]: value }))

  const saveAppEdit = async () => {
    setSavingApp(true)
    setSaveAppError('')
    try {
      const updated = await updateTrainerApplication(user.id, {
        name: appDraft.name,
        phone: appDraft.phone,
        courseOffered: appDraft.course === 'Other' ? appDraft.otherCourse : appDraft.course,
        otherCourse: appDraft.course === 'Other' ? appDraft.otherCourse : '',
        knownSkills: appDraft.knownSkills,
        experience: appDraft.experience,
        salaryExpectation: appDraft.salaryExpectation,
      })
      setApplication(updated)
      setEditingApp(false)
      setAppDraft(null)
      setSaveAppOk(true)
      // Update notification (DEVELOPMENT/MOCK) — never blocks the save.
      try {
        await sendTrainerApplicationUpdate(updated)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] update email not delivered', emailErr)
      }
    } catch (err) {
      setSaveAppError(err.message || 'Could not save your changes. Please try again.')
    } finally {
      setSavingApp(false)
    }
  }

  const startRcrEdit = () => {
    setRcrDraft(recruiterDraft(recruiterApplication || {}))
    setSaveRcrError('')
    setSaveRcrOk(false)
    setEditingRcr(true)
  }

  const cancelRcrEdit = () => {
    setEditingRcr(false)
    setRcrDraft(null)
    setSaveRcrError('')
  }

  const setRcrField = (key, value) => setRcrDraft((d) => ({ ...d, [key]: value }))

  const saveRcrEdit = async () => {
    setSavingRcr(true)
    setSaveRcrError('')
    try {
      const updated = await updateRecruiterApplication(user.id, {
        name: rcrDraft.name,
        phone: rcrDraft.phone,
        jobTitle: rcrDraft.jobTitle,
        companyName: rcrDraft.companyName,
        companyEmail: rcrDraft.companyEmail,
        website: rcrDraft.website,
        companyLocation: rcrDraft.companyLocation,
      })
      setRecruiterApplication(updated)
      setEditingRcr(false)
      setRcrDraft(null)
      setSaveRcrOk(true)
      // Update notification (DEVELOPMENT/MOCK) — never blocks the save.
      try {
        await sendRecruiterApplicationUpdate(updated)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] update email not delivered', emailErr)
      }
    } catch (err) {
      setSaveRcrError(err.message || 'Could not save your changes. Please try again.')
    } finally {
      setSavingRcr(false)
    }
  }

  const saveEdit = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateLearnerEnrollment(user.id, {
        name: draft.name,
        phone: draft.phone,
        departmentOrDegree: draft.degree === 'Other' ? draft.otherDegree : draft.degree,
        neededCourse: draft.course === 'Other' ? draft.otherCourse : draft.course,
        otherDegree: draft.degree === 'Other' ? draft.otherDegree : '',
        otherCourse: draft.course === 'Other' ? draft.otherCourse : '',
      })
      setEnrollment(updated)
      setEditing(false)
      setDraft(null)
      setSaveOk(true)
      // Update notification (DEVELOPMENT/MOCK) — never blocks the save.
      try {
        await sendEnrollmentUpdate(updated)
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn('[EmailService:DEVELOPMENT-ONLY] update email not delivered', emailErr)
      }
    } catch (err) {
      setSaveError(err.message || 'Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-abyss pt-28 pb-20">
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
        <motion.div {...rise(0.05)}>
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gradient">My Account</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-snow sm:text-4xl">My Profile</h1>
            <p className="mt-2 text-mist">Your details and course enquiry on Thulix.</p>
          </header>

          {/* Identity card */}
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.15)] bg-abyss-2/60 p-6 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: `${ENROLLMENT_TINT}44` }} />
            <div className="relative flex flex-wrap items-center gap-5">
              <span
                className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white"
                style={{ background: `linear-gradient(120deg,#06B6D4,#8B5CF6)` }}
              >
                {(enrollment?.name || user?.name || 'U').slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-xl font-bold text-snow">{enrollment?.name || user?.name}</p>
                <p className="truncate text-sm text-mist">{enrollment?.email || user?.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-[rgba(139,92,246,0.15)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neon">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Enrollment enquiry (learners) */}
          {user?.role === 'learner' ? (
            <motion.div {...rise(0.1)} className="mt-6">
              {enrollment ? (
                <div className="overflow-hidden rounded-3xl border border-[rgba(139,92,246,0.2)] bg-abyss-2/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.1)] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap size={18} className="text-neon" aria-hidden="true" />
                      <h2 className="font-heading text-lg font-bold text-snow">My Enrollment</h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          background: `${STATUS_TINT[enrollment.enrollmentStatus] || '#F59E0B'}1a`,
                          color: STATUS_TINT[enrollment.enrollmentStatus] || '#F59E0B',
                        }}
                      >
                        {ENROLLMENT_STATUS_LABELS[enrollment.enrollmentStatus] || enrollment.enrollmentStatus}
                      </span>
                      {!editing ? (
                        <button
                          type="button"
                          onClick={startEdit}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.3)] bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-colors hover:bg-neon/20"
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {saveOk ? (
                    <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.25)] bg-success/10 px-6 py-2.5 text-xs font-medium text-success">
                      <Check size={14} aria-hidden="true" /> Your enrollment details were updated.
                    </div>
                  ) : null}

                  {editing ? (
                    <div className="space-y-4 p-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <LockedField label="Application No" value={enrollment.enquiryId} />
                        <LockedField label="Email" value={enrollment.email} />
                        <LockedField
                          label="Status"
                          value={ENROLLMENT_STATUS_LABELS[enrollment.enrollmentStatus] || enrollment.enrollmentStatus}
                        />
                        <LockedField
                          label="Submission Date"
                          value={enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : ''}
                        />
                      </div>
                      <p className="text-[11px] text-mist/70">
                        Some details like your application number, status and dates can&apos;t be changed here.
                      </p>
                      {saveError ? (
                        <p role="alert" className="rounded-xl border border-error/40 bg-error/10 px-4 py-2.5 text-xs font-medium text-error">
                          {saveError}
                        </p>
                      ) : null}
                      <FormField
                        label="Full Name"
                        id="edit-name"
                        value={draft.name}
                        onChange={(e) => setField('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                      <FormField
                        label="Phone Number"
                        id="edit-phone"
                        type="tel"
                        value={draft.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                      <SelectBlock
                        label="Department / Degree"
                        id="edit-degree"
                        options={DEGREE_OPTIONS}
                        value={draft.degree}
                        onChange={(v) => setField('degree', v)}
                      />
                      {draft.degree === 'Other' ? (
                        <FormField
                          label="Please specify your degree"
                          id="edit-otherDegree"
                          value={draft.otherDegree}
                          onChange={(e) => setField('otherDegree', e.target.value)}
                          placeholder="e.g. B.Com, Diploma in ECE"
                          required
                        />
                      ) : null}
                      <SelectBlock
                        label="Needed Course"
                        id="edit-course"
                        options={COURSE_OPTIONS}
                        value={draft.course}
                        onChange={(v) => setField('course', v)}
                      />
                      {draft.course === 'Other' ? (
                        <FormField
                          label="Please specify your course"
                          id="edit-otherCourse"
                          value={draft.otherCourse}
                          onChange={(e) => setField('otherCourse', e.target.value)}
                          placeholder="e.g. Cloud Computing, DevOps"
                          required
                        />
                      ) : null}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          <Check size={15} aria-hidden="true" /> {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:text-snow disabled:opacity-60"
                        >
                          <X size={15} aria-hidden="true" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                      <Field icon={FileText} label="Application No" value={enrollment.enquiryId} />
                      <Field icon={User} label="Full Name" value={enrollment.name} />
                      <Field icon={Mail} label="Email" value={enrollment.email} />
                      <Field icon={Phone} label="Phone" value={enrollment.phone} />
                      <Field icon={GraduationCap} label="Department / Degree" value={enrollment.departmentOrDegree} />
                      <Field icon={BookOpen} label="Interested Course" value={enrollment.neededCourse} />
                      <Field
                        icon={CalendarDays}
                        label="Submission Date"
                        value={enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : ''}
                      />
                      <Field
                        icon={Clock}
                        label="Last Updated"
                        value={enrollment.updatedAt ? new Date(enrollment.updatedAt).toLocaleDateString() : ''}
                      />
                    </div>
                  )}

                  <StatusTimeline current={enrollment.enrollmentStatus} />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-abyss-2/40 p-6 text-sm text-mist">
                  <ShieldAlert size={18} className="text-neon" />
                  No enrollment record found for this account.
                </div>
              )}
            </motion.div>
          ) : null}

          {/* Trainer application (trainers) */}
          {user?.role === 'trainer' ? (
            <motion.div {...rise(0.1)} className="mt-6">
              {application ? (
                <div className="overflow-hidden rounded-3xl border border-[rgba(6,182,212,0.25)] bg-abyss-2/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.1)] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <Presentation size={18} className="text-electric" aria-hidden="true" />
                      <h2 className="font-heading text-lg font-bold text-snow">My Trainer Application</h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          background: `${TRAINER_STATUS_TINT[application.applicationStatus] || '#F59E0B'}1a`,
                          color: TRAINER_STATUS_TINT[application.applicationStatus] || '#F59E0B',
                        }}
                      >
                        {TRAINER_APPLICATION_STATUS_LABELS[application.applicationStatus] || application.applicationStatus}
                      </span>
                      {!editingApp ? (
                        <button
                          type="button"
                          onClick={startAppEdit}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(6,182,212,0.3)] bg-electric/10 px-3 py-1.5 text-xs font-semibold text-electric transition-colors hover:bg-electric/20"
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {saveAppOk ? (
                    <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.25)] bg-success/10 px-6 py-2.5 text-xs font-medium text-success">
                      <Check size={14} aria-hidden="true" /> Your trainer application was updated.
                    </div>
                  ) : null}

                  {editingApp ? (
                    <div className="space-y-4 p-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <LockedField label="Application No" value={application.applicationId} />
                        <LockedField label="Email" value={application.email} />
                        <LockedField
                          label="Status"
                          value={
                            TRAINER_APPLICATION_STATUS_LABELS[application.applicationStatus] || application.applicationStatus
                          }
                        />
                        <LockedField
                          label="Submission Date"
                          value={application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ''}
                        />
                      </div>
                      <p className="text-[11px] text-mist/70">
                        Some details like your application number, status and dates can&apos;t be changed here.
                      </p>
                      {saveAppError ? (
                        <p role="alert" className="rounded-xl border border-error/40 bg-error/10 px-4 py-2.5 text-xs font-medium text-error">
                          {saveAppError}
                        </p>
                      ) : null}
                      <FormField
                        label="Full Name"
                        id="edit-app-name"
                        value={appDraft.name}
                        onChange={(e) => setAppField('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                      <FormField
                        label="Phone Number"
                        id="edit-app-phone"
                        type="tel"
                        value={appDraft.phone}
                        onChange={(e) => setAppField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                      <SelectBlock
                        label="Course Offered"
                        id="edit-app-course"
                        options={COURSE_OPTIONS}
                        value={appDraft.course}
                        onChange={(v) => setAppField('course', v)}
                      />
                      {appDraft.course === 'Other' ? (
                        <FormField
                          label="Please specify your course"
                          id="edit-app-otherCourse"
                          value={appDraft.otherCourse}
                          onChange={(e) => setAppField('otherCourse', e.target.value)}
                          placeholder="e.g. Cloud Computing, DevOps"
                          required
                        />
                      ) : null}
                      <SkillsInput
                        id="edit-app-skills"
                        label="Known Skills"
                        value={appDraft.knownSkills}
                        onChange={(v) => setAppField('knownSkills', v)}
                        suggestions={SKILL_SUGGESTIONS}
                      />
                      <SelectBlock
                        label="Experience"
                        id="edit-app-experience"
                        options={TRAINER_EXPERIENCE_OPTIONS}
                        value={appDraft.experience}
                        onChange={(v) => setAppField('experience', v)}
                      />
                      <FormField
                        label="Salary Expectation (₹ / month)"
                        id="edit-app-salary"
                        type="number"
                        value={appDraft.salaryExpectation}
                        onChange={(e) => setAppField('salaryExpectation', e.target.value)}
                        placeholder="e.g. 65000"
                        required
                      />
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={saveAppEdit}
                          disabled={savingApp}
                          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          <Check size={15} aria-hidden="true" /> {savingApp ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelAppEdit}
                          disabled={savingApp}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:text-snow disabled:opacity-60"
                        >
                          <X size={15} aria-hidden="true" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                      <Field icon={FileText} label="Application No" value={application.applicationId} />
                      <Field icon={User} label="Full Name" value={application.name} />
                      <Field icon={Mail} label="Email" value={application.email} />
                      <Field icon={Phone} label="Phone" value={application.phone} />
                      <Field icon={BookOpen} label="Course Offered" value={application.courseOffered} />
                      <Field icon={Wrench} label="Known Skills" value={(application.knownSkills || []).join(', ')} />
                      <Field icon={Presentation} label="Experience" value={application.experience} />
                      <Field icon={BadgeIndianRupee} label="Salary Expectation" value={formatSalary(application.salaryExpectation)} />
                      <Field
                        icon={CalendarDays}
                        label="Submission Date"
                        value={application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ''}
                      />
                      <Field
                        icon={Clock}
                        label="Last Updated"
                        value={application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : ''}
                      />
                    </div>
                  )}

                  <p className="border-t border-[rgba(148,163,184,0.1)] px-6 py-3 text-[11px] text-mist">
                    Our team will review your application and contact you using the details provided.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(6,182,212,0.2)] bg-abyss-2/40 p-6 text-sm text-mist">
                  <ShieldAlert size={18} className="text-electric" />
                  No trainer application found for this account.
                </div>
              )}
            </motion.div>
          ) : null}

          {/* Recruiter application (recruiters) */}
          {user?.role === 'recruiter' ? (
            <motion.div {...rise(0.1)} className="mt-6">
              {recruiterApplication ? (
                <div className="overflow-hidden rounded-3xl border border-[rgba(16,185,129,0.25)] bg-abyss-2/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.1)] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <Briefcase size={18} className="text-mint" aria-hidden="true" />
                      <h2 className="font-heading text-lg font-bold text-snow">My Recruiter Application</h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          background: `${RECRUITER_STATUS_TINT[recruiterApplication.applicationStatus] || '#F59E0B'}1a`,
                          color: RECRUITER_STATUS_TINT[recruiterApplication.applicationStatus] || '#F59E0B',
                        }}
                      >
                        {RECRUITER_APPLICATION_STATUS_LABELS[recruiterApplication.applicationStatus] || recruiterApplication.applicationStatus}
                      </span>
                      {!editingRcr ? (
                        <button
                          type="button"
                          onClick={startRcrEdit}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(16,185,129,0.3)] bg-mint/10 px-3 py-1.5 text-xs font-semibold text-mint transition-colors hover:bg-mint/20"
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {saveRcrOk ? (
                    <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.25)] bg-success/10 px-6 py-2.5 text-xs font-medium text-success">
                      <Check size={14} aria-hidden="true" /> Your recruiter application was updated.
                    </div>
                  ) : null}

                  {editingRcr ? (
                    <div className="space-y-4 p-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <LockedField label="Application No" value={recruiterApplication.applicationId} />
                        <LockedField label="Email" value={recruiterApplication.email} />
                        <LockedField
                          label="Status"
                          value={
                            RECRUITER_APPLICATION_STATUS_LABELS[recruiterApplication.applicationStatus] ||
                            recruiterApplication.applicationStatus
                          }
                        />
                        <LockedField
                          label="Submission Date"
                          value={recruiterApplication.createdAt ? new Date(recruiterApplication.createdAt).toLocaleDateString() : ''}
                        />
                      </div>
                      <p className="text-[11px] text-mist/70">
                        Some details like your application number, email, status and dates can&apos;t be changed here.
                      </p>
                      {saveRcrError ? (
                        <p role="alert" className="rounded-xl border border-error/40 bg-error/10 px-4 py-2.5 text-xs font-medium text-error">
                          {saveRcrError}
                        </p>
                      ) : null}
                      <FormField
                        label="Full Name"
                        id="edit-rcr-name"
                        value={rcrDraft.name}
                        onChange={(e) => setRcrField('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                      <FormField
                        label="Phone Number"
                        id="edit-rcr-phone"
                        type="tel"
                        value={rcrDraft.phone}
                        onChange={(e) => setRcrField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                      <FormField
                        label="Job Title"
                        id="edit-rcr-jobTitle"
                        value={rcrDraft.jobTitle}
                        onChange={(e) => setRcrField('jobTitle', e.target.value)}
                        placeholder="e.g. Talent Acquisition Lead"
                        required
                      />
                      <FormField
                        label="Company Name"
                        id="edit-rcr-companyName"
                        value={rcrDraft.companyName}
                        onChange={(e) => setRcrField('companyName', e.target.value)}
                        placeholder="Acme Corp"
                        required
                      />
                      <FormField
                        label="Company Email / Domain"
                        id="edit-rcr-companyEmail"
                        value={rcrDraft.companyEmail}
                        onChange={(e) => setRcrField('companyEmail', e.target.value)}
                        placeholder="careers@company.com or company.com"
                        required
                      />
                      <FormField
                        label="Company Website"
                        id="edit-rcr-website"
                        type="url"
                        value={rcrDraft.website}
                        onChange={(e) => setRcrField('website', e.target.value)}
                        placeholder="https://company.com"
                        note="Optional."
                      />
                      <FormField
                        label="Company Location"
                        id="edit-rcr-companyLocation"
                        value={rcrDraft.companyLocation}
                        onChange={(e) => setRcrField('companyLocation', e.target.value)}
                        placeholder="e.g. Bengaluru, India"
                        required
                      />
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={saveRcrEdit}
                          disabled={savingRcr}
                          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          <Check size={15} aria-hidden="true" /> {savingRcr ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelRcrEdit}
                          disabled={savingRcr}
                          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.2)] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:text-snow disabled:opacity-60"
                        >
                          <X size={15} aria-hidden="true" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                      <Field icon={FileText} label="Application No" value={recruiterApplication.applicationId} />
                      <Field icon={User} label="Full Name" value={recruiterApplication.name} />
                      <Field icon={Mail} label="Work Email" value={recruiterApplication.email} />
                      <Field icon={Phone} label="Phone" value={recruiterApplication.phone} />
                      <Field icon={Briefcase} label="Job Title" value={recruiterApplication.jobTitle} />
                      <Field icon={Building2} label="Company Name" value={recruiterApplication.companyName} />
                      <Field icon={AtSign} label="Company Email / Domain" value={recruiterApplication.companyEmail} />
                      <Field icon={Globe} label="Company Website" value={recruiterApplication.website} />
                      <Field icon={MapPin} label="Company Location" value={recruiterApplication.companyLocation} />
                      <Field
                        icon={CalendarDays}
                        label="Submission Date"
                        value={recruiterApplication.createdAt ? new Date(recruiterApplication.createdAt).toLocaleDateString() : ''}
                      />
                      <Field
                        icon={Clock}
                        label="Last Updated"
                        value={recruiterApplication.updatedAt ? new Date(recruiterApplication.updatedAt).toLocaleDateString() : ''}
                      />
                    </div>
                  )}

                  <p className="border-t border-[rgba(148,163,184,0.1)] px-6 py-3 text-[11px] text-mist">
                    Our team will review your application and contact you using the details provided.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(16,185,129,0.2)] bg-abyss-2/40 p-6 text-sm text-mist">
                  <ShieldAlert size={18} className="text-mint" />
                  No recruiter application found for this account.
                </div>
              )}
            </motion.div>
          ) : null}

          <motion.div {...rise(0.15)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30"
            >
              Back to Home <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}